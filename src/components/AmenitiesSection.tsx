import React, { useState } from 'react';
import {
  Waves,
  Sparkles,
  Flame,
  Trees,
  Wind,
  Moon,
  Droplets,
  Utensils,
  Coffee,
  Wifi,
  Tv,
  KeyRound,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { FAQ_ITEMS, PROPERTY_CONFIG, VERIFIED_AMENITIES } from '../config/property';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Waves,
  Sparkles,
  Flame,
  Trees,
  Wind,
  Moon,
  Droplets,
  Utensils,
  Coffee,
  Wifi,
  Tv,
  KeyRound,
  Heart,
  ShieldCheck,
};

export const AmenitiesSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <>
      {/* 07 · Comodidades — Lista Tipográfica Minimalista em 2 Colunas */}
      <section
        aria-labelledby="amenities-heading"
        className="py-24 md:py-36 bg-[#EFE9DC] text-[#1C1917]"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p
                data-reveal="p"
                className="text-xs uppercase tracking-[0.26em] text-[#8C5A32] font-medium"
              >
                07 · Comodidades
              </p>
              <h2
                id="amenities-heading"
                data-reveal="h"
                className="mt-4 font-editorial text-[clamp(2.4rem,4.5vw,4rem)] font-normal leading-[0.96]"
              >
                O que a casa tem
              </h2>
              <p
                data-reveal="p"
                className="mt-4 text-sm text-[#57534E] font-light leading-relaxed"
              >
                Estrutura verificada para estadias em família, grupos de amigos e temporada de
                kitesurf.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12">
              {VERIFIED_AMENITIES.map((item) => {
                const IconComponent = ICON_MAP[item.iconName] || Sparkles;
                return (
                  <div
                    key={item.id}
                    data-reveal="slide"
                    className="flex items-center justify-between gap-4 border-b border-[#1C1917]/15 py-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <IconComponent
                        className="w-4 h-4 text-[#8C5A32] shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-base text-[#1C1917] font-normal">{item.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 08 · Recepção, Regras e Atendimento — Composição Editorial com Retrato 3/4 */}
      <section
        aria-labelledby="hospitality-heading"
        className="py-24 md:py-36 bg-[#F6F3EB] text-[#1C1917]"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <p
                data-reveal="p"
                className="text-xs uppercase tracking-[0.26em] text-[#8C5A32] font-medium"
              >
                08 · Hospitalidade
              </p>
              <h2
                id="hospitality-heading"
                data-reveal="h"
                className="mt-4 font-editorial text-[clamp(2.4rem,4.5vw,4rem)] font-normal leading-[0.96]"
              >
                Recepção no local e estadia descomplicada
              </h2>
              <p
                data-reveal="p"
                className="mt-6 text-base md:text-lg leading-relaxed text-[#44403C] font-light"
              >
                A propriedade conta com entrada privada, self check-in assistido por equipe no local
                (24h) e atendimento direto para organizar os detalhes da chegada do seu grupo.
              </p>

              {/* Regras verificadas em linha limpa */}
              <div
                data-reveal="p"
                className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-[#1C1917]/15 py-5"
              >
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-[#57534E]">
                    Check-in
                  </span>
                  <span className="mt-1 block text-sm font-medium text-[#1C1917]">
                    {PROPERTY_CONFIG.rules.checkIn}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-[#57534E]">
                    Checkout
                  </span>
                  <span className="mt-1 block text-sm font-medium text-[#1C1917]">
                    {PROPERTY_CONFIG.rules.checkOut}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-[#57534E]">
                    Capacidade
                  </span>
                  <span className="mt-1 block text-sm font-medium text-[#1C1917]">
                    Até 14 hóspedes
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-[#57534E]">
                    Pets
                  </span>
                  <span className="mt-1 block text-sm font-medium text-[#1C1917]">
                    Permitidos
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href={PROPERTY_CONFIG.officialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border border-[#1C1917]/25 px-7 py-3.5 text-xs uppercase tracking-[0.2em] text-[#1C1917] transition-colors hover:border-[#132A38] hover:bg-[#132A38] hover:text-[#F6F3EB]"
                >
                  <span>Falar pelo WhatsApp</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <div
                data-reveal="ctn"
                className="overflow-hidden rounded-xs bg-[#EFE9DC] aspect-[3/4]"
              >
                <img
                  src="/images/jardim-frente-mar-jangadas.jpg"
                  alt="Vista do jardim da Casa na Areia Preá para as jangadas e o mar da Praia do Preá"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 09 · Perguntas frequentes (#faq) — Accordion suave estilo editorial */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="py-24 md:py-36 bg-[#EFE9DC] text-[#1C1917]"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p
                data-reveal="p"
                className="text-xs uppercase tracking-[0.26em] text-[#8C5A32] font-medium"
              >
                09 · Dúvidas
              </p>
              <h2
                id="faq-heading"
                data-reveal="h"
                className="mt-4 font-editorial text-[clamp(2.4rem,4.5vw,4rem)] font-normal leading-[0.96]"
              >
                Perguntas frequentes
              </h2>
            </div>

            <div className="lg:col-span-8 border-t border-[#1C1917]/15">
              {FAQ_ITEMS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={faq.question} className="border-b border-[#1C1917]/15">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left cursor-pointer"
                    >
                      <span className="font-editorial text-xl md:text-2xl text-[#1C1917]">
                        {faq.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`text-2xl text-[#8C5A32] transition-transform duration-300 shrink-0 ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-6 text-base leading-relaxed text-[#44403C] font-light">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
