import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
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
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const filteredItems =
    selectedCategory === 'Todas'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const displayedItems = showAllPhotos ? filteredItems : filteredItems.slice(0, 6);

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
    <>
      <section
        id="galeria"
        aria-labelledby="gallery-heading"
        className="py-20 md:py-28 bg-[#EFE9DC] text-[#1C1917]"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          {/* Cabeçalho enxuto estilo editorial */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p
                data-reveal="p"
                className="text-xs uppercase tracking-[0.26em] text-[#8C5A32] font-medium"
              >
                Fotos
              </p>
              <h2
                id="gallery-heading"
                data-reveal="h"
                className="mt-2 font-editorial text-[clamp(2.2rem,4vw,3.5rem)] font-normal leading-none text-[#1C1917]"
              >
                A casa em imagens
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Filtros discretos */}
              <div
                role="tablist"
                aria-label="Filtrar fotografias por ambiente"
                className="flex flex-wrap gap-1.5"
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
                      className={`px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em] rounded-full transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#132A38] text-[#F6F3EB]'
                          : 'bg-[#F6F3EB]/80 text-[#44403C] hover:bg-[#F6F3EB]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setActiveIndex(0)}
                className="inline-flex items-center gap-2 rounded-full border border-[#1C1917]/25 px-5 py-2 text-xs uppercase tracking-[0.18em] text-[#1C1917] transition-colors hover:border-[#132A38] hover:bg-[#132A38] hover:text-[#F6F3EB] cursor-pointer"
              >
                <span>Ver todas as {GALLERY_ITEMS.length} fotos</span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </div>

          {/* Mosaico Assimétrico (Bento Grid 4 colunas inspirado no concorrente) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {displayedItems.map((item, idx) => {
              let bentoClass = 'aspect-square';
              if (!showAllPhotos && selectedCategory === 'Todas') {
                if (idx === 0) bentoClass = 'col-span-2 row-span-2 aspect-square';
                else if (idx === 5) bentoClass = 'col-span-2 aspect-[2/1]';
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  data-reveal="ctn"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Ampliar fotografia: ${item.caption}`}
                  className={`group relative overflow-hidden rounded-xs bg-[#DFD6C3] text-left focus:outline-none cursor-pointer ${bentoClass}`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    <span className="text-xs text-[#F6F3EB] font-light line-clamp-1">
                      {item.caption}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#E5C9A8] shrink-0 ml-3">
                      Ampliar
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Botão para expandir todas na página se desejar */}
          {filteredItems.length > 6 && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllPhotos((prev) => !prev)}
                className="link-u text-xs uppercase tracking-[0.22em] text-[#1C1917]/80 hover:text-[#1C1917] cursor-pointer"
              >
                {showAllPhotos
                  ? 'Mostrar resumo da galeria'
                  : `Expandir grade completa (${filteredItems.length} fotos)`}
              </button>
            </div>
          )}
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
            className="fixed inset-0 z-50 bg-[#0A151D]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
          >
            {/* Barra Superior */}
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs uppercase tracking-[0.16em] text-[#F6F3EB] transition-colors cursor-pointer"
              >
                <span>Fechar</span>
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Imagem Central */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Fotografia anterior"
                className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/75 text-[#F6F3EB] transition-colors cursor-pointer"
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
                className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/75 text-[#F6F3EB] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Miniaturas inferiores para navegação rápida */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="mx-auto max-w-4xl w-full overflow-x-auto flex items-center gap-2 py-2 px-2"
            >
              {filteredItems.map((thumb, idx) => (
                <button
                  key={thumb.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-xs transition-all cursor-pointer ${
                    idx === activeIndex
                      ? 'ring-2 ring-[#D5B895] opacity-100'
                      : 'opacity-45 hover:opacity-80'
                  }`}
                >
                  <img
                    src={thumb.src}
                    alt={thumb.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Interlúdio Full-Bleed Aéreo com Parallax (Inspirado no concorrente) */}
      <section
        aria-label="Vista aérea da propriedade"
        data-parallax-w
        className="relative h-[78svh] md:h-[88svh] w-full overflow-hidden bg-[#0E202B] text-[#F6F3EB]"
      >
        <img
          src="/images/rooftop-zenital-arquitetura.jpg"
          alt="Vista aérea zenital da Casa na Areia Preá mostrando a integração entre o jardim central, o rooftop com piscina e a areia da praia"
          loading="lazy"
          decoding="async"
          data-parallax-img
          className="h-[116%] w-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#050D13]/80 via-transparent to-black/25"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-end px-6 pb-12 md:px-10 md:pb-16">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.26em] text-[#D5B895]">Vista aérea</p>
            <h3 className="mt-2 font-editorial text-3xl md:text-5xl font-normal leading-none">
              A casa vista de cima
            </h3>
          </div>
        </div>
      </section>
    </>
  );
};
