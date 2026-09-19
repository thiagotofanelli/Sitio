'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TreePine, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Galeria', href: '#galeria' },
    { name: 'Estrutura', href: '#estrutura' },
    { name: 'Comodidades', href: '#comodidades' },
    { name: 'Preços', href: '#precos' },
    { name: 'Disponibilidade', href: '#disponibilidade' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-[#14291E]/98 backdrop-blur-xl shadow-[0_2px_24px_rgba(20,41,30,0.3)] py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300',
              isScrolled ? 'bg-[#C8A882]/20' : 'bg-white/15'
            )}>
              <TreePine className="w-4.5 h-4.5 text-[#C8A882]" strokeWidth={1.5} />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className={cn(
                'font-serif font-semibold text-lg leading-tight transition-colors',
                'text-white'
              )}>
                Recanto dos Pássaros
              </span>
              <span className={cn(
                'text-[10px] font-medium tracking-[0.12em] uppercase transition-colors',
                isScrolled ? 'text-[#C8A882]/70' : 'text-white/55'
              )}>
                Juquitiba · São Paulo
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  'text-white/75 hover:text-white hover:bg-white/10'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="#contato"
              className="px-5 py-2.5 rounded-xl bg-[#C8A882] hover:bg-[#B8936A] text-[#14291E] text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Reservar Agora
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 -mr-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-[300px] bg-[#14291E] lg:hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <TreePine className="w-5 h-5 text-[#C8A882]" strokeWidth={1.5} />
                  <span className="font-serif font-semibold text-white text-base">
                    Recanto dos Pássaros
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 overflow-y-auto p-5 space-y-1">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 text-base font-medium transition-all"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Atalho Admin no Menu Mobile */}
                <div className="pt-3 mt-3 border-t border-white/10">
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 text-sm font-medium transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Acessar Área Administrativa
                  </Link>
                </div>
              </nav>

              {/* CTA */}
              <div className="p-5 border-t border-white/10">
                <Link
                  href="#contato"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3.5 rounded-xl bg-[#C8A882] hover:bg-[#B8936A] text-[#14291E] font-semibold text-base transition-all"
                >
                  Reservar Agora
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
