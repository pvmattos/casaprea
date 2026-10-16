import React from 'react';
import { ArrowDown, Calendar, Users, BedDouble, Waves } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section
      aria-label="Apresentação principal"
      className="relative min-h-[92vh] lg:min-h-screen w-full flex items-end overflow-hidden bg-[#0A161E]"
    >
      {/* Fotografia real principal em grande formato */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/exterior-fachada-crepusculo.jpg"
          alt="Fachada da Casa na Areia Preá iluminada ao entardecer, pé na areia em frente à Praia do Preá"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center scale-[1.01] transition-transform duration-1000"
        />
        {/* Gradiente editorial com contraste aprimorado para garantir leitura nítida e confortável */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#050D13]/95 via-[#050D13]/70 to-black/40"
          aria-hidden="true"
        />
      </div>

      {/* Conteúdo Editorial do Hero — Foco na casa, tipografia limpa e alta legibilidade */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-8 lg:px-12 pt-32 pb-12 sm:pb-18 lg:pb-22">
        <div className="max-w-3xl">
          {/* Identificação de destaque da casa */}
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.28em] text-[#E5C9A8] font-semibold mb-3 drop-shadow-sm">
            <span className="w-5 h-[2px] bg-[#D5B895]" aria-hidden="true" />
            <span>Casa na Areia Preá</span>
          </p>

          {/* Título de alto impacto visual e legibilidade perfeita */}
          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-[4rem] text-[#F6F3EB] font-normal leading-[1.1] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Seu refúgio exclusivo em frente ao mar.
          </h1>

          {/* Subtítulo elegante com a localização solicitada */}
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#F6F3EB]/90 font-light leading-snug drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
            Na melhor localização da Praia do Preá · Cruz, Ceará
          </p>

          {/* Indicadores objetivos em cards translúcidos de alto contraste */}
          <dl
            aria-label="Indicadores da propriedade"
            className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl"
          >
            <div className="flex items-center gap-3 p-3 rounded-xs bg-black/45 backdrop-blur-md border border-white/15 shadow-sm">
              <div className="p-2 rounded-xs bg-[#D5B895]/20 text-[#E5C9A8] shrink-0">
                <BedDouble className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <dt className="sr-only">Dormitórios</dt>
                <dd className="text-sm font-medium text-[#F6F3EB]">6 suítes</dd>
                <span className="block text-xs text-[#EFE9DC]/75">Climatizadas</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xs bg-black/45 backdrop-blur-md border border-white/15 shadow-sm">
              <div className="p-2 rounded-xs bg-[#D5B895]/20 text-[#E5C9A8] shrink-0">
                <Users className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <dt className="sr-only">Capacidade</dt>
                <dd className="text-sm font-medium text-[#F6F3EB]">Até 14 hóspedes</dd>
                <span className="block text-xs text-[#EFE9DC]/75">Famílias & grupos</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xs bg-black/45 backdrop-blur-md border border-white/15 shadow-sm">
              <div className="p-2 rounded-xs bg-[#D5B895]/20 text-[#E5C9A8] shrink-0">
                <Waves className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <dt className="sr-only">Lazer exclusivo</dt>
                <dd className="text-sm font-medium text-[#F6F3EB]">Piscina no rooftop</dd>
                <span className="block text-xs text-[#EFE9DC]/75">Privativa com vista mar</span>
              </div>
            </div>
          </dl>

          {/* Botões de Ação com alto contraste */}
          <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <a
              href="#disponibilidade"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 bg-[#F6F3EB] text-[#132A38] text-xs sm:text-sm uppercase tracking-[0.14em] font-medium rounded-sm hover:bg-white shadow-md transition-all active:scale-[0.99]"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>Consultar disponibilidade</span>
            </a>

            <a
              href="#a-casa"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 backdrop-blur-sm bg-black/35 border border-[#F6F3EB]/40 text-[#F6F3EB] text-xs sm:text-sm uppercase tracking-[0.14em] font-medium rounded-sm hover:bg-white/15 transition-all"
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
