'use client';

import { motion } from 'framer-motion';
import { Wifi, Waves, PartyPopper, Gamepad2, Goal, Fish, Trees, Shield, PawPrint } from 'lucide-react';

const amenities = [
  { icon: Wifi, title: 'Wi-Fi Fibra 100 Mega', desc: 'Cobertura em toda a propriedade via fibra óptica' },
  { icon: Waves, title: 'Piscina Semiolímpica', desc: '1,50m a 2,20m de profundidade com toboágua, chafariz e quiosque com churrasqueira' },
  { icon: PartyPopper, title: 'Salão para 150 Pessoas', desc: 'Churrasqueira, fogão a lenha, forno de pizza e 2 freezers' },
  { icon: Gamepad2, title: 'Salão de Jogos', desc: 'Mesa de sinuca e pebolim' },
  { icon: Goal, title: 'Campo de Futebol', desc: 'Campo iluminado com refletores para jogos noturnos' },
  { icon: Fish, title: 'Lago para Pesca', desc: 'Pesca esportiva com política de captura e devolução' },
  { icon: Trees, title: 'Trilhas & Natureza', desc: 'Trilhas ecológicas, playground infantil e amplo gramado arborizado' },
  { icon: Shield, title: 'Segurança 24h', desc: 'Portão fechado, muro frontal, estacionamento privativo e casa de caseiro' },
  { icon: PawPrint, title: 'Pet Friendly', desc: 'Animais de estimação são bem-vindos' },
];

export function AmenitiesSection() {
  return (
    <section id="comodidades" className="py-24 bg-[#14291E] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="section-tag dark mb-4">Comodidades</div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Tudo incluso <span className="text-[#C8A882]">na diária</span>
            </h2>
          </div>
          <p className="text-white/50 max-w-sm text-base leading-relaxed">
            Uma infraestrutura completa para que você não precise se preocupar com nada
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {amenities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: idx * 0.07, duration: 0.45 }}
                className="group flex items-start gap-4 p-5 rounded-2xl bg-white/6 hover:bg-white/10 border border-white/8 hover:border-white/16 transition-all duration-300 cursor-default"
              >
                <div className="flex-shrink-0 w-11 h-11 bg-[#C8A882]/15 group-hover:bg-[#C8A882]/25 rounded-xl flex items-center justify-center text-[#C8A882] transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-sm mb-1 leading-tight">{item.title}</h3>
                  <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 p-6 rounded-2xl bg-[#C8A882]/10 border border-[#C8A882]/20 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="text-white font-semibold text-base mb-0.5">Tudo isso por uma única diária</p>
            <p className="text-white/50 text-sm">A partir de R$ 3.000 para 20 pessoas • Sem taxas surpresa</p>
          </div>
          <a
            href="#precos"
            className="flex-shrink-0 px-6 py-3 rounded-xl bg-[#C8A882] hover:bg-[#B8936A] text-[#14291E] font-semibold text-sm transition-all shadow-lg"
          >
            Ver Tabela de Preços
          </a>
        </motion.div>
      </div>
    </section>
  );
}
