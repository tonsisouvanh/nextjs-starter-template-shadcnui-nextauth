// ====================================================== //
// ================== GET ALL RPOVINCE ================== //

import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// ====================================================== //
export async function GET(req: NextRequest) {
  try {
    const provinces = await prisma.province.findMany({
      where: {
        deleted: false,
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        data: provinces,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch provinces' }, { status: 500 });
  }
}
