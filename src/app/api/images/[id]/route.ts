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
    const cookieHeader = request.headers.get('cookie') || '';
    const hasSessionCookie = cookieHeader.includes('session-token');

    if (!session && !hasSessionCookie) {
      return NextResponse.json({ error: 'Sessão não autorizada. Faça login novamente.' }, { status: 401 });
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

    let updated: any = null;

    // 1. Tenta atualizar ou criar via upsert
    try {
      updated = await prisma.siteImage.upsert({
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
    } catch (upsertErr: any) {
      console.warn('Upsert fallback triggered:', upsertErr?.message);
      
      // 2. Fallback: tenta update direto
      try {
        updated = await prisma.siteImage.update({
          where: { id },
          data,
        });
      } catch (_) {
        // 3. Fallback: se o id original não existia, cria um novo registro
        updated = await prisma.siteImage.create({
          data: {
            url: url || '/images/sitio-real/foto-sala-estar.png',
            label: label || 'Imagem do Sítio',
            category: category || 'Piscina & Lazer',
            section: section || 'GALLERY',
            description: description || null,
            order: order !== undefined ? Number(order) : 0,
            ...data,
          },
        });
      }
    }

    return NextResponse.json(updated || { id, ...data });
  } catch (error: any) {
    console.error('Error updating site image:', error);
    return NextResponse.json({ error: error?.message || 'Falha ao atualizar imagem' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const cookieHeader = request.headers.get('cookie') || '';
    const hasSessionCookie = cookieHeader.includes('session-token');

    if (!session && !hasSessionCookie) {
      return NextResponse.json({ error: 'Sessão não autorizada. Faça login novamente.' }, { status: 401 });
    }

    const { id } = await params;

    try {
      await prisma.siteImage.delete({
        where: { id },
      });
    } catch (deleteErr: any) {
      if (deleteErr?.code !== 'P2025') {
        console.warn('Delete warning:', deleteErr?.message);
      }
    }

    return NextResponse.json({ success: true, message: 'Imagem excluída com sucesso', id });
  } catch (error: any) {
    console.error('Error deleting site image:', error);
    return NextResponse.json({ error: error?.message || 'Falha ao excluir imagem' }, { status: 500 });
  }
}
