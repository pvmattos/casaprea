import React, { useEffect, useState } from 'react';
import { PROPERTY_CONFIG } from '../config/property';

const NAV_ITEMS = [
  { label: 'A casa', href: '#a-casa' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Suítes', href: '#suites' },
  { label: 'Experiência', href: '#experiencia' },
  { label: 'Localização', href: '#localizacao' },
  { label: 'Dúvidas', href: '#faq' },
] as const;

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const solidHeader = isScrolled || mobileMenuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        solidHeader
          ? 'bg-[#F6F3EB]/94 backdrop-blur-md border-b border-[#1C1917]/10 py-3.5 text-[#1C1917]'
          : 'header-transparent bg-gradient-to-b from-black/70 via-black/30 to-transparent py-5 text-[#F6F3EB]'
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 flex items-center justify-between">
        {/* Marca tipográfica editorial */}
        <a
          href="#"
          className="font-editorial text-2xl md:text-[1.65rem] tracking-tight leading-none"
          aria-label={`${PROPERTY_CONFIG.name} — Ir para o início`}
        >
          Casa na Areia <span className="italic font-normal opacity-85">Preá</span>
        </a>

        {/* Navegação Desktop com efeito roll vertical corrigido */}
        <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-9 text-sm">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`roll transition-colors ${
                solidHeader
                  ? 'text-[#1C1917]/85 hover:text-[#1C1917]'
                  : 'text-[#F6F3EB]/90 hover:text-white'
              }`}
            >
              <span className="roll-in" data-label={item.label}>
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        {/* CTA Desktop + Controles Mobile */}
        <div className="flex items-center gap-3">
          <a
            href="#disponibilidade"
            data-magnetic
            className={`hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.16em] font-medium transition-colors duration-300 ${
              solidHeader
                ? 'bg-[#132A38] text-[#F6F3EB] hover:bg-[#8C5A32]'
                : 'bg-[#F6F3EB] text-[#132A38] hover:bg-[#D5B895] hover:text-[#132A38]'
            }`}
          >
            <span>Consultar disponibilidade</span>
          </a>

          <a
            href="#disponibilidade"
            className={`md:hidden inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em] font-medium transition-colors ${
              solidHeader
                ? 'bg-[#132A38] text-[#F6F3EB]'
                : 'bg-[#F6F3EB]/95 text-[#132A38]'
            }`}
          >
            Reservar
          </a>

          {/* Botão Menu Mobile minimalista com 2 linhas que viram X */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full cursor-pointer"
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                  mobileMenuOpen ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                  mobileMenuOpen ? 'top-1.5 -rotate-45' : 'bottom-0'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Menu Mobile Fullscreen Editorial */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-menu"
          aria-label="Menu móvel"
          className="lg:hidden bg-[#F6F3EB] border-b border-[#1C1917]/10 px-6 pt-8 pb-10 text-[#1C1917]"
        >
          <div className="flex flex-col gap-4 font-editorial text-3xl">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 border-b border-[#1C1917]/10 hover:text-[#8C5A32] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#disponibilidade"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#132A38] px-6 py-3.5 font-sans text-xs uppercase tracking-[0.18em] font-medium text-[#F6F3EB]"
            >
              Consultar disponibilidade
            </a>
          </div>
          <p className="mt-8 text-xs uppercase tracking-[0.22em] text-[#57534E]">
            Praia do Preá · Cruz · Ceará · Brasil
          </p>
        </nav>
      )}
    </header>
  );
};
