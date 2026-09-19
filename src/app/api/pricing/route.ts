import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tiers = await prisma.pricingTier.findMany({
    orderBy: { peopleCount: 'asc' }
  });
  
  const grouped = {
    WEEKEND: tiers.filter(t => t.category === 'WEEKEND'),
    DAY_USE: tiers.filter(t => t.category === 'DAY_USE'),
  };
  
  return NextResponse.json(grouped);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, peopleCount, price, validityNote } = body;

    if (!category || !peopleCount || !price) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const created = await prisma.pricingTier.create({
      data: {
        category,
        peopleCount: Number(peopleCount),
        price: Number(price),
        validityNote: validityNote || null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating pricing tier:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
