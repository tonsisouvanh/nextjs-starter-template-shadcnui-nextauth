import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { provinceId: string } }) {
  const provinceId = parseInt(params.provinceId);
  if (isNaN(provinceId)) {
    return NextResponse.json({ status: 'error', message: 'Invalid ID' }, { status: 400 });
  }

  try {
    const districts = await prisma.district.findMany({
      where: { provinceId: provinceId, deleted: false },
    });

    if (!districts) {
      return NextResponse.json({ status: 'error', message: 'Province id not found in district' }, { status: 404 });
    }

    return NextResponse.json(
      {
        data: districts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching districts:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch districts' }, { status: 500 });
  }
}
