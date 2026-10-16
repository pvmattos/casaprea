import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section
      aria-label="Apresentação principal"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#0A161E] text-[#F6F3EB]"
    >
      {/* Fotografia real principal com movimento Ken Burns suave */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/images/exterior-fachada-crepusculo.jpg"
          alt="Fachada da Casa na Areia Preá iluminada ao entardecer, pé na areia em frente à Praia do Preá"
          fetchPriority="high"
          decoding="async"
          className="kenburns h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#050D13]/90 via-[#050D13]/35 to-black/45"
          aria-hidden="true"
        />
      </div>

      {/* Assinatura lateral vertical estilo editorial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 xl:flex flex-col items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-[#F6F3EB]/65"
      >
        <span className="h-14 w-px bg-[#F6F3EB]/30" />
        <span className="writing-vertical">Praia do Preá · Ceará · Brasil</span>
        <span className="h-14 w-px bg-[#F6F3EB]/30" />
      </div>

      {/* Conteúdo enxuto na base do Hero — Foco total na fotografia da casa */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-6 pb-10 pt-28 md:px-10 md:pb-14">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <p className="hero-anim-1 mb-3 inline-flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#E5C9A8] font-medium drop-shadow-xs">
              <span className="h-px w-8 bg-[#D5B895]" aria-hidden="true" />
              <span>Casa na Areia Preá</span>
            </p>

            <h1 className="hero-anim-2 font-editorial text-[clamp(2.4rem,5.6vw,5.25rem)] font-normal leading-[0.98] tracking-tight text-[#F6F3EB] drop-shadow-[0_2px_16px_rgba(0,0,0,0.65)]">
              Seu refúgio exclusivo em frente ao mar.
            </h1>

            <p className="hero-anim-3 mt-4 text-base sm:text-lg text-[#F6F3EB]/90 font-light tracking-wide drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)]">
              Na melhor localização da Praia do Preá · Cruz, Ceará
            </p>
          </div>

          <div className="hero-anim-3 lg:col-span-3 flex flex-col items-start lg:items-end justify-end gap-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#EFE9DC]/85 lg:text-right leading-relaxed">
              14 hóspedes · 6 suítes · piscina no rooftop · pé na areia
            </p>
            <a
              href="#disponibilidade"
              className="inline-flex items-center gap-3 rounded-full border border-[#F6F3EB]/80 bg-[#F6F3EB] px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-medium text-[#132A38] transition-all duration-300 hover:bg-[#D5B895] hover:border-[#D5B895]"
            >
              <span>Consultar disponibilidade</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Rodapé do Hero com linha expansível "Conhecer a casa" */}
        <div className="mt-10 flex items-center justify-between border-t border-white/15 pt-5 text-[11px] uppercase tracking-[0.24em] text-[#F6F3EB]/75">
          <a
            href="#a-casa"
            className="group inline-flex items-center gap-3 hover:text-white transition-colors"
          >
            <span>Conhecer a casa</span>
            <span className="inline-block h-px w-10 bg-[#F6F3EB]/60 transition-all duration-300 group-hover:w-16 group-hover:bg-white" />
          </a>
          <span className="hidden sm:inline">02° 48&apos; S · 40° 24&apos; W</span>
        </div>
      </div>
    </section>
  );
};
