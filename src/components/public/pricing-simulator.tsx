'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarDays, Sun, MessageCircle, CalendarCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency, generateWhatsAppLink } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';

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
    { peopleCount: 100, price: 7600 }
  ],
  DAY_USE: [
    { peopleCount: 100, price: 5600 },
    { peopleCount: 150, price: 7500 },
    { peopleCount: 200, price: 8500 }
  ]
};

const CLEANING_FEE = 200;
const DEPOSIT_FEE = 1000;

export function PricingSimulator() {
  const [mode, setMode] = useState<'WEEKEND' | 'DAY_USE'>('WEEKEND');
  const [pricingData, setPricingData] = useState(FALLBACK_PRICING);
  const [selectedPeople, setSelectedPeople] = useState<number>(20);

  useEffect(() => {
    async function fetchPricing() {
      try {
        const res = await fetch('/api/pricing');
        if (res.ok) {
          const data = await res.json();
          setPricingData(data);
        }
      } catch (error) {
        console.error('Failed to fetch pricing, using fallback', error);
      }
    }
    fetchPricing();
  }, []);

  // Update selected people if it's no longer valid in the new mode
  useEffect(() => {
    const options = pricingData[mode].map((p: any) => p.peopleCount);
    if (!options.includes(selectedPeople)) {
      setSelectedPeople(options[0]);
    }
  }, [mode, pricingData, selectedPeople]);

  const currentTier = pricingData[mode].find((p: any) => p.peopleCount === selectedPeople) || pricingData[mode][0];
  const basePrice = currentTier.price;
  const estimatedTotal = basePrice + CLEANING_FEE;
  const pricePerPerson = estimatedTotal / selectedPeople;

    const handleReserveClick = () => {
    const modeText = mode === 'WEEKEND' ? 'Final de Semana / Feriado' : 'Day Use (Sem Pernoite)';
    const message = `Olá! Gostaria de reservar o Sítio Recanto dos Pássaros em Juquitiba para ${modeText} (${selectedPeople} pessoas). Valor estimado: ${formatCurrency(estimatedTotal)} + Taxa de Limpeza ${formatCurrency(CLEANING_FEE)}. Poderia verificar disponibilidade?`;
    window.open(generateWhatsAppLink(undefined, message), '_blank');
  };

  return (
    <Section id="precos" title="Simule Seu Orçamento" subtitle="Calcule o valor da sua estadia em tempo real">
      <Card className="max-w-5xl mx-auto p-6 md:p-8">
        {/* Mode Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setMode('WEEKEND')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-colors duration-200",
              mode === 'WEEKEND' ? "bg-[#1B4332] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <CalendarDays className="w-5 h-5" />
            Final de Semana / Feriado
          </button>
          <button
            onClick={() => setMode('DAY_USE')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-colors duration-200",
              mode === 'DAY_USE' ? "bg-[#1B4332] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <Sun className="w-5 h-5" />
            Day Use (Sem Pernoite)
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* People Selector */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4 text-[#1F2937]">Número de Pessoas</h3>
            <div className="flex flex-wrap gap-3">
              {pricingData[mode].map((tier: any) => (
                <button
                  key={tier.peopleCount}
                  onClick={() => setSelectedPeople(tier.peopleCount)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                    selectedPeople === tier.peopleCount
                      ? "bg-[#2D6A4F] text-white shadow-md transform scale-105"
                      : "bg-white border border-[#E9ECEF] text-[#1F2937] hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                  )}
                >
                  {tier.peopleCount}
                </button>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="flex-1">
            <Card className="p-6 bg-gray-50 border-[#E9ECEF]">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Diária base</span>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={basePrice}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-2xl font-bold text-[#1B4332]"
                    >
                      {formatCurrency(basePrice)}
                    </motion.span>
                  </AnimatePresence>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxa de Limpeza</span>
                  <span className="text-[#1F2937] font-medium">{formatCurrency(CLEANING_FEE)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Caução de Garantia</span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">(reembolsável)</span>
                  </div>
                  <span className="text-[#1F2937] font-medium">{formatCurrency(DEPOSIT_FEE)}</span>
                </div>
                
                <div className="h-px bg-gray-200 my-4"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-[#1F2937]">Total estimado</span>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={estimatedTotal}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-3xl font-bold text-[#1B4332]"
                    >
                      {formatCurrency(estimatedTotal)}
                    </motion.span>
                  </AnimatePresence>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Valor por pessoa</span>
                  <span className="font-semibold text-[#C58F4E]">{formatCurrency(pricePerPerson)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button 
                  asChild
                  variant="secondary" 
                  size="lg" 
                  className="w-full text-lg h-14 bg-[#D4A373] hover:bg-[#C58F4E] text-white shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <a 
                    href={generateWhatsAppLink(
                      undefined,
                      `Olá! Gostaria de reservar o Sítio Recanto dos Pássaros em Juquitiba para ${mode === 'WEEKEND' ? 'Final de Semana / Feriado' : 'Day Use (Sem Pernoite)'} (${selectedPeople} pessoas). Valor estimado: ${formatCurrency(estimatedTotal)} + Taxa de Limpeza ${formatCurrency(CLEANING_FEE)}. Poderia verificar disponibilidade?`
                    )}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Reservar pelo WhatsApp
                  </a>
                </Button>

                <Button 
                  asChild
                  variant="outline" 
                  size="md" 
                  className="w-full border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332]/5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Link href="#contato">
                    <CalendarCheck className="w-4 h-4" />
                    Preencher Dados de Pré-Reserva
                  </Link>
                </Button>
                
                <p className="text-xs text-center text-gray-500 pt-1">
                  * A caução de {formatCurrency(DEPOSIT_FEE)} é devolvida integralmente após vistoria de check-out
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </Section>
  );
}
