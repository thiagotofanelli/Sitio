import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const category = searchParams.get('category');

    const where: any = {};
    if (section) where.section = section;
    if (category && category !== 'Todos') where.category = category;

    const images = await prisma.siteImage.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching site images:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url, label, category, section, description, order } = body;

    if (!url || !label) {
      return NextResponse.json({ error: 'URL e Legenda são obrigatórias' }, { status: 400 });
    }

    const newImage = await prisma.siteImage.create({
      data: {
        url,
        label,
        category: category || 'Piscina & Lazer',
        section: section || 'GALLERY',
        description: description || null,
        order: order !== undefined ? Number(order) : 0,
      },
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Error creating site image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
