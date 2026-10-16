import React, { useState } from 'react';
import { SUITES_DATA } from '../config/property';

export const SuitesSection: React.FC = () => {
  const [activeSuiteIndex, setActiveSuiteIndex] = useState(0);
  const activeSuite = SUITES_DATA[activeSuiteIndex] ?? SUITES_DATA[0];

  return (
    <section
      id="suites"
      aria-labelledby="suites-heading"
      className="py-24 md:py-36 bg-[#EFE9DC] text-[#1C1917]"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Coluna Esquerda: Fotografia em Grande Formato da Suíte Ativa + Seletor Visual */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div
              data-reveal="ctn"
              className="relative overflow-hidden rounded-xs bg-[#DFD6C3] aspect-[4/5]"
            >
              <img
                key={activeSuite.image}
                src={activeSuite.image}
                alt={activeSuite.imageAlt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-6 text-[#F6F3EB]">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#D5B895]">
                  0{activeSuite.number} · Ar-condicionado
                </span>
                <p className="mt-1 font-editorial text-2xl">
                  {activeSuite.name} — {activeSuite.bedsSummary}
                </p>
                <p className="mt-1 text-xs text-[#EFE9DC]/80 font-light">
                  {activeSuite.capacityNote}
                </p>
              </div>
            </div>

            {/* Miniaturas das 6 suítes */}
            <div className="mt-3 grid grid-cols-6 gap-2">
              {SUITES_DATA.map((suite, idx) => {
                const isSelected = idx === activeSuiteIndex;
                return (
                  <button
                    key={suite.id}
                    type="button"
                    onClick={() => setActiveSuiteIndex(idx)}
                    aria-label={`Visualizar foto da ${suite.name}`}
                    className={`relative aspect-[4/3] overflow-hidden rounded-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-[#132A38] opacity-100'
                        : 'opacity-55 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={suite.image}
                      alt={suite.imageAlt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coluna Direita: Lista Editorial Numerada das 6 Suítes */}
          <div className="lg:col-span-5 lg:col-start-8">
            <p
              data-reveal="p"
              className="text-xs uppercase tracking-[0.26em] text-[#8C5A32] font-medium"
            >
              02 · Os quartos
            </p>
            <h2
              id="suites-heading"
              data-reveal="h"
              className="mt-4 font-editorial text-[clamp(2.5rem,4.8vw,4.25rem)] font-normal leading-[0.96] text-[#1C1917]"
            >
              As seis suítes
            </h2>
            <p
              data-reveal="p"
              className="mt-6 text-base md:text-lg leading-relaxed text-[#44403C] font-light"
            >
              Todas as seis suítes contam com <strong className="font-medium text-[#1C1917]">ar-condicionado</strong>,
              cortinas blackout e roupas de cama, somando 8 camas e 7 banheiros para acomodar até 14
              hóspedes com conforto.
            </p>

            {/* Lista tipográfica limpa inspirada na referência */}
            <div className="mt-10 border-t border-[#1C1917]/15">
              {SUITES_DATA.map((suite, idx) => {
                const isSelected = idx === activeSuiteIndex;
                return (
                  <div
                    key={suite.id}
                    data-reveal="slide"
                    onMouseEnter={() => setActiveSuiteIndex(idx)}
                    onClick={() => setActiveSuiteIndex(idx)}
                    className={`group flex items-baseline justify-between gap-4 border-b border-[#1C1917]/15 py-5 px-3 -mx-3 rounded-xs transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#F6F3EB]/85' : 'hover:bg-[#F6F3EB]/50'
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        className={`text-xs uppercase tracking-[0.2em] transition-colors ${
                          isSelected ? 'text-[#8C5A32] font-semibold' : 'text-[#57534E]'
                        }`}
                      >
                        0{suite.number}
                      </span>
                      <div>
                        <h3 className="font-editorial text-2xl font-normal text-[#1C1917]">
                          {suite.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-[#57534E] font-light">
                          {suite.capacityNote}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block text-sm text-[#1C1917] font-normal">
                        {suite.bedsSummary}
                      </span>
                      <span className="block text-[11px] uppercase tracking-[0.16em] text-[#8C5A32]">
                        Ar-condicionado
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
