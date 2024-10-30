import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const districtId = parseInt(params.id);
  if (isNaN(districtId)) {
    return NextResponse.json({ status: 'error', message: 'Invalid ID' }, { status: 400 });
  }

  try {
    const district = await prisma.province.findUnique({
      where: { id: districtId },
      include: {
        districts: true,
      },
    });

    if (!district) {
      return NextResponse.json({ status: 'error', message: 'District not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        data: district,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching districts:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch districts' }, { status: 500 });
  }
}
