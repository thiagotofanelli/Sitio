'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { q: 'Quais são os horários de check-in e check-out?', a: 'Check-in: sexta-feira a partir das 18h ou sábado a partir das 08h. Check-out: domingo até às 18h. Horários flexíveis podem ser combinados mediante disponibilidade.' },
  { q: 'O que está incluso na diária?', a: 'A diária inclui o uso de toda a infraestrutura: piscina semiolímpica com toboágua e chafariz, salão de festas, churrasqueira, campo de futebol, salão de jogos, lago para pesca, playground, Wi-Fi fibra de 100 Mega e estacionamento.' },
  { q: 'Como funciona a caução de garantia?', a: 'A caução de R$ 1.000,00 é entregue no check-in e funciona como garantia contra eventuais danos. Após a vistoria de check-out, sendo tudo constatado em ordem, o valor é devolvido integralmente.' },
  { q: 'Aceita animais de estimação?', a: 'Sim! Somos pet friendly. Pedimos apenas que os tutores mantenham seus animais sob vigilância e recolham dejetos para preservar os espaços comuns.' },
  { q: 'Qual a política de som e convivência?', a: 'Música ao vivo e som mecânico são permitidos até às 22h. Após esse horário, pedimos volume moderado por respeito à vizinhança e ao descanso dos demais hóspedes.' },
  { q: 'Como funciona a pesca no lago?', a: 'O lago é destinado à pesca esportiva, com política de captura e devolução (pesque e solte). Varas e equipamentos devem ser trazidos pelos hóspedes.' },
  { q: 'Tem estacionamento?', a: 'Sim, o sítio possui estacionamento privativo amplo dentro da propriedade, com portão de acesso controlado.' },
  { q: 'Como é o acesso ao sítio?', a: 'O sítio fica a apenas 400 metros da rodovia asfaltada, no Bairro dos Britos em Juquitiba. São cerca de 65km de São Paulo e 30 minutos do Rodoanel Mário Covas / Rodovia Régis Bittencourt.' },
  { q: 'É necessário levar roupas de cama e banho?', a: 'Sim, recomendamos que os hóspedes tragam roupas de cama, toalhas de banho e itens de higiene pessoal. A cozinha está equipada com fogão, geladeira e freezer.' },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* Left */}
          <div className="lg:col-span-2">
            <div className="section-tag mb-4">FAQ</div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#14291E] tracking-tight leading-tight mb-5">
              Perguntas <span className="text-[#C8A882]">Frequentes</span>
            </h2>
            <p className="text-[#6B6555] leading-relaxed">
              Tire suas dúvidas e prepare-se para uma estadia inesquecível. Qualquer dúvida adicional, fale conosco no WhatsApp.
            </p>
            <a
              href="https://wa.me/5511995418478"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-[#14291E] hover:bg-[#1F3D2E] text-white font-semibold text-sm rounded-xl transition-all shadow-md"
            >
              Falar no WhatsApp
            </a>
          </div>

          {/* Right: Accordion */}
          <div className="lg:col-span-3 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-[#14291E]/25 bg-white shadow-md'
                      : 'border-[#DDD5C4] bg-white/60 hover:bg-white'
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className={`font-semibold text-sm leading-snug transition-colors ${isOpen ? 'text-[#14291E]' : 'text-[#1A1A14]'}`}>
                      {faq.q}
                    </span>
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isOpen ? 'bg-[#14291E] text-white' : 'bg-[#EDE8DC] text-[#6B6555]'
                    }`}>
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5">
                          <div className="h-px bg-[#EDE8DC] mb-4" />
                          <p className="text-[#6B6555] text-sm leading-relaxed">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
