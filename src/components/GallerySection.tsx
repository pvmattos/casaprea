import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { GALLERY_ITEMS } from '../config/property';
import type { GalleryItem } from '../shared/types';

type GalleryCategory = 'Todas' | GalleryItem['category'];

const CATEGORIES: GalleryCategory[] = [
  'Todas',
  'Casa',
  'Rooftop',
  'Áreas sociais',
  'Suítes',
];

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('Todas');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const filteredItems =
    selectedCategory === 'Todas'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const isOpen = activeIndex !== null && activeIndex >= 0 && activeIndex < filteredItems.length;
  const currentItem = isOpen ? filteredItems[activeIndex] : null;

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null || filteredItems.length === 0) return null;
      return (prev - 1 + filteredItems.length) % filteredItems.length;
    });
  }, [filteredItems.length]);

  const showNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null || filteredItems.length === 0) return null;
      return (prev + 1) % filteredItems.length;
    });
  }, [filteredItems.length]);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showNext();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeLightbox, showPrev, showNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) > 45) {
      if (delta > 0) showPrev();
      else showNext();
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="galeria"
      aria-labelledby="gallery-heading"
      className="py-20 sm:py-28 lg:py-32 bg-[#F6F3EB] text-[#1C1917] border-t border-[#DFD6C3]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Cabeçalho e Filtros de Categoria */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#8C5A32] font-semibold mb-3">
              Galeria Fotográfica
            </p>
            <h2
              id="gallery-heading"
              className="font-editorial text-3xl sm:text-5xl font-normal leading-[1.12] text-[#1C1917]"
            >
              Perspectivas da Casa na Areia.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filtrar fotografias por ambiente"
            className="flex flex-wrap gap-2"
          >
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setSelectedCategory(category);
                    setActiveIndex(null);
                  }}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-medium rounded-sm transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#132A38] text-[#F6F3EB]'
                      : 'bg-[#EFE9DC] text-[#44403C] hover:bg-[#E5DEC9]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Editorial de Diferentes Proporções */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
          {filteredItems.map((item, idx) => {
            // Alterna proporções editoriais em telas grandes
            const colSpanClass =
              item.aspect === 'wide'
                ? 'lg:col-span-7 aspect-[16/10]'
                : item.aspect === 'tall'
                  ? 'lg:col-span-5 aspect-[4/3]'
                  : idx % 5 === 0
                    ? 'lg:col-span-7 aspect-[16/10]'
                    : 'lg:col-span-5 aspect-[4/3]';

            return (
              <figure
                key={item.id}
                className={`group relative overflow-hidden rounded-sm bg-[#EFE9DC] ${colSpanClass}`}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Ampliar fotografia: ${item.caption}`}
                  className="w-full h-full block text-left focus:outline-none cursor-pointer"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <span className="inline-block text-[0.65rem] uppercase tracking-[0.2em] text-[#E5C9A8] mb-1">
                          {item.category}
                        </span>
                        <p className="text-xs sm:text-sm text-[#F6F3EB] font-light leading-snug">
                          {item.caption}
                        </p>
                      </div>
                      <span className="p-2 rounded-sm bg-white/15 text-[#F6F3EB] shrink-0">
                        <Expand className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </button>
              </figure>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal Acessível */}
      {isOpen && currentItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampliada da galeria"
          data-testid="gallery-lightbox"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-50 bg-[#0A151D]/95 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-8"
        >
          {/* Barra Superior do Lightbox */}
          <div
            className="flex items-center justify-between text-[#F6F3EB] z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D5B895]">
                {currentItem.category}
              </span>
              <span className="text-xs text-[#EFE9DC]/60">
                {activeIndex + 1} / {filteredItems.length}
              </span>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeLightbox}
              aria-label="Fechar galeria"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm bg-white/10 hover:bg-white/20 text-xs uppercase tracking-[0.14em] text-[#F6F3EB] transition-colors cursor-pointer"
            >
              <span>Fechar</span>
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Imagem Central e Controles Laterais */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Fotografia anterior"
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-sm bg-black/50 hover:bg-black/75 text-[#F6F3EB] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </button>

            <figure
              onClick={(e) => e.stopPropagation()}
              className="max-h-[78vh] max-w-5xl w-full flex flex-col items-center justify-center"
            >
              <img
                src={currentItem.src}
                alt={currentItem.alt}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-xs shadow-2xl"
              />
              <figcaption className="mt-4 text-center text-xs sm:text-sm text-[#EFE9DC]/90 font-light max-w-2xl px-4">
                {currentItem.caption}
              </figcaption>
            </figure>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Próxima fotografia"
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-sm bg-black/50 hover:bg-black/75 text-[#F6F3EB] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Dica de navegação no rodapé do Lightbox */}
          <div
            className="text-center text-[0.7rem] text-[#EFE9DC]/50 tracking-wider uppercase"
            onClick={(e) => e.stopPropagation()}
          >
            Use as setas do teclado ou deslize para navegar · Pressione ESC ou clique no fundo para fechar
          </div>
        </div>
      )}
    </section>
  );
};
