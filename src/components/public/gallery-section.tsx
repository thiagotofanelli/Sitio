'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight, Grid3X3, LayoutGrid } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  label: string;
  category: string;
  section: string;
}

const STATIC_IMAGES: GalleryImage[] = [
  { id: 's1', url: '/images/sitio-real/foto-fachada-torre.png', label: 'Sede Colonial & Bosque', category: 'Sede', section: 'GALLERY' },
  { id: 's2', url: '/images/sitio-real/foto-varanda-mesas.png', label: 'Área Social Coberta', category: 'Social', section: 'GALLERY' },
  { id: 's3', url: '/images/sitio-real/foto-churrasqueira-gourmet.png', label: 'Espaço Gourmet', category: 'Gourmet', section: 'GALLERY' },
  { id: 's4', url: '/images/sitio-real/foto-sala-estar.png', label: 'Sala de Estar', category: 'Sede', section: 'GALLERY' },
  { id: 's5', url: '/images/sitio-real/foto-varandao-natureza.jpg', label: 'Varandão Panorâmico', category: 'Natureza', section: 'GALLERY' },
  { id: 's6', url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80', label: 'Piscina Semiolímpica', category: 'Piscina', section: 'GALLERY' },
  { id: 's7', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', label: 'Lago & Natureza', category: 'Natureza', section: 'GALLERY' },
  { id: 's8', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80', label: 'Salão de Festas', category: 'Social', section: 'GALLERY' },
  { id: 's9', url: 'https://images.unsplash.com/photo-1597423498219-04418210827d?auto=format&fit=crop&w=800&q=80', label: 'Campo de Futebol', category: 'Esporte', section: 'GALLERY' },
];

const ALL_CATS = ['Todos', 'Sede', 'Social', 'Gourmet', 'Piscina', 'Natureza', 'Esporte'];

export function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>(STATIC_IMAGES);
  const [activeCat, setActiveCat] = useState('Todos');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [layout, setLayout] = useState<'masonry' | 'grid'>('masonry');

  useEffect(() => {
    fetch('/api/images?section=GALLERY')
      .then((r) => r.json())
      .then((data: any[]) => {
        if (data?.length > 0) setImages(data);
      })
      .catch(() => {});
  }, []);

  const filtered = activeCat === 'Todos' ? images : images.filter((img) => img.category === activeCat);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevImage = useCallback(() => setLightboxIdx((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null)), [filtered.length]);
  const nextImage = useCallback(() => setLightboxIdx((i) => (i !== null ? (i + 1) % filtered.length : null)), [filtered.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, closeLightbox, prevImage, nextImage]);

  return (
    <section id="galeria" className="py-24 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="section-tag mb-4">
              Tour Fotográfico
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#14291E] leading-tight">
              Galeria de <span className="text-[#C8A882]">Fotos</span>
            </h2>
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center gap-2 p-1 bg-white border border-[#DDD5C4] rounded-xl">
            <button
              onClick={() => setLayout('masonry')}
              className={`p-2 rounded-lg transition-all ${layout === 'masonry' ? 'bg-[#14291E] text-white' : 'text-[#6B6555] hover:text-[#14291E]'}`}
              aria-label="Layout masonry"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('grid')}
              className={`p-2 rounded-lg transition-all ${layout === 'grid' ? 'bg-[#14291E] text-white' : 'text-[#6B6555] hover:text-[#14291E]'}`}
              aria-label="Layout grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {ALL_CATS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCat === cat
                  ? 'bg-[#14291E] text-white shadow-md'
                  : 'bg-white border border-[#DDD5C4] text-[#6B6555] hover:border-[#14291E] hover:text-[#14291E]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {layout === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((img, idx) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group bg-[#DDD5C4]"
                onClick={() => openLightbox(idx)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" />
                <div className="absolute inset-0 bg-[#14291E]/0 group-hover:bg-[#14291E]/50 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg inline-block">{img.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Masonry Layout */
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((img, idx) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="break-inside-avoid relative overflow-hidden rounded-2xl cursor-pointer group bg-[#DDD5C4] mb-3"
                style={{ aspectRatio: idx % 5 === 0 ? '3/4' : idx % 3 === 0 ? '4/3' : '1/1' }}
                onClick={() => openLightbox(idx)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.label} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14291E]/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-medium">{img.label}</p>
                  <p className="text-[#C8A882] text-[10px]">{img.category}</p>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <ZoomIn className="w-3.5 h-3.5 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && filtered[lightboxIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
              onClick={closeLightbox}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="max-w-5xl max-h-[85vh] flex flex-col items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={filtered[lightboxIdx].url}
                alt={filtered[lightboxIdx].label}
                className="max-h-[75vh] max-w-full object-contain rounded-xl"
              />
              <div className="text-center">
                <p className="text-white font-medium">{filtered[lightboxIdx].label}</p>
                <p className="text-[#C8A882] text-sm">{filtered[lightboxIdx].category}</p>
              </div>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              {lightboxIdx + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
