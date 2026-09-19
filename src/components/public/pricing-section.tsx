'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CalendarDays, Sun, Check, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
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
    <section id="precos" className="py-20 md:py-24 bg-[#14291E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8A882]/15 border border-[#C8A882]/30 text-[#C8A882] text-xs font-semibold tracking-[0.12em] uppercase mb-4">
            <CalendarDays className="w-3.5 h-3.5" />
            Tabela de Preços
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 leading-tight">
            Investimento para <span className="text-[#C8A882]">sua estadia</span>
          </h2>
          <p className="text-white/55 text-sm sm:text-base max-w-xl mx-auto px-2">
            Valores de acordo com o número de hóspedes. Taxa de limpeza de {formatCurrency(CLEANING_FEE)} e caução reembolsável de {formatCurrency(DEPOSIT_FEE)}.
          </p>
        </div>

        {/* Tab Toggle (Responsivo para Celular) */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto p-1.5 rounded-2xl bg-white/8 border border-white/10 gap-1.5">
            <button
              onClick={() => setTab('WEEKEND')}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                tab === 'WEEKEND'
                  ? 'bg-[#C8A882] text-[#14291E] shadow-lg font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <CalendarDays className="w-4 h-4 flex-shrink-0" />
              <span>Final de Semana / Feriado</span>
            </button>
            <button
              onClick={() => setTab('DAY_USE')}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                tab === 'DAY_USE'
                  ? 'bg-[#C8A882] text-[#14291E] shadow-lg font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sun className="w-4 h-4 flex-shrink-0" />
              <span>Day Use (Sem Pernoite)</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#C8A882] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ========================================================
                VERSÃO MOBILE: Cards elegantes e otimizados para celular
               ======================================================== */}
            <div className="grid grid-cols-1 gap-3.5 md:hidden">
              {tiers.map((tier, idx) => {
                const total = tier.price + CLEANING_FEE;
                const perPerson = total / tier.peopleCount;
                const isPopular = tab === 'WEEKEND' ? tier.peopleCount === 50 : tier.peopleCount === 100;

                return (
                  <motion.div
                    key={tier.peopleCount}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => handleWhatsApp(tier)}
                    className={`relative p-5 rounded-2xl border transition-all active:scale-[0.99] cursor-pointer ${
                      isPopular
                        ? 'bg-gradient-to-br from-[#C8A882]/20 via-white/8 to-white/5 border-[#C8A882] shadow-xl'
                        : 'bg-white/6 hover:bg-white/10 border-white/10'
                    }`}
                  >
                    {/* Badge Popular no topo do card */}
                    {isPopular && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A882] text-[#14291E] text-[11px] font-extrabold tracking-wide uppercase mb-3 shadow-md">
                        <Sparkles className="w-3 h-3" />
                        Mais Procurado
                      </div>
                    )}

                    {/* Topo do card: Pessoas e Diária Base */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${
                          isPopular ? 'bg-[#C8A882] text-[#14291E]' : 'bg-white/12 text-white'
                        }`}>
                          {tier.peopleCount}
                        </div>
                        <div>
                          <p className="text-white font-bold text-base leading-tight">
                            Até {tier.peopleCount} pessoas
                          </p>
                          <p className="text-[#C8A882] text-xs font-semibold">
                            {formatCurrency(perPerson)} <span className="text-white/40 font-normal">por pessoa</span>
                          </p>
                        </div>
                      </div>

                      {/* Preço Principal */}
                      <div className="text-right">
                        <p className="text-[11px] text-white/40 uppercase tracking-wider">Diária Base</p>
                        <p className={`font-serif text-2xl font-bold leading-none ${isPopular ? 'text-[#C8A882]' : 'text-white'}`}>
                          {formatCurrency(tier.price)}
                        </p>
                      </div>
                    </div>

                    {/* Linha divisória suave */}
                    <div className="h-px bg-white/10 my-3" />

                    {/* Rodapé do card: Total c/ limpeza e botão de ação */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs text-white/60">
                        Total c/ limpeza: <strong className="text-white font-semibold">{formatCurrency(total)}</strong>
                      </div>

                      <div className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        isPopular
                          ? 'bg-[#C8A882] text-[#14291E]'
                          : 'bg-white/12 text-white hover:bg-white/20'
                      }`}>
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Consultar</span>
                        <ArrowRight className="w-3 h-3 ml-0.5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ========================================================
                VERSÃO DESKTOP/TABLET: Tabela ampla e organizada
               ======================================================== */}
            <div className="hidden md:block bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

              {/* Table Header */}
              <div className="grid grid-cols-4 px-8 py-5 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider">
                  <Users className="w-4 h-4 text-[#C8A882]" />
                  Capacidade
                </div>
                <div className="text-xs font-bold text-white/50 uppercase tracking-wider text-center">
                  Diária Base
                </div>
                <div className="text-xs font-bold text-white/50 uppercase tracking-wider text-center">
                  Total c/ Limpeza
                </div>
                <div className="text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                  Custo Médio / Pessoa
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
                      transition={{ delay: idx * 0.03 }}
                      className={`grid grid-cols-4 px-8 py-4.5 items-center group transition-all duration-200 ${
                        isPopular
                          ? 'bg-[#C8A882]/10 border-l-4 border-[#C8A882]'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
                          isPopular
                            ? 'bg-[#C8A882] text-[#14291E]'
                            : 'bg-white/8 text-white/80 group-hover:bg-white/15'
                        }`}>
                          {tier.peopleCount}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">
                            Até {tier.peopleCount} pessoas
                          </p>
                          {isPopular && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C8A882] uppercase tracking-wider">
                              ★ Mais procurado
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-center">
                        <span className={`font-serif font-bold text-2xl tracking-tight ${isPopular ? 'text-[#C8A882]' : 'text-white'}`}>
                          {formatCurrency(tier.price)}
                        </span>
                      </div>

                      <div className="text-center">
                        <span className="text-white/80 font-medium text-sm">
                          {formatCurrency(total)}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-4">
                        <span className="text-white/50 text-sm font-medium">
                          {formatCurrency(perPerson)}<span className="text-xs text-white/30">/p</span>
                        </span>
                        <button
                          onClick={() => handleWhatsApp(tier)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                            isPopular
                              ? 'bg-[#C8A882] text-[#14291E] shadow-md hover:bg-[#B8936A]'
                              : 'bg-white/10 text-white hover:bg-[#C8A882] hover:text-[#14291E]'
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
              <div className="px-8 py-5 border-t border-white/10 bg-white/3">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/45">
                    {[
                      `Taxa de limpeza: ${formatCurrency(CLEANING_FEE)} (incluso nos totais)`,
                      `Caução reembolsável: ${formatCurrency(DEPOSIT_FEE)}`,
                      'Valores sujeitos a alteração em feriados especiais',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#C8A882] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={generateWhatsAppLink(undefined, 'Olá! Gostaria de mais informações sobre os preços do Sítio Recanto dos Pássaros em Juquitiba.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C8A882] hover:bg-[#B8936A] text-[#14291E] font-bold text-sm transition-all shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Consultar via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Informações Inclusas (Responsivo) */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {[
            { title: 'Lazer Completo', items: ['Piscina semiolímpica com toboágua', 'Salão de festas para 150 pessoas', 'Campo de futebol com refletores', 'Wi-Fi fibra 100 Mega em toda a área'] },
            { title: 'Gastronomia & Eventos', items: ['Churrasqueira em alvenaria gourmet', 'Fogão a lenha & forno de pizza', 'Salão de jogos com sinuca e pebolim', 'Lago liberado para pesca esportiva'] },
            { title: 'Estrutura & Segurança', items: ['Estacionamento privativo e seguro', 'Portão fechado e caseiro no local', '12 mesas e 48 cadeiras inclusas', 'Playground infantil e ampla área verde'] },
          ].map((group) => (
            <div key={group.title} className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-[#C8A882] text-xs font-bold uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#C8A882]" />
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-white/60 text-xs sm:text-sm leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8A882]/50 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
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
