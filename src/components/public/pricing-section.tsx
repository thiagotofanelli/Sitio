'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CalendarDays, Sun, Check, MessageCircle } from 'lucide-react';
import { formatCurrency, generateWhatsAppLink } from '@/lib/utils';

const CLEANING_FEE = 200;
const DEPOSIT_FEE = 1000;

const FALLBACK_PRICING = {
  WEEKEND: [
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
  ],
  DAY_USE: [
    { peopleCount: 100, price: 5600 },
    { peopleCount: 150, price: 7500 },
    { peopleCount: 200, price: 8500 },
  ],
};

interface PricingTier {
  peopleCount: number;
  price: number;
}

interface PricingData {
  WEEKEND: PricingTier[];
  DAY_USE: PricingTier[];
}

export function PricingSection() {
  const [tab, setTab] = useState<'WEEKEND' | 'DAY_USE'>('WEEKEND');
  const [pricing, setPricing] = useState<PricingData>(FALLBACK_PRICING);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pricing')
      .then((r) => r.json())
      .then((data) => {
        if (data?.WEEKEND) setPricing(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tiers = pricing[tab];

  const handleWhatsApp = (tier: PricingTier) => {
    const modeText = tab === 'WEEKEND' ? 'Final de Semana / Feriado' : 'Day Use (Sem Pernoite)';
    const total = tier.price + CLEANING_FEE;
    const msg = `Olá! Tenho interesse em reservar o Sítio Recanto dos Pássaros em Juquitiba.\n\nModalidade: ${modeText}\nPessoas: ${tier.peopleCount}\nDiária base: ${formatCurrency(tier.price)}\nTotal estimado: ${formatCurrency(total)} + Caução\n\nPoderia verificar disponibilidade?`;
    window.open(generateWhatsAppLink(undefined, msg), '_blank');
  };

  return (
    <section id="precos" className="py-24 bg-[#14291E]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8A882]/15 border border-[#C8A882]/30 text-[#C8A882] text-xs font-semibold tracking-[0.12em] uppercase mb-5">
            <CalendarDays className="w-3.5 h-3.5" />
            Tabela de Preços
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Investimento para <span className="text-[#C8A882]">sua estadia</span>
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            Preços por número de pessoas. Taxa de limpeza de {formatCurrency(CLEANING_FEE)} e caução reembolsável de {formatCurrency(DEPOSIT_FEE)} cobrados à parte.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-white/8 border border-white/10 gap-1">
            <button
              onClick={() => setTab('WEEKEND')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                tab === 'WEEKEND'
                  ? 'bg-[#C8A882] text-[#14291E] shadow-lg'
                  : 'text-white/55 hover:text-white'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Final de Semana / Feriado
            </button>
            <button
              onClick={() => setTab('DAY_USE')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                tab === 'DAY_USE'
                  ? 'bg-[#C8A882] text-[#14291E] shadow-lg'
                  : 'text-white/55 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4" />
              Day Use (Sem Pernoite)
            </button>
          </div>
        </div>

        {/* Pricing Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#C8A882] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">

            {/* Table Header */}
            <div className="grid grid-cols-4 px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                Pessoas
              </div>
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider text-center">
                Diária Base
              </div>
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider text-center">
                Total c/ Limpeza
              </div>
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider text-right">
                Por Pessoa
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/8">
              {tiers.map((tier, idx) => {
                const total = tier.price + CLEANING_FEE;
                const perPerson = total / tier.peopleCount;
                const isPopular = tab === 'WEEKEND' ? tier.peopleCount === 50 : tier.peopleCount === 100;

                return (
                  <motion.div
                    key={tier.peopleCount}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`grid grid-cols-4 px-6 py-4 items-center group transition-all duration-200 ${
                      isPopular
                        ? 'bg-[#C8A882]/10 border-l-2 border-[#C8A882]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
                        isPopular
                          ? 'bg-[#C8A882] text-[#14291E]'
                          : 'bg-white/8 text-white/70 group-hover:bg-white/15'
                      }`}>
                        {tier.peopleCount}
                      </div>
                      {isPopular && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C8A882]/20 text-[#C8A882] text-[10px] font-bold tracking-wider uppercase">
                          Popular
                        </span>
                      )}
                    </div>

                    <div className="text-center">
                      <span className={`font-serif font-semibold text-xl ${isPopular ? 'text-[#C8A882]' : 'text-white'}`}>
                        {formatCurrency(tier.price)}
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-white/70 font-medium">
                        {formatCurrency(total)}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <span className="text-white/40 text-sm">
                        {formatCurrency(perPerson)}/p
                      </span>
                      <button
                        onClick={() => handleWhatsApp(tier)}
                        className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                          isPopular
                            ? 'bg-[#C8A882] text-[#14291E]'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Consultar
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Table Footer */}
            <div className="px-6 py-5 border-t border-white/10 bg-white/3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-4 text-xs text-white/40">
                  {[
                    `Taxa de limpeza: ${formatCurrency(CLEANING_FEE)} (incluso nos totais)`,
                    `Caução reembolsável: ${formatCurrency(DEPOSIT_FEE)}`,
                    'Preços sujeitos a alteração conforme sazonalidade',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#C8A882] mt-0.5 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <a
                  href={generateWhatsAppLink(undefined, 'Olá! Gostaria de mais informações sobre os preços do Sítio Recanto dos Pássaros em Juquitiba.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A882] hover:bg-[#B8936A] text-[#14291E] font-semibold text-sm transition-all shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  Consultar via WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Inclusions */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Tudo Incluso', items: ['Piscina semiolímpica', 'Salão de festas', 'Campo de futebol', 'Wi-Fi fibra 100 Mega'] },
            { title: 'Infraestrutura', items: ['Churrasqueira gourmet', 'Fogão a lenha & forno de pizza', 'Salão de jogos', 'Lago para pesca'] },
            { title: 'Conforto', items: ['Estacionamento privativo', 'Casa de caseiro', 'Portão fechado', 'Playground infantil'] },
          ].map((group) => (
            <div key={group.title} className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-[#C8A882] text-xs font-bold uppercase tracking-wider mb-3">{group.title}</h4>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white/60 text-sm">
                    <Check className="w-3.5 h-3.5 text-[#C8A882] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
