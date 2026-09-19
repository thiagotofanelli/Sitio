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
    const { url, label, category, section, description, order } = body;

    const data: any = {};
    if (url !== undefined) data.url = url;
    if (label !== undefined) data.label = label;
    if (category !== undefined) data.category = category;
    if (section !== undefined) data.section = section;
    if (description !== undefined) data.description = description;
    if (order !== undefined) data.order = Number(order);

    // Usa upsert para criar a imagem caso ela tenha vindo do catálogo padrão sem id existente no banco
    const updated = await prisma.siteImage.upsert({
      where: { id },
      update: data,
      create: {
        id,
        url: url || '/images/sitio-real/foto-sala-estar.png',
        label: label || 'Imagem do Sítio',
        category: category || 'Piscina & Lazer',
        section: section || 'GALLERY',
        description: description || null,
        order: order !== undefined ? Number(order) : 0,
        ...data,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating site image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
      await prisma.siteImage.delete({
        where: { id },
      });
    } catch (deleteErr: any) {
      // Se o registro não foi encontrado (código P2025 do Prisma), significa que já não existe
      if (deleteErr?.code !== 'P2025') {
        console.warn('Delete warning:', deleteErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting site image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
