import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
// ====================================================== //
// ================== GET ALL RPOVINCE ================== //
// ====================================================== //
export async function GET(req: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      where: {
        activeAt: true,
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        data: events,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch events' }, { status: 500 });
  }
}
