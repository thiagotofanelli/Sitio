if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { price } = body;

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json({ error: 'Preço inválido' }, { status: 400 });
    }

    // Upsert para garantir atualização mesmo que o tier tenha vindo do fallback com id padrão
    const updated = await prisma.pricingTier.upsert({
      where: { id },
      update: { price },
      create: {
        id,
        category: id.includes('day') ? 'DAY_USE' : 'WEEKEND',
        peopleCount: 20,
        price,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating pricing tier:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
      await prisma.pricingTier.delete({
        where: { id },
      });
    } catch (err: any) {
      if (err?.code !== 'P2025') {
        console.warn('Delete pricing tier warning:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'Tier deleted successfully' });
  } catch (error) {
    console.error('Error deleting pricing tier:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
