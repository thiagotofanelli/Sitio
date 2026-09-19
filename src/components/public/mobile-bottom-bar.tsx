'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, CalendarDays } from 'lucide-react';

export function MobileBottomBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        >
          <div className="bg-[#14291E]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 safe-area-inset-bottom">
            <div className="flex items-center gap-3 max-w-sm mx-auto">
              <div className="flex-1">
                <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider">A partir de</p>
                <p className="text-white font-serif font-semibold text-xl leading-none">
                  R$ 3.000
                  <span className="text-[#C8A882] text-xs font-sans font-normal ml-1">/ 20 pessoas</span>
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href="#contato"
                  className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/18 border border-white/20 text-white text-sm font-semibold rounded-xl transition-all"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Reservar</span>
                </a>
                <a
                  href="https://wa.me/5511995418478?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20S%C3%ADtio%20Recanto%20dos%20P%C3%A1ssaros!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#C8A882] hover:bg-[#B8936A] text-[#14291E] text-sm font-semibold rounded-xl transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
