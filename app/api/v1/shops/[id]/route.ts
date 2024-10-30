import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const shopId = parseInt(params.id);
  if (isNaN(shopId)) {
    return NextResponse.json({ status: 'error', message: 'Invalid ID' }, { status: 400 });
  }

  try {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      //   select: {
      //     shopCode: true,
      //     shopName: true,
      //     shopOwnerName: true,
      //     shopOwnerPhone: true,
      //     shopProvince: true,
      //     shopDistrict: true,
      //     shopVillage: true,
      //     shopOwnerAccountName: true,
      //     shopOwnerAccountNo: true,
      //     shopSrName: true,
      //     shopSsName: true,
      //     shopChannel: true,
      //     shopSeg: true,
      //     shopEmail: true,
      //     remark: true,
      //     createdAt: true,
      //     updatedAt: true,
      //   },
    });

    if (!shop) {
      return NextResponse.json({ status: 'error', message: 'Shop not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        data: shop,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching shop:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch shop' }, { status: 500 });
  }
}
