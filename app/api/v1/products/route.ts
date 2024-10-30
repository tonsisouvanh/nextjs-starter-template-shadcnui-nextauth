import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// ====================================================== //
// ================== GET ALL PRODUCTS ================== //
// ====================================================== //
export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({});

    return NextResponse.json(
      {
        status: 'success',
        data: products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch products' }, { status: 500 });
  }
}
