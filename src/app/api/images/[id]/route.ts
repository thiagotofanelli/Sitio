import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

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

    const updated = await prisma.siteImage.update({
      where: { id },
      data,
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

    await prisma.siteImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting site image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
