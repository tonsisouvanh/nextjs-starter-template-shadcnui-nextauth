import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
// ====================================================== //
// ================== GET ALL SHOPS ================== //
// ====================================================== //
export async function GET(req: NextRequest) {
  try {
    const shops = await prisma.shop.findMany({
      where: {
        NOT: { active_at: null },
      },
      select: {
        id: true,
        shopCode: true,
        shopName: true,
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        data: shops,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch shops' }, { status: 500 });
  }
}
