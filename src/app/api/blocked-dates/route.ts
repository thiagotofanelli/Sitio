import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const blockedDates = await prisma.blockedDate.findMany({
    orderBy: { startDate: 'asc' },
  });
  
  return NextResponse.json(blockedDates);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startDate, endDate, reason } = body;

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 });
    }

    const blockedDate = await prisma.blockedDate.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
      },
    });

    return NextResponse.json(blockedDate, { status: 201 });
  } catch (error) {
    console.error('Error creating blocked date:', error);
    return NextResponse.json({ error: 'Failed to create blocked date' }, { status: 500 });
  }
}
