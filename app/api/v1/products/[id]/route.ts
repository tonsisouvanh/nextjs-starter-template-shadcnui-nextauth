import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const productId = parseInt(params.id);
  if (isNaN(productId)) {
    return NextResponse.json({ status: 'error', message: 'Invalid ID' }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ status: 'error', message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        status: 'success',
        data: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch product' }, { status: 500 });
  }
}
