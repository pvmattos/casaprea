import React from 'react';
import { PROPERTY_CONFIG } from '../config/property';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Seção Final de Impacto com Expansão por Scroll e Parallax */}
      <section
        data-cta-scroll
        data-parallax-w
        data-parallax-amp="16"
        aria-label="Chamada final para reserva"
        className="relative h-[88svh] w-full overflow-hidden bg-[#0A161E] text-[#F6F3EB]"
      >
        <div
          data-cta-img
          className="absolute inset-0 overflow-hidden will-change-[clip-path,transform]"
        >
          <img
            src="/images/exterior-areia-praia.jpg"
            alt="Casa na Areia Preá vista diretamente da areia da Praia do Preá"
            loading="lazy"
            decoding="async"
            data-parallax-img
            className="pointer-events-none absolute inset-x-0 -top-[16%] h-[132%] w-full object-cover object-center will-change-transform"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#050D13]/90 via-[#050D13]/45 to-black/35"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col items-center justify-center px-6 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-[#D5B895]">
            Praia do Preá · Ceará
          </p>
          <h2 className="mt-4 max-w-3xl font-editorial text-[clamp(2.5rem,5.5vw,5rem)] font-normal leading-[0.96]">
            Seus dias em frente ao mar começam aqui.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={PROPERTY_CONFIG.officialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              className="inline-flex items-center gap-3 rounded-full bg-[#F6F3EB] px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium text-[#132A38] transition-colors hover:bg-[#D5B895]"
            >
              <span>Reservar pelo WhatsApp</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href={PROPERTY_CONFIG.officialLinks.airbnb}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              className="inline-flex items-center gap-3 rounded-full border border-[#F6F3EB]/60 bg-black/30 backdrop-blur-xs px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium text-[#F6F3EB] transition-colors hover:bg-white/15"
            >
              <span>Ver no Airbnb</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Rodapé Editorial Minimalista */}
      <footer className="bg-[#0A161E] text-[#EFE9DC] border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5">
              <span className="font-editorial text-3xl text-[#F6F3EB] tracking-tight block">
                Casa na Areia <span className="italic font-normal opacity-80">Preá</span>
              </span>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[#D5B895]">
                Praia do Preá · Cruz · Ceará · Brasil
              </p>
              <p className="mt-4 text-sm text-[#EFE9DC]/65 font-light max-w-sm leading-relaxed">
                6 suítes climatizadas · Até 14 hóspedes · Piscina privativa no rooftop · Pé na areia.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2.5 text-sm font-light">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#D5B895] mb-3">
                Navegação
              </p>
              <ul className="space-y-2">
                <li>
                  <a href="#a-casa" className="link-u text-[#EFE9DC]/80 hover:text-white">
                    A casa
                  </a>
                </li>
                <li>
                  <a href="#galeria" className="link-u text-[#EFE9DC]/80 hover:text-white">
                    Galeria
                  </a>
                </li>
                <li>
                  <a href="#suites" className="link-u text-[#EFE9DC]/80 hover:text-white">
                    Suítes
                  </a>
                </li>
                <li>
                  <a href="#experiencia" className="link-u text-[#EFE9DC]/80 hover:text-white">
                    Rooftop & Experiência
                  </a>
                </li>
                <li>
                  <a href="#localizacao" className="link-u text-[#EFE9DC]/80 hover:text-white">
                    Localização
                  </a>
                </li>
                <li>
                  <a href="#disponibilidade" className="link-u text-[#EFE9DC]/80 hover:text-white">
                    Disponibilidade
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-2.5 text-sm font-light">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#D5B895] mb-3">
                Canais Oficiais
              </p>
              <ul className="space-y-2">
                <li>
                  <a
                    href={PROPERTY_CONFIG.officialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-u text-[#EFE9DC]/80 hover:text-white"
                  >
                    WhatsApp ({PROPERTY_CONFIG.officialLinks.whatsappPhoneDisplay}) ↗
                  </a>
                </li>
                <li>
                  <a
                    href={PROPERTY_CONFIG.officialLinks.airbnb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-u text-[#EFE9DC]/80 hover:text-white"
                  >
                    Airbnb Oficial ↗
                  </a>
                </li>
                <li>
                  <a
                    href={PROPERTY_CONFIG.officialLinks.booking}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-u text-[#EFE9DC]/80 hover:text-white"
                  >
                    Booking.com ↗
                  </a>
                </li>
                <li>
                  <a
                    href={PROPERTY_CONFIG.officialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-u text-[#EFE9DC]/80 hover:text-white"
                  >
                    Instagram ({PROPERTY_CONFIG.officialLinks.instagramHandle}) ↗
                  </a>
                </li>
                <li>
                  <a
                    href={PROPERTY_CONFIG.officialLinks.linktree}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-u text-[#EFE9DC]/80 hover:text-white"
                  >
                    Linktree Oficial ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EFE9DC]/50 font-light">
            <p>© {currentYear} Casa na Areia Preá. Todos os direitos reservados.</p>
            <p>02° 48&apos; S · 40° 24&apos; W — Praia do Preá, CE</p>
          </div>
        </div>
      </footer>
    </>
  );
};
