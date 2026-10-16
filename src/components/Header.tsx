import React, { useEffect, useState } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { PROPERTY_CONFIG } from '../config/property';

const NAV_ITEMS = [
  { label: 'A casa', href: '#a-casa' },
  { label: 'Suítes', href: '#suites' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Experiência', href: '#experiencia' },
  { label: 'Localização', href: '#localizacao' },
] as const;

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        solidHeader
          ? 'bg-[#F6F3EB]/95 backdrop-blur-md border-b border-[#DFD6C3] py-3.5 text-[#1C1917] shadow-xs'
          : 'bg-gradient-to-b from-black/75 via-black/40 to-transparent py-4 sm:py-5 text-[#F6F3EB]'
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Marca tipográfica */}
        <a
          href="#"
          className="group flex flex-col focus:outline-none"
          aria-label={`${PROPERTY_CONFIG.name} — Ir para o início`}
        >
          <span className="font-editorial text-2xl sm:text-[1.7rem] font-medium tracking-wide leading-none">
            Casa na Areia
          </span>
          <span
            className={`text-[0.65rem] uppercase tracking-[0.28em] mt-1 transition-colors ${
              solidHeader ? 'text-[#8C5A32]' : 'text-[#EFE9DC]/85'
            }`}
          >
            Praia do Preá · Ceará
          </span>
        </a>

        {/* Navegação Desktop */}
        <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm font-normal tracking-wide transition-colors ${
                solidHeader
                  ? 'text-[#1C1917]/80 hover:text-[#8C5A32]'
                  : 'text-[#F6F3EB]/90 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA Principal Desktop */}
        <div className="hidden lg:flex items-center">
          <a
            href="#disponibilidade"
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-[0.14em] font-medium transition-all duration-200 rounded-sm ${
              solidHeader
                ? 'bg-[#132A38] text-[#F6F3EB] hover:bg-[#1C3D52]'
                : 'bg-[#F6F3EB] text-[#132A38] hover:bg-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Consultar disponibilidade</span>
          </a>
        </div>

        {/* Botão Menu Mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-menu"
          aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          className={`lg:hidden p-2.5 rounded-sm transition-colors ${
            solidHeader
              ? 'text-[#1C1917] hover:bg-[#EFE9DC]'
              : 'text-[#F6F3EB] hover:bg-white/10'
          }`}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" aria-hidden="true" />
          ) : (
            <Menu className="w-6 h-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-menu"
          aria-label="Menu móvel"
          className="lg:hidden bg-[#F6F3EB] border-b border-[#DFD6C3] px-5 pt-4 pb-6 text-[#1C1917]"
        >
          <ul className="flex flex-col space-y-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-[#1C1917] hover:text-[#8C5A32] border-b border-[#EFE9DC]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <a
              href="#disponibilidade"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#132A38] text-[#F6F3EB] text-xs uppercase tracking-[0.14em] font-medium rounded-sm hover:bg-[#1C3D52] transition-colors"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>Consultar disponibilidade</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};
