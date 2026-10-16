import React from 'react';
import { ExternalLink, MapPin, MessageCircle } from 'lucide-react';
import { PROPERTY_CONFIG } from '../config/property';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0E202B] text-[#EFE9DC] border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Coluna 1: Identidade */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="font-editorial text-3xl text-[#F6F3EB] font-normal tracking-wide block">
                {PROPERTY_CONFIG.name}
              </span>
              <span className="text-[0.68rem] uppercase tracking-[0.28em] text-[#D5B895] mt-1 block">
                Praia do Preá · Cruz, Ceará, Brasil
              </span>
            </div>
            <p className="text-sm text-[#EFE9DC]/75 font-light leading-relaxed max-w-sm">
              {PROPERTY_CONFIG.tagline} Casa de temporada pé na areia com 6 suítes climatizadas,
              jardim tropical e rooftop privativo com piscina.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#EFE9DC]/70">
              <MapPin className="w-3.5 h-3.5 text-[#D5B895]" aria-hidden="true" />
              <span>{PROPERTY_CONFIG.location.fullLabel}</span>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#D5B895] font-medium">
              Navegação
            </h3>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <a href="#a-casa" className="hover:text-white transition-colors">
                  A casa
                </a>
              </li>
              <li>
                <a href="#suites" className="hover:text-white transition-colors">
                  Suítes
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-white transition-colors">
                  Galeria
                </a>
              </li>
              <li>
                <a href="#experiencia" className="hover:text-white transition-colors">
                  Experiência
                </a>
              </li>
              <li>
                <a href="#localizacao" className="hover:text-white transition-colors">
                  Localização
                </a>
              </li>
              <li>
                <a href="#disponibilidade" className="hover:text-white transition-colors">
                  Consultar disponibilidade
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Canais Oficiais Verificados */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#D5B895] font-medium">
              Canais Oficiais de Reserva e Contato
            </h3>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <a
                  href={PROPERTY_CONFIG.officialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#D5B895]" aria-hidden="true" />
                  <span>WhatsApp Oficial ({PROPERTY_CONFIG.officialLinks.whatsappPhoneDisplay})</span>
                </a>
              </li>
              <li>
                <a
                  href={PROPERTY_CONFIG.officialLinks.airbnb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-[#D5B895]" aria-hidden="true" />
                  <span>Anúncio Oficial no Airbnb</span>
                </a>
              </li>
              <li>
                <a
                  href={PROPERTY_CONFIG.officialLinks.booking}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-[#D5B895]" aria-hidden="true" />
                  <span>Reserva pelo Booking.com</span>
                </a>
              </li>
              <li>
                <a
                  href={PROPERTY_CONFIG.officialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-[#D5B895]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>Instagram ({PROPERTY_CONFIG.officialLinks.instagramHandle})</span>
                </a>
              </li>
              <li>
                <a
                  href={PROPERTY_CONFIG.officialLinks.linktree}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-[#D5B895]" aria-hidden="true" />
                  <span>Linktree Oficial</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EFE9DC]/55 font-light">
          <p>© {currentYear} Casa na Areia Preá. Todos os direitos reservados.</p>
          <p>Praia do Preá · Cruz · Ceará · Brasil</p>
        </div>
      </div>
    </footer>
  );
};
