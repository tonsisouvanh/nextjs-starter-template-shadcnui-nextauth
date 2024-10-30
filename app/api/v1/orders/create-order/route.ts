import prisma from '@/lib/prisma';
import { getLocalDateTime, handlePrismaError } from '@/lib/utils';
import { handleRateLimit } from '@/lib/rateLimitHandler';
import { Prisma } from '@prisma/client';
import { Ratelimit } from '@upstash/ratelimit';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const OrderDataSchema = z.object({
  user: z.object({
    shop_id: z.number(),
    event_id: z.number(),
    full_name: z.string(),
    phone_number: z.string(),
    dob: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
    gender: z.enum(['MALE', 'FEMALE', 'LGBTQA+']),
    province: z.string(),
    district: z.string(),
    village: z.string(),
    accept_terms: z.boolean(),
  }),
  order_details: z.array(
    z.object({
      product_id: z.number(),
      order_detail_qty: z.number(),
    })
  ),
});

async function logError(req: NextRequest, error: any, requestBody: any) {
  try {
    await prisma.errorLog.create({
      data: {
        timestamp: getLocalDateTime(),
        endpoint: req.url,
        requestBody: JSON.stringify(requestBody),
        errorMessage: error.message,
        stackTrace: error.stack,
        created_at: getLocalDateTime(),
      },
    });
  } catch (logError) {
    console.error('Error logging to errorLog:', logError);
  }
}

async function findOrCreateUser(user: any, transaction: Prisma.TransactionClient) {
  const existingUser = await transaction.user.findFirst({
    where: {
      phoneNumber: user.phone_number,
    },
  });

  if (existingUser) {
    return transaction.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        fullName: user.full_name,
        dateOfBirth: getLocalDateTime(new Date(user.dob)),
        gender: user.gender,
        province: user.province,
        district: user.district,
        village: user.village,
        acceptTerms: user.accept_terms,
        updatedAt: getLocalDateTime(),
      },
    });
  }

  return transaction.user.create({
    data: {
      fullName: user.full_name,
      phoneNumber: user.phone_number,
      dateOfBirth: getLocalDateTime(new Date(user.dob)),
      gender: user.gender,
      province: user.province,
      district: user.district,
      village: user.village,
      acceptTerms: user.accept_terms,
      createdAt: getLocalDateTime(),
      updatedAt: getLocalDateTime(),
    },
  });
}

async function createOrder(user: any, createdUser: any, order_details: any, transaction: Prisma.TransactionClient) {
  let orderTotalCrateFee = 0;
  let orderSubTotalAmount = 0;
  let orderTotalAmount = 0;

  for (const orderDetail of order_details) {
    const product = await transaction.product.findFirst({
      where: {
        id: orderDetail.product_id,
      },
    });

    if (product) {
      // Calculate crate fee
      const crateFee =
        (product.crateQtyPerProduct + product.promotionFreeQty) *
        orderDetail.order_detail_qty *
        Number(product.cratePrice);
      orderTotalCrateFee += crateFee;

      // Calculate subtotal amount
      const subTotal = orderDetail.order_detail_qty * Number(product.productPrice);
      orderSubTotalAmount += subTotal;
    }
  }

  // Calculate total amount
  orderTotalAmount = orderSubTotalAmount + orderTotalCrateFee;

  return transaction.order.create({
    data: {
      userId: createdUser.id,
      shopId: user.shop_id,
      orderTotalCrateFee,
      orderSubTotalAmount,
      orderTotalAmount,
      eventId: user.event_id || 1,
      createdAt: getLocalDateTime(),
      updatedAt: getLocalDateTime(),
    },
  });
}

async function createOrderDetails(orderId: number, order_details: any, transaction: Prisma.TransactionClient) {
  const orderDetailPromises = order_details.map(async (orderDetail: any) => {
    const product = await transaction.product.findFirst({
      where: {
        id: orderDetail.product_id,
      },
    });

    if (!product) {
      throw new Error(`Product with ID ${orderDetail.product_id} not found`);
    }

    return transaction.orderDetail.create({
      data: {
        orderId: orderId,
        productId: orderDetail.product_id,
        orderDetailQty: orderDetail.order_detail_qty,
        crateQtyPerProduct: product.crateQtyPerProduct,
        promoQty: product.promotionFreeQty,
        pricePerItem: product.productPrice,
        cratePrice: product.cratePrice,
        orderDetailTotalAmount: orderDetail.order_detail_qty * Number(product.productPrice),
        createdAt: getLocalDateTime(),
        updatedAt: getLocalDateTime(),
      },
    });
  });

  return Promise.all(orderDetailPromises);
}

export async function POST(req: NextRequest) {
  // Handle rate limiting
  const rateLimitResponse = await handleRateLimit(req, { limiter: Ratelimit.slidingWindow(10, '1 m'), timeout: 3000 });
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await req.json();

    // Validate order data
    const validatedData = OrderDataSchema.safeParse(body);
    if (!validatedData.success) {
      const error = validatedData.error.errors[0];
      await logError(req, new Error(`${error.path}: ${error.message}`), body);
      return NextResponse.json({ status: 'error', message: `${error.path}: ${error.message}` }, { status: 400 });
    }

    // Destructure validated data
    const { user, order_details } = validatedData.data;

    // Use Prisma transaction
    const result = await prisma.$transaction(async transaction => {
      // Find or create user
      const createdUser = await findOrCreateUser(user, transaction);

      // Create order
      const createdOrder = await createOrder(user, createdUser, order_details, transaction);

      // Create order details
      await createOrderDetails(createdOrder.id, order_details, transaction);

      return createdOrder;
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Order created successfully',
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    await logError(req, error, req.body);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = handlePrismaError(error);
      return NextResponse.json({ status: 'error', message: prismaError.message }, { status: prismaError.status });
    }

    return NextResponse.json({ status: 'error', message: 'Failed to create order' }, { status: 500 });
  }
}
