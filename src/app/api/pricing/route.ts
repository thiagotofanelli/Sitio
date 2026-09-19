if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_WEEKEND_TIERS = [
  { id: 'tier-wk-20', category: 'WEEKEND', peopleCount: 20, price: 3000, validityNote: null },
  { id: 'tier-wk-25', category: 'WEEKEND', peopleCount: 25, price: 3400, validityNote: null },
  { id: 'tier-wk-30', category: 'WEEKEND', peopleCount: 30, price: 3600, validityNote: null },
  { id: 'tier-wk-35', category: 'WEEKEND', peopleCount: 35, price: 3800, validityNote: null },
  { id: 'tier-wk-40', category: 'WEEKEND', peopleCount: 40, price: 4000, validityNote: null },
  { id: 'tier-wk-50', category: 'WEEKEND', peopleCount: 50, price: 4600, validityNote: null },
  { id: 'tier-wk-60', category: 'WEEKEND', peopleCount: 60, price: 5200, validityNote: null },
  { id: 'tier-wk-70', category: 'WEEKEND', peopleCount: 70, price: 5800, validityNote: null },
  { id: 'tier-wk-80', category: 'WEEKEND', peopleCount: 80, price: 6400, validityNote: null },
  { id: 'tier-wk-90', category: 'WEEKEND', peopleCount: 90, price: 7200, validityNote: null },
  { id: 'tier-wk-100', category: 'WEEKEND', peopleCount: 100, price: 7600, validityNote: null },
];

const DEFAULT_DAY_USE_TIERS = [
  { id: 'tier-day-100', category: 'DAY_USE', peopleCount: 100, price: 5600, validityNote: null },
  { id: 'tier-day-150', category: 'DAY_USE', peopleCount: 150, price: 7500, validityNote: null },
  { id: 'tier-day-200', category: 'DAY_USE', peopleCount: 200, price: 8500, validityNote: null },
];

export async function GET() {
  try {
    let tiers: any[] = [];

    try {
      tiers = await prisma.pricingTier.findMany({
        orderBy: { peopleCount: 'asc' },
      });

      // Se o banco estiver vazio na Vercel, faz o auto-seed
      if (tiers.length === 0) {
        const count = await prisma.pricingTier.count();
        if (count === 0) {
          await Promise.all([
            ...DEFAULT_WEEKEND_TIERS.map((t) =>
              prisma.pricingTier.create({
                data: {
                  id: t.id,
                  category: t.category,
                  peopleCount: t.peopleCount,
                  price: t.price,
                },
              }).catch(() => null)
            ),
            ...DEFAULT_DAY_USE_TIERS.map((t) =>
              prisma.pricingTier.create({
                data: {
                  id: t.id,
                  category: t.category,
                  peopleCount: t.peopleCount,
                  price: t.price,
                },
              }).catch(() => null)
            ),
          ]);

          tiers = await prisma.pricingTier.findMany({
            orderBy: { peopleCount: 'asc' },
          });
        }
      }
    } catch (dbErr) {
      console.error('Database query failed in /api/pricing, using fallback:', dbErr);
    }

    // Fallback garantido caso o banco esteja vazio ou falhe
    if (!tiers || tiers.length === 0) {
      return NextResponse.json({
        WEEKEND: DEFAULT_WEEKEND_TIERS,
        DAY_USE: DEFAULT_DAY_USE_TIERS,
      });
    }

    const grouped = {
      WEEKEND: tiers.filter((t) => t.category === 'WEEKEND'),
      DAY_USE: tiers.filter((t) => t.category === 'DAY_USE'),
    };

    return NextResponse.json(grouped);
  } catch (error) {
    console.error('Error in GET /api/pricing:', error);
    return NextResponse.json({
      WEEKEND: DEFAULT_WEEKEND_TIERS,
      DAY_USE: DEFAULT_DAY_USE_TIERS,
    });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
