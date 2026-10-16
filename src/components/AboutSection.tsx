import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="a-casa"
      aria-labelledby="about-heading"
      className="py-24 md:py-36 bg-[#F6F3EB] text-[#1C1917]"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Fotografia principal 7 colunas com revelação suave */}
          <figure className="lg:col-span-7">
            <div
              data-reveal="ctn"
              className="overflow-hidden rounded-xs bg-[#EFE9DC] aspect-[3/2]"
            >
              <img
                src="/images/jardim-varanda-barcos.jpg"
                alt="Varanda térrea da Casa na Areia Preá com vista direta para os barcos e a areia da Praia do Preá"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </figure>

          {/* Texto editorial conciso 5 colunas */}
          <div className="lg:col-span-5">
            <p
              data-reveal="p"
              className="text-xs uppercase tracking-[0.26em] text-[#8C5A32] font-medium"
            >
              01 · A casa
            </p>
            <h2
              id="about-heading"
              data-reveal="h"
              className="mt-4 font-editorial text-[clamp(2.4rem,4.5vw,4rem)] font-normal leading-[0.98] text-[#1C1917]"
            >
              Onde o mar é a extensão da varanda.
            </h2>
            <p
              data-reveal="p"
              className="mt-6 text-base md:text-lg leading-relaxed text-[#44403C] font-light"
            >
              Implantada diretamente sobre a areia da Praia do Preá, a casa abraça um jardim
              tropical interno e se abre por completo para a brisa e o horizonte do Atlântico.
            </p>
            <p
              data-reveal="p"
              className="mt-4 text-base md:text-lg leading-relaxed text-[#44403C] font-light"
            >
              São seis suítes climatizadas para até 14 hóspedes, varanda integrada ao mar e um
              rooftop privativo com piscina e espaço gourmet para viver o Preá no seu próprio ritmo.
            </p>

            {/* Indicadores editoriais minimalistas */}
            <div
              data-reveal="p"
              className="mt-8 pt-6 border-t border-[#1C1917]/12 grid grid-cols-3 gap-4"
            >
              <div>
                <span className="block font-editorial text-3xl md:text-4xl text-[#132A38]">6</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#57534E]">
                  Suítes c/ ar
                </span>
              </div>
              <div>
                <span className="block font-editorial text-3xl md:text-4xl text-[#132A38]">14</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#57534E]">
                  Hóspedes
                </span>
              </div>
              <div>
                <span className="block font-editorial text-3xl md:text-4xl text-[#132A38]">100%</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#57534E]">
                  Pé na areia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
