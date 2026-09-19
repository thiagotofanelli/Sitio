import Link from 'next/link';
import { TreePine, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0D1E16] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[#C8A882]/20 rounded-xl flex items-center justify-center">
                <TreePine className="w-5 h-5 text-[#C8A882]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-serif font-semibold text-lg leading-none">Recanto dos Pássaros</p>
                <p className="text-[10px] text-white/40 tracking-widest uppercase mt-0.5">Juquitiba · São Paulo</p>
              </div>
            </div>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs mb-6">
              Um refúgio exclusivo em meio à natureza, ideal para casamentos, retiros, confraternizações e momentos inesquecíveis.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 bg-white/8 hover:bg-[#C8A882]/20 hover:text-[#C8A882] rounded-xl flex items-center justify-center text-white/50 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 bg-white/8 hover:bg-[#C8A882]/20 hover:text-[#C8A882] rounded-xl flex items-center justify-center text-white/50 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[#C8A882] text-xs font-bold uppercase tracking-[0.12em] mb-5">Navegação</h4>
            <ul className="space-y-3">
              {[
                { name: 'Galeria', href: '#galeria' },
                { name: 'Estrutura', href: '#estrutura' },
                { name: 'Comodidades', href: '#comodidades' },
                { name: 'Preços', href: '#precos' },
                { name: 'Disponibilidade', href: '#disponibilidade' },
                { name: 'Reservar', href: '#contato' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/45 hover:text-white text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#C8A882] text-xs font-bold uppercase tracking-[0.12em] mb-5">Contato</h4>
            <ul className="space-y-4">
              <li>
                <a href="https://wa.me/5511995418478" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-white/45 hover:text-white transition-colors group">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#C8A882]" />
                  <span className="text-sm">(11) 99541-8478</span>
                </a>
              </li>
              <li>
                <a href="mailto:contato@sitiorecantodospassaros.com.br" className="flex items-start gap-3 text-white/45 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#C8A882]" />
                  <span className="text-sm break-all">contato@sitiorecantodospassaros.com.br</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/45">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#C8A882]" />
                  <span className="text-sm">Bairro dos Britos<br />Juquitiba · SP</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider & Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-6 pb-32 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-xs text-center sm:text-left">
            © {year} Sítio Recanto dos Pássaros. Todos os direitos reservados.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all shadow-md active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Acessar Área Administrativa
          </Link>
        </div>
      </div>
    </footer>
  );
}
