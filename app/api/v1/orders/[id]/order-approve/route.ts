import prisma from '@/lib/prisma';
import { getLocalDateTime, handlePrismaError } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

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

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const orderId = params.id;
  const body = await req.json();
  const { orderStatus } = body;
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
  }

  const { user } = session;
  try {
    // Validate orderId
    if (!orderId || isNaN(parseInt(orderId))) {
      return NextResponse.json({ status: 'error', message: 'Invalid order ID' }, { status: 400 });
    }

    // Use Prisma transaction
    const result = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        orderStatus,
        remark: user?.name || null,
      },
    });

    if (!result) {
      return NextResponse.json({ status: 'error', message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Order approved successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error approving order:', error);
    await logError(req, error, req.body);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = handlePrismaError(error);
      return NextResponse.json({ status: 'error', message: prismaError.message }, { status: prismaError.status });
    }

    return NextResponse.json({ status: 'error', message: 'Failed to approve order' }, { status: 500 });
  }
}
