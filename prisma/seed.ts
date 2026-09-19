import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Create Property
  const propertyCount = await prisma.property.count()
  if (propertyCount === 0) {
    await prisma.property.create({
      data: {
        title: 'Sítio Recanto dos Pássaros',
        description: 'Um refúgio de luxo no campo, perfeito para fins de semana, day use, retiros e eventos inesquecíveis.',
      },
    })
    console.log('Property created')
  }

  // 2. Pricing Tiers
  await prisma.pricingTier.deleteMany()
  console.log('Existing pricing tiers deleted')

  const weekendTiers = [
    { peopleCount: 20, price: 3000 },
    { peopleCount: 25, price: 3400 },
    { peopleCount: 30, price: 3600 },
    { peopleCount: 35, price: 3800 },
    { peopleCount: 40, price: 4000 },
    { peopleCount: 50, price: 4600 },
    { peopleCount: 60, price: 5200 },
    { peopleCount: 70, price: 5800 },
    { peopleCount: 80, price: 6400 },
    { peopleCount: 90, price: 7200 },
    { peopleCount: 100, price: 7600 },
  ]

  const dayUseTiers = [
    { peopleCount: 100, price: 5600 },
    { peopleCount: 150, price: 7500 },
    { peopleCount: 200, price: 8500 },
  ]

  for (const tier of weekendTiers) {
    await prisma.pricingTier.create({
      data: {
        category: 'WEEKEND',
        peopleCount: tier.peopleCount,
        price: tier.price,
      },
    })
  }

  for (const tier of dayUseTiers) {
    await prisma.pricingTier.create({
      data: {
        category: 'DAY_USE',
        peopleCount: tier.peopleCount,
        price: tier.price,
      },
    })
  }
  console.log('Pricing tiers created')

  // 3. Admin User
  const passwordHash = await bcrypt.hash('suliper22', 10)
  await prisma.adminUser.upsert({
    where: { email: 'eduardo@sitio.com' },
    update: { passwordHash },
    create: {
      email: 'eduardo@sitio.com',
      passwordHash,
      role: 'ADMIN',
    },
  })
  console.log('Admin user created/updated')

  // 4. Initial Site Images
  const initialImagesCount = await prisma.siteImage.count()
  if (initialImagesCount === 0) {
    const imagesToSeed = [
      // Hero Images
      {
        section: 'HERO',
        category: 'Natureza & Lago',
        url: '/images/sitio-real/foto-varandao-natureza.jpg',
        label: 'Varandão Panorâmico & Natureza',
        description: 'Varandão colonial com vista aberta para a exuberante mata de Juquitiba.',
        order: 1,
      },
      {
        section: 'HERO',
        category: 'Casa Sede & Suítes',
        url: '/images/sitio-real/foto-sala-estar.png',
        label: 'Casa Sede — Sala de Estar 3 Ambientes',
        description: 'Sala de estar ampla com sofás confortáveis, TV e acabamento colonial.',
        order: 2,
      },
      {
        section: 'HERO',
        category: 'Salão de Festas',
        url: '/images/sitio-real/foto-churrasqueira-gourmet.png',
        label: 'Espaço Gourmet & Churrasqueira',
        description: 'Churrasqueira em tijolinho aparente com bancada e fogão industrial.',
        order: 3,
      },
      {
        section: 'HERO',
        category: 'Salão de Festas',
        url: '/images/sitio-real/foto-varanda-mesas.png',
        label: 'Área Social Coberta & Refeições',
        description: 'Espaço coberto com mesas para grandes refeições e confraternizações.',
        order: 4,
      },
      {
        section: 'HERO',
        category: 'Casa Sede & Suítes',
        url: '/images/sitio-real/foto-fachada-torre.png',
        label: 'Sede Colonial & Bosque de Pinheiros',
        description: 'Fachada imponente da sede com pinheiros e arquitetura rústica.',
        order: 5,
      },
      {
        section: 'HERO',
        category: 'Piscina & Lazer',
        url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1920&q=85',
        label: 'Piscina Semiolímpica com Toboágua',
        description: 'Piscina semiolímpica com 1,50m a 2,20m de profundidade e toboágua.',
        order: 6,
      },
      {
        section: 'HERO',
        category: 'Natureza & Lago',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
        label: 'Lago & Pesca Esportiva',
        description: 'Lago para pesca esportiva rodeado pela mata atlântica nativa.',
        order: 7,
      },

      // Gallery Images - Casa Sede & Suítes
      {
        section: 'GALLERY',
        category: 'Casa Sede & Suítes',
        url: '/images/sitio-real/foto-sala-estar.png',
        label: 'Sala de Estar Principal (Foto Real)',
        description: 'Sala de estar ampla com sofás confortáveis, Smart TV e vista panorâmica.',
        order: 1,
      },
      {
        section: 'GALLERY',
        category: 'Casa Sede & Suítes',
        url: '/images/sitio-real/foto-fachada-torre.png',
        label: 'Fachada e Jardim da Sede (Foto Real)',
        description: 'Vista frontal da casa sede colonial com pinheiros centenários.',
        order: 2,
      },
      {
        section: 'GALLERY',
        category: 'Casa Sede & Suítes',
        url: '/images/sitio-real/foto-varandao-natureza.jpg',
        label: 'Varandão Panorâmico (Foto Real)',
        description: 'Varandão com deque de pedra e vista livre para a natureza.',
        order: 3,
      },
      {
        section: 'GALLERY',
        category: 'Casa Sede & Suítes',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        label: 'Sala com Lareira Aconchegante',
        description: 'Ambiente com lareira para noites agradáveis no campo.',
        order: 4,
      },
      {
        section: 'GALLERY',
        category: 'Casa Sede & Suítes',
        url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        label: 'Suíte Principal da Sede',
        description: 'Uma das 4 suítes da sede com banheiro privativo e acabamento acolhedor.',
        order: 5,
      },
      {
        section: 'GALLERY',
        category: 'Casa Sede & Suítes',
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        label: 'Cozinha Completa',
        description: 'Equipada com fogão a gás, freezer, geladeira duplex e bancada.',
        order: 6,
      },

      // Gallery Images - Salão de Festas
      {
        section: 'GALLERY',
        category: 'Salão de Festas',
        url: '/images/sitio-real/foto-churrasqueira-gourmet.png',
        label: 'Churrasqueira em Alvenaria (Foto Real)',
        description: 'Espaço gourmet rústico com churrasqueira grande e bancada de granito.',
        order: 7,
      },
      {
        section: 'GALLERY',
        category: 'Salão de Festas',
        url: '/images/sitio-real/foto-varanda-mesas.png',
        label: 'Área de Apoio & Mesas (Foto Real)',
        description: 'Área coberta com 12 mesas e 48 cadeiras para refeições e eventos.',
        order: 8,
      },
      {
        section: 'GALLERY',
        category: 'Salão de Festas',
        url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
        label: 'Salão para 150 Pessoas',
        description: 'Estrutura completa e coberta para casamentos, retiros e workshops.',
        order: 9,
      },
      {
        section: 'GALLERY',
        category: 'Salão de Festas',
        url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
        label: 'Forno de Pizza a Lenha',
        description: 'Forno artesanal para pizzas e assados.',
        order: 10,
      },
      {
        section: 'GALLERY',
        category: 'Salão de Festas',
        url: 'https://images.unsplash.com/photo-1611250188496-e966043a0629?auto=format&fit=crop&w=1200&q=80',
        label: 'Salão de Jogos',
        description: 'Mesa de sinuca oficial e pebolim para diversão dos hóspedes.',
        order: 11,
      },

      // Gallery Images - Piscina & Lazer
      {
        section: 'GALLERY',
        category: 'Piscina & Lazer',
        url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
        label: 'Piscina Semiolímpica',
        description: 'Profundidade de 1,50m a 2,20m com solarium amplo.',
        order: 12,
      },
      {
        section: 'GALLERY',
        category: 'Piscina & Lazer',
        url: 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=1200&q=80',
        label: 'Toboágua e Chafariz',
        description: 'Diversão aquática para crianças e adultos.',
        order: 13,
      },
      {
        section: 'GALLERY',
        category: 'Piscina & Lazer',
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        label: 'Quiosque da Piscina',
        description: 'Quiosque coberto com churrasqueira ao lado do deck.',
        order: 14,
      },

      // Gallery Images - Alojamentos
      {
        section: 'GALLERY',
        category: 'Alojamentos',
        url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
        label: '5 Alojamentos Externos',
        description: 'Equipados com 50 vagas em beliches confortáveis de madeira maciça.',
        order: 15,
      },
      {
        section: 'GALLERY',
        category: 'Alojamentos',
        url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
        label: 'Dormitórios Coletivos',
        description: 'Espaço higienizado e ventilado, ideal para grandes grupos e retiros.',
        order: 16,
      },

      // Gallery Images - Natureza & Lago
      {
        section: 'GALLERY',
        category: 'Natureza & Lago',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        label: 'Lago para Pesca Esportiva',
        description: 'Lago privativo para pesca esportiva com política de captura e devolução.',
        order: 17,
      },
      {
        section: 'GALLERY',
        category: 'Natureza & Lago',
        url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
        label: 'Campo de Futebol Iluminado',
        description: 'Campo society com refletores para jogos noturnos.',
        order: 18,
      },
      {
        section: 'GALLERY',
        category: 'Natureza & Lago',
        url: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=1200&q=80',
        label: 'Playground Infantil',
        description: 'Espaço de recreação infantil ao ar livre.',
        order: 19,
      },
    ]

    for (const img of imagesToSeed) {
      await prisma.siteImage.create({ data: img })
    }
    console.log('Initial site images seeded!')
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
