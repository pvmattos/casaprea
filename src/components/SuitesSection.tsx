import React from 'react';
import { Wind, BedDouble, Check } from 'lucide-react';
import { SUITES_DATA } from '../config/property';

export const SuitesSection: React.FC = () => {
  return (
    <section
      id="suites"
      aria-labelledby="suites-heading"
      className="py-20 sm:py-28 lg:py-32 bg-[#EFE9DC] text-[#1C1917] border-t border-[#DFD6C3]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Cabeçalho da seção */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14 sm:mb-20">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.22em] text-[#8C5A32] font-semibold mb-3">
              Acomodações · Até 14 Hóspedes
            </p>
            <h2
              id="suites-heading"
              className="font-editorial text-3xl sm:text-5xl font-normal leading-[1.12] text-[#1C1917]"
            >
              Seis suítes climatizadas para um descanso absoluto.
            </h2>
          </div>

          <div className="lg:col-span-5 text-sm sm:text-base text-[#44403C] font-light leading-relaxed">
            <p>
              Todas as seis suítes da casa possuem <strong className="font-medium text-[#1C1917]">ar-condicionado</strong>,
              cortinas blackout, roupas de cama e marcenaria em madeira natural, totalizando 8 camas e
              7 banheiros na propriedade.
            </p>
          </div>
        </div>

        {/* Destaque de climatização e conforto */}
        <div className="mb-12 p-5 sm:p-6 bg-[#F6F3EB] border border-[#DFD6C3] rounded-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#132A38] text-[#F6F3EB] rounded-sm">
              <Wind className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1C1917]">
                Conforto térmico confirmado em todas as suítes
              </p>
              <p className="text-xs text-[#57534E]">
                6 suítes independentes · 2 camas king · 4 camas queen · 2 camas de solteiro
              </p>
            </div>
          </div>

          <a
            href="#disponibilidade"
            className="text-xs uppercase tracking-[0.14em] font-medium text-[#132A38] hover:text-[#8C5A32] underline underline-offset-4"
          >
            Verificar datas para o seu grupo →
          </a>
        </div>

        {/* Grid das 6 Suítes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SUITES_DATA.map((suite) => (
            <article
              key={suite.id}
              className="bg-[#F6F3EB] border border-[#DFD6C3] rounded-sm overflow-hidden flex flex-col justify-between transition-colors hover:border-[#8C5A32]/60"
            >
              <div>
                <div className="relative aspect-[3/2] overflow-hidden bg-[#E5DEC9]">
                  <img
                    src={suite.image}
                    alt={suite.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-[#132A38]/90 backdrop-blur-xs text-[#F6F3EB] text-[0.7rem] uppercase tracking-[0.16em] font-medium rounded-xs">
                    {suite.name}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-editorial text-2xl font-medium text-[#1C1917]">
                      {suite.name}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2D4A3E] bg-[#EBF0EC] px-2.5 py-1 rounded-xs">
                      <Wind className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Ar-condicionado</span>
                    </span>
                  </div>

                  {/* Configuração de camas destacada */}
                  <div className="mt-3 flex items-center gap-2 text-sm font-medium text-[#8C5A32]">
                    <BedDouble className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{suite.bedsSummary}</span>
                  </div>

                  <p className="mt-2.5 text-xs text-[#57534E] leading-relaxed">
                    {suite.capacityNote}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-[#EFE9DC]">
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5" aria-label={`Comodidades da ${suite.name}`}>
                  {suite.highlights.map((feat) => (
                    <li
                      key={feat}
                      className="inline-flex items-center gap-1 text-xs text-[#57534E]"
                    >
                      <Check className="w-3 h-3 text-[#2D4A3E]" aria-hidden="true" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
