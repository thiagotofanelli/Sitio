import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_SITE_IMAGES = [
  // Hero / Banner
  {
    id: 'hero-1',
    section: 'HERO',
    category: 'Natureza & Lago',
    url: '/images/sitio-real/foto-varandao-natureza.jpg',
    label: 'Varandão Panorâmico & Natureza (Foto Real)',
    description: 'Varandão colonial com vista aberta para a exuberante mata de Juquitiba.',
    order: 1,
  },
  {
    id: 'hero-2',
    section: 'HERO',
    category: 'Casa Sede & Suítes',
    url: '/images/sitio-real/foto-sala-estar.png',
    label: 'Casa Sede — Sala de Estar 3 Ambientes (Foto Real)',
    description: 'Sala de estar ampla com sofás confortáveis, Smart TV e acabamento colonial.',
    order: 2,
  },
  {
    id: 'hero-3',
    section: 'HERO',
    category: 'Salão de Festas',
    url: '/images/sitio-real/foto-churrasqueira-gourmet.png',
    label: 'Espaço Gourmet & Churrasqueira (Foto Real)',
    description: 'Churrasqueira em tijolinho aparente com bancada e fogão industrial.',
    order: 3,
  },
  {
    id: 'hero-4',
    section: 'HERO',
    category: 'Salão de Festas',
    url: '/images/sitio-real/foto-varanda-mesas.png',
    label: 'Área Social Coberta & Refeições (Foto Real)',
    description: 'Espaço coberto com mesas para grandes refeições e confraternizações.',
    order: 4,
  },
  {
    id: 'hero-5',
    section: 'HERO',
    category: 'Casa Sede & Suítes',
    url: '/images/sitio-real/foto-fachada-torre.png',
    label: 'Sede Colonial & Bosque de Pinheiros (Foto Real)',
    description: 'Fachada imponente da sede com pinheiros e arquitetura rústica.',
    order: 5,
  },
  {
    id: 'hero-6',
    section: 'HERO',
    category: 'Piscina & Lazer',
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1920&q=85',
    label: 'Piscina Semiolímpica com Toboágua',
    description: 'Piscina semiolímpica com 1,50m a 2,20m de profundidade e toboágua.',
    order: 6,
  },
  {
    id: 'hero-7',
    section: 'HERO',
    category: 'Natureza & Lago',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
    label: 'Lago & Pesca Esportiva',
    description: 'Lago para pesca esportiva rodeado pela mata atlântica nativa.',
    order: 7,
  },

  // Galeria - Casa Sede & Suítes
  {
    id: 'gal-1',
    section: 'GALLERY',
    category: 'Casa Sede & Suítes',
    url: '/images/sitio-real/foto-sala-estar.png',
    label: 'Sala de Estar Principal (Foto Real)',
    description: 'Sala de estar ampla com sofás confortáveis, Smart TV e vista panorâmica.',
    order: 1,
  },
  {
    id: 'gal-2',
    section: 'GALLERY',
    category: 'Casa Sede & Suítes',
    url: '/images/sitio-real/foto-fachada-torre.png',
    label: 'Fachada e Jardim da Sede (Foto Real)',
    description: 'Vista frontal da casa sede colonial com pinheiros centenários.',
    order: 2,
  },
  {
    id: 'gal-3',
    section: 'GALLERY',
    category: 'Casa Sede & Suítes',
    url: '/images/sitio-real/foto-varandao-natureza.jpg',
    label: 'Varandão Panorâmico (Foto Real)',
    description: 'Varandão com deque de pedra e vista livre para a natureza.',
    order: 3,
  },
  {
    id: 'gal-4',
    section: 'GALLERY',
    category: 'Casa Sede & Suítes',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    label: 'Suíte Principal da Sede',
    description: 'Uma das 4 suítes da sede com banheiro privativo e acabamento acolhedor.',
    order: 4,
  },

  // Galeria - Salão de Festas
  {
    id: 'gal-5',
    section: 'GALLERY',
    category: 'Salão de Festas',
    url: '/images/sitio-real/foto-churrasqueira-gourmet.png',
    label: 'Churrasqueira em Alvenaria (Foto Real)',
    description: 'Espaço gourmet rústico com churrasqueira grande e bancada de granito.',
    order: 5,
  },
  {
    id: 'gal-6',
    section: 'GALLERY',
    category: 'Salão de Festas',
    url: '/images/sitio-real/foto-varanda-mesas.png',
    label: 'Área de Apoio & Mesas (Foto Real)',
    description: 'Área coberta com 12 mesas e 48 cadeiras para refeições e eventos.',
    order: 6,
  },
  {
    id: 'gal-7',
    section: 'GALLERY',
    category: 'Salão de Festas',
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    label: 'Salão para 150 Pessoas',
    description: 'Estrutura completa e coberta para casamentos, retiros e workshops.',
    order: 7,
  },
  {
    id: 'gal-8',
    section: 'GALLERY',
    category: 'Salão de Festas',
    url: 'https://images.unsplash.com/photo-1611250188496-e966043a0629?auto=format&fit=crop&w=1200&q=80',
    label: 'Salão de Jogos com Sinuca',
    description: 'Mesa de sinuca oficial e pebolim para diversão dos hóspedes.',
    order: 8,
  },

  // Galeria - Piscina & Lazer
  {
    id: 'gal-9',
    section: 'GALLERY',
    category: 'Piscina & Lazer',
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
    label: 'Piscina Semiolímpica',
    description: 'Profundidade de 1,50m a 2,20m com solarium amplo.',
    order: 9,
  },
  {
    id: 'gal-10',
    section: 'GALLERY',
    category: 'Piscina & Lazer',
    url: 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=1200&q=80',
    label: 'Toboágua e Chafariz',
    description: 'Diversão aquática para crianças e adultos.',
    order: 10,
  },

  // Galeria - Alojamentos
  {
    id: 'gal-11',
    section: 'GALLERY',
    category: 'Alojamentos',
    url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    label: 'Alojamentos Externos',
    description: '5 alojamentos coletivos arejados com beliches e banheiros próximos.',
    order: 11,
  },

  // Galeria - Natureza & Lago
  {
    id: 'gal-12',
    section: 'GALLERY',
    category: 'Natureza & Lago',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    label: 'Lago de Pesca Esportiva',
    description: 'Lago para pesca esportiva com píer de madeira.',
    order: 12,
  },
  {
    id: 'gal-13',
    section: 'GALLERY',
    category: 'Natureza & Lago',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    label: 'Bosque de Pinheiros',
    description: 'Mata nativa e trilhas preservadas para caminhadas ecológicas.',
    order: 13,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const category = searchParams.get('category');

    let images: any[] = [];

    try {
      const where: any = {};
      if (section) where.section = section;
      if (category && category !== 'Todos') where.category = category;

      images = await prisma.siteImage.findMany({
        where,
        orderBy: { order: 'asc' },
      });

      // Se o banco de dados estiver vazio, faz o auto-seed das imagens padrão
      if (images.length === 0) {
        const totalInDb = await prisma.siteImage.count();
        if (totalInDb === 0) {
          await Promise.all(
            DEFAULT_SITE_IMAGES.map((img) =>
              prisma.siteImage.create({
                data: {
                  url: img.url,
                  label: img.label,
                  category: img.category,
                  section: img.section,
                  description: img.description,
                  order: img.order,
                },
              }).catch(() => null)
            )
          );

          images = await prisma.siteImage.findMany({
            where,
            orderBy: { order: 'asc' },
          });
        }
      }
    } catch (dbErr) {
      console.error('Database query failed in /api/images, using fallback:', dbErr);
    }

    // Fallback garantido caso o banco ainda esteja vazio ou falhe no serverless
    if (!images || images.length === 0) {
      images = DEFAULT_SITE_IMAGES.filter((img) => {
        if (section && img.section !== section) return false;
        if (category && category !== 'Todos' && img.category !== category) return false;
        return true;
      });
    }

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching site images:', error);
    return NextResponse.json(DEFAULT_SITE_IMAGES);
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
