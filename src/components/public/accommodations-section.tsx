'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BedDouble, Bath, ShowerHead, Users, Home, Building2, Utensils, Check } from 'lucide-react';

const stats = [
  { icon: BedDouble, num: '9', label: 'Quartos' },
  { icon: Bath, num: '4', label: 'Suítes na Sede' },
  { icon: ShowerHead, num: '10', label: 'Banheiros' },
  { icon: Users, num: '100', label: 'Hóspedes (Pernoite)' },
];

const cards = [
  {
    icon: Home,
    title: 'Casa Sede Colonial',
    badge: '4 Suítes Privativas',
    image: '/images/sitio-real/foto-sala-estar.png',
    desc: 'Sede com arquitetura colonial tradicional e ambientes integrados com máximo conforto.',
    features: [
      '4 suítes com banheiro privativo',
      'Sala 3 ambientes: Estar com TV, Jantar e Lareira',
      'Cozinha com fogão a gás, freezer e geladeira',
      'Varanda ampla com redes de descanso',
    ],
  },
  {
    icon: Building2,
    title: 'Alojamentos Externos',
    badge: '5 Alojamentos · 50 Vagas',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    desc: 'Estrutura externa independente voltada para grandes grupos, retiros e excursões.',
    features: [
      '5 alojamentos coletivos arejados',
      'Beliches confortáveis em madeira maciça',
      'Colchões extras para completar 100 hóspedes',
      'Bateria de banheiros com duchas quentes',
    ],
  },
  {
    icon: Utensils,
    title: 'Infraestrutura de Apoio',
    badge: 'Mobiliário Completo',
    image: '/images/sitio-real/foto-churrasqueira-gourmet.png',
    desc: 'Mobiliário e equipamentos inclusos para organizar confraternizações e refeições.',
    features: [
      '12 mesas e 48 cadeiras de apoio',
      'Salão para até 150 pessoas no evento',
      '2 freezers horizontais adicionais',
      'Churrasqueira, fogão a lenha e forno de pizza',
    ],
  },
];

export function AccommodationsSection() {
  const [dynamicImages, setDynamicImages] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch('/api/images?section=ACCOMMODATION')
      .then((r) => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const map: Record<number, string> = {};
          data.forEach((img) => {
            if (img.order === 1 || img.label?.includes('Sede')) {
              map[0] = img.url;
            } else if (img.order === 2 || img.label?.includes('Alojamento')) {
              map[1] = img.url;
            } else if (img.order === 3 || img.label?.includes('Infraestrutura') || img.label?.includes('Apoio')) {
              map[2] = img.url;
            }
          });
          setDynamicImages(map);
        }
      })
      .catch(() => {});
  }, []);
  return (
    <section id="estrutura" className="py-24 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="section-tag mb-4">Acomodações</div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#14291E] leading-tight">
              Estrutura & <span className="text-[#C8A882]">Acomodações</span>
            </h2>
          </div>
          <p className="text-[#6B6555] max-w-sm text-base leading-relaxed">
            Amplo espaço para acolher retiros, workshops, casamentos e confraternizações familiares
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl border border-[#DDD5C4] p-6 flex flex-col items-center text-center card-hover"
              >
                <div className="w-11 h-11 bg-[#14291E]/8 rounded-xl flex items-center justify-center mb-4 text-[#14291E]">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-serif text-4xl font-semibold text-[#14291E] leading-none mb-1">{stat.num}</div>
                <div className="text-[#6B6555] text-sm font-medium">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: idx * 0.12, duration: 0.55 }}
                className="bg-white rounded-3xl overflow-hidden border border-[#DDD5C4] card-hover group flex flex-col"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-[#DDD5C4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dynamicImages[idx] || card.image}
                    alt={card.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14291E]/60 via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 px-3 py-1 bg-white/95 text-[#14291E] text-xs font-bold rounded-full">
                    {card.badge}
                  </span>
                  <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif font-semibold text-lg">{card.title}</h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[#6B6555] text-sm leading-relaxed mb-5">{card.desc}</p>
                  <div className="mt-auto space-y-2.5 pt-5 border-t border-[#EDE8DC]">
                    {card.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-sm text-[#1A1A14]">
                        <div className="w-4 h-4 rounded-full bg-[#14291E]/10 text-[#14291E] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
