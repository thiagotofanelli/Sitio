import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const inquiries = await prisma.bookingInquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });
  
  return NextResponse.json(inquiries);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestName, guestEmail, guestPhone, eventType, startDate, endDate, guestCount, estimatedTotal } = body;

    if (!guestName || !guestEmail || !guestPhone || !eventType || !startDate || !endDate || !guestCount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const inquiry = await prisma.bookingInquiry.create({
      data: {
        guestName,
        guestEmail,
        guestPhone,
        eventType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        guestCount: Number(guestCount),
        estimatedTotal: estimatedTotal ? Number(estimatedTotal) : 0,
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating booking inquiry:', error);
    return NextResponse.json({ error: 'Failed to create booking inquiry' }, { status: 500 });
  }
}
