import React from 'react';
import { ArrowDown, Calendar, Users, BedDouble, Waves } from 'lucide-react';
import { PROPERTY_CONFIG } from '../config/property';

export const Hero: React.FC = () => {
  return (
    <section
      aria-label="Apresentação principal"
      className="relative min-h-[92vh] lg:min-h-screen w-full flex items-end overflow-hidden bg-[#132A38]"
    >
      {/* Fotografia real principal em grande formato */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/exterior-fachada-crepusculo.jpg"
          alt="Fachada da Casa na Areia Preá iluminada ao entardecer, localizada sobre a areia em frente à Praia do Preá"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center scale-[1.01] transition-transform duration-1000"
        />
        {/* Gradiente editorial sutil para garantir contraste e legibilidade perfeita */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0D1D27]/90 via-[#0D1D27]/40 to-black/30"
          aria-hidden="true"
        />
      </div>

      {/* Conteúdo Editorial do Hero */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-8 lg:px-12 pt-36 pb-14 sm:pb-20 lg:pb-24">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#EFE9DC]/90 mb-4 font-medium">
            <span className="w-6 h-[1px] bg-[#D5B895]" aria-hidden="true" />
            <span>{PROPERTY_CONFIG.location.fullLabel}</span>
          </p>

          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-[4.25rem] text-[#F6F3EB] font-normal leading-[1.06] tracking-tight">
            {PROPERTY_CONFIG.tagline}
          </h1>

          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-[#EFE9DC]/90 font-light leading-relaxed max-w-2xl">
            {PROPERTY_CONFIG.shortDescription}
          </p>

          {/* Indicadores objetivos verificados */}
          <dl
            aria-label="Indicadores da propriedade"
            className="mt-8 pt-6 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-sm bg-white/10 text-[#E5C9A8]">
                <BedDouble className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <dt className="sr-only">Dormitórios</dt>
                <dd className="text-sm sm:text-base font-medium text-[#F6F3EB]">
                  6 suítes
                </dd>
                <span className="block text-xs text-[#EFE9DC]/75">
                  Todas com ar-condicionado
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-sm bg-white/10 text-[#E5C9A8]">
                <Users className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <dt className="sr-only">Capacidade</dt>
                <dd className="text-sm sm:text-base font-medium text-[#F6F3EB]">
                  Até 14 hóspedes
                </dd>
                <span className="block text-xs text-[#EFE9DC]/75">
                  Conforto para famílias e grupos
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-sm bg-white/10 text-[#E5C9A8]">
                <Waves className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <dt className="sr-only">Lazer exclusivo</dt>
                <dd className="text-sm sm:text-base font-medium text-[#F6F3EB]">
                  Piscina privativa no rooftop
                </dd>
                <span className="block text-xs text-[#EFE9DC]/75">
                  Vista aberta para o oceano
                </span>
              </div>
            </div>
          </dl>

          {/* Botões de Ação */}
          <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href="#disponibilidade"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#F6F3EB] text-[#132A38] text-xs sm:text-sm uppercase tracking-[0.14em] font-medium rounded-sm hover:bg-white transition-all"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>Consultar disponibilidade</span>
            </a>

            <a
              href="#a-casa"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 border border-[#F6F3EB]/45 text-[#F6F3EB] text-xs sm:text-sm uppercase tracking-[0.14em] font-medium rounded-sm hover:bg-white/10 transition-all"
            >
              <span>Conhecer a casa</span>
              <ArrowDown className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
