import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const orderId = params.id;
  if (!orderId || orderId === 'undefined') {
    return NextResponse.json({ status: 'error', message: 'Invalid ID' }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderCode: orderId },
      select: {
        createdAt: true,
        Shop: {
          select: {
            shopName: true,
            shopCode: true,
            shopOwnerPhone: true,
          },
        },
        User: {
          select: {
            fullName: true,
            phoneNumber: true,
            province: true,
            district: true,
            village: true,
          },
        },
        id: true,
        orderTotalCrateFee: true,
        orderSubTotalAmount: true,
        orderTotalAmount: true,
        orderDetails: {
          select: {
            id: true,
            orderDetailQty: true,
            orderDetailTotalAmount: true,
            Product: {
              select: {
                id: true,
                productName: true,
                promotionFreeQty: true,
                productPrice: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ status: 'error', message: 'Order not found' }, { status: 404 });
    }

    const transformedOrder = {
      id: order.id,
      createdAt: order.createdAt,
      shopName: order.Shop.shopName,
      shopCode: order.Shop.shopCode,
      shopPhone: order.Shop.shopOwnerPhone,
      orderTotalCrateFee: order.orderTotalCrateFee,
      orderSubtotalAmount: order.orderSubTotalAmount,
      orderTotalAmount: order.orderTotalAmount,
      customerName: order.User.fullName,
      customerPhone: order.User.phoneNumber,
      customerProvince: order.User.province,
      customerDistrict: order.User.district,
      customerVillage: order.User.village,
      orderDetails: order.orderDetails.map(detail => ({
        id: detail.id,
        orderDetailQty: detail.orderDetailQty,
        productId: detail.Product.id,
        productName: detail.Product.productName,
        totalPromotionQty: detail.Product.promotionFreeQty * detail.orderDetailQty,
        productPrice: detail.Product.productPrice,
        orderDetailTotalAmount: detail.orderDetailTotalAmount,
        images: detail.Product.images,
      })),
    };

    return NextResponse.json(
      {
        data: transformedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch order' }, { status: 500 });
  }
}
