'use client';

import { MapPin, Car, Clock, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const infoCards = [
  { icon: MapPin, label: 'Endereço', value: 'Bairro dos Britos\nJuquitiba - SP' },
  { icon: Car, label: 'Acesso', value: 'A 400m da rodovia asfaltada' },
  { icon: Clock, label: 'Distância', value: '65km de São Paulo\n30 min do Rodoanel' },
  { icon: Navigation, label: 'Rodovia', value: 'Régis Bittencourt (BR-116)' },
];

export function LocationSection() {
  return (
    <section id="localizacao" className="py-24 bg-[#14291E]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="section-tag dark mb-4">Como Chegar</div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Localização & <span className="text-[#C8A882]">Acesso</span>
            </h2>
          </div>
          <p className="text-white/50 max-w-sm text-base leading-relaxed">
            Fácil acesso para garantir que sua viagem seja tranquila desde o primeiro momento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Info Side */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {infoCards.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3.5 p-4 bg-white/6 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
                  >
                    <div className="w-10 h-10 bg-[#C8A882]/15 rounded-xl flex items-center justify-center text-[#C8A882] flex-shrink-0">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-[#C8A882] text-[10px] font-bold uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="text-white font-medium text-sm leading-snug whitespace-pre-line">{item.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex gap-3 mt-2">
              <a
                href="https://www.google.com/maps/search/Juquitiba+Bairro+dos+Britos+SP"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#C8A882] hover:bg-[#B8936A] text-[#14291E] font-semibold text-sm transition-all shadow-lg"
              >
                <MapPin className="w-4 h-4" />
                Google Maps
              </a>
              <a
                href="https://waze.com/ul?q=Juquitiba+Bairro+dos+Britos+SP"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/10 hover:bg-white/18 border border-white/20 text-white font-semibold text-sm transition-all"
              >
                <Navigation className="w-4 h-4" />
                Waze
              </a>
            </div>
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full h-[380px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14628.5!2d-47.0697!3d-23.9312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce3e8f5e7c0b3d%3A0x6e3b45e3a8e2a0a!2sJuquitiba%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(20%) contrast(1.05)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de localização Juquitiba"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
