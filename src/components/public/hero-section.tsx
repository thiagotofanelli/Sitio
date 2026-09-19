'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Waves, MapPin, ChevronDown, ArrowRight } from 'lucide-react';

const heroSlides = [
  {
    url: '/images/sitio-real/foto-varandao-natureza.jpg',
    alt: 'Varandão colonial com vista para a natureza',
    label: 'Varandão Panorâmico',
  },
  {
    url: '/images/sitio-real/foto-sala-estar.png',
    alt: 'Sala de Estar Ampla da Casa Sede',
    label: 'Casa Sede',
  },
  {
    url: '/images/sitio-real/foto-churrasqueira-gourmet.png',
    alt: 'Churrasqueira em alvenaria e área gourmet',
    label: 'Espaço Gourmet',
  },
  {
    url: '/images/sitio-real/foto-varanda-mesas.png',
    alt: 'Área coberta com mesas',
    label: 'Área Social',
  },
  {
    url: '/images/sitio-real/foto-fachada-torre.png',
    alt: 'Fachada da Sede Colonial',
    label: 'Sede Colonial',
  },
  {
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1920&q=85',
    alt: 'Piscina Semiolímpica',
    label: 'Piscina Semiolímpica',
  },
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
    alt: 'Lago para Pesca Esportiva',
    label: 'Lago & Pesca',
  },
];

const stats = [
  { icon: Users, value: '100', unit: 'hóspedes', label: 'Capacidade' },
  { value: '9', unit: 'quartos', label: 'Acomodações' },
  { value: '65km', unit: 'de SP', label: 'Distância' },
  { value: '150', unit: 'pessoas', label: 'Salão de Festas' },
];

export function HeroSection() {
  const [slides, setSlides] = useState(heroSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);

  useEffect(() => {
    async function loadDynamicHero() {
      try {
        const res = await fetch('/api/images?section=HERO');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setSlides(data.map((item: any) => ({ url: item.url, alt: item.label, label: item.label })));
          }
        }
      } catch (_) {}
    }
    loadDynamicHero();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setPrevSlide(currentSlide);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length, currentSlide]);

  return (
    <section className="relative h-screen min-h-[600px] max-h-[1000px] flex flex-col overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.url}
          className="absolute inset-0 transition-opacity duration-1500"
          style={{ opacity: index === currentSlide ? 1 : 0, transitionDuration: '1500ms' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.url}
            alt={slide.alt}
            className="w-full h-full object-cover"
            style={{
              transform: index === currentSlide ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 8s ease-out',
            }}
          />
        </div>
      ))}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D1E16]/90 via-[#0D1E16]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1E16]/70 via-transparent to-[#0D1E16]/30" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-5 md:px-8 w-full pt-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#C8A882]" />
              <span className="text-[#C8A882] text-xs font-semibold tracking-[0.18em] uppercase">
                Juquitiba · São Paulo · A 65km de SP
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-bold tracking-tight leading-[1.08] mb-6 text-balance">
              Sítio Recanto <span className="text-[#C8A882]">dos Pássaros</span>
            </h1>

            <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-lg">
              Um refúgio exclusivo para casamentos, retiros e confraternizações. Piscina semiolímpica, salão para 150 pessoas e natureza exuberante.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-10">
              {[
                { icon: Users, text: 'Até 100 hóspedes' },
                { icon: Waves, text: 'Piscina semiolímpica' },
                { icon: MapPin, text: '65km de SP' },
              ].map((badge) => {
                const Icon = badge.icon;
                return (
                  <span
                    key={badge.text}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/85 text-xs font-medium"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#C8A882]" />
                    {badge.text}
                  </span>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="#contato"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#C8A882] hover:bg-[#B8936A] text-[#14291E] font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                Solicitar Reserva
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#galeria"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/18 backdrop-blur-sm border border-white/25 text-white font-medium text-base transition-all duration-300"
              >
                Ver Galeria
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar: Stats + Slide nav */}
      <div className="relative z-10 bg-gradient-to-t from-[#0D1E16]/80 to-transparent pb-6 pt-10">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
            {/* Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex flex-col"
                >
                  <span className="text-white font-serif font-semibold text-2xl leading-none">
                    {stat.value}
                    <span className="text-[#C8A882] text-sm font-sans font-normal ml-1">{stat.unit}</span>
                  </span>
                  <span className="text-white/45 text-xs mt-0.5">{stat.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Slide Dots */}
            {slides.length > 1 && (
              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setPrevSlide(currentSlide); setCurrentSlide(idx); }}
                    className={`rounded-full transition-all duration-300 ${
                      idx === currentSlide
                        ? 'w-6 h-1.5 bg-[#C8A882]'
                        : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Foto ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-2 z-10"
      >
        <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase [writing-mode:vertical-lr]">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-white/30 animate-bounce" />
      </motion.div>
    </section>
  );
}
