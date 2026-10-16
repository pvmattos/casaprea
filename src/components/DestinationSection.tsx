import React from 'react';
import { PROPERTY_CONFIG } from '../config/property';

export const DestinationSection: React.FC = () => {
  const { latitude, longitude } = PROPERTY_CONFIG.location.coordinates;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <>
      {/* 03 · Rooftop e piscina — Split Full-Bleed 8/4 em Azul Oceano Profundo */}
      <section
        id="experiencia"
        aria-labelledby="rooftop-heading"
        className="relative overflow-hidden bg-[#132A38] text-[#F6F3EB]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div
            data-parallax-w
            className="relative lg:col-span-8 min-h-[68svh] lg:min-h-[88svh] overflow-hidden"
          >
            <img
              src="/images/rooftop-piscina-mar.jpg"
              alt="Piscina privativa no rooftop da Casa na Areia Preá em frente ao mar e jangadas"
              loading="lazy"
              decoding="async"
              data-parallax-img
              className="h-[115%] w-full object-cover"
            />
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center px-6 py-16 md:px-12 lg:py-24">
            <p
              data-reveal="p"
              className="text-xs uppercase tracking-[0.26em] text-[#D5B895]"
            >
              03 · Rooftop e piscina
            </p>
            <h2
              id="rooftop-heading"
              data-reveal="h"
              className="mt-4 font-editorial text-4xl md:text-5xl font-normal leading-[0.96]"
            >
              Água no alto, mar à frente.
            </h2>
            <p
              data-reveal="p"
              className="mt-6 text-base leading-relaxed text-[#EFE9DC]/85 font-light"
            >
              No terraço superior, a piscina privativa se abre para o horizonte da Praia do Preá e
              para o velejo constante das pipas de kitesurf.
            </p>
            <p
              data-reveal="p"
              className="mt-4 text-base leading-relaxed text-[#EFE9DC]/75 font-light"
            >
              Ao lado do deck com espreguiçadeiras, o espaço gourmet coberto reúne churrasqueira e
              mesa de refeições para longos fins de tarde ao pôr do sol.
            </p>
          </div>
        </div>
      </section>

      {/* 04 · Sala, cozinha e varanda — Fotografia Panorâmica + Trio 4/3 */}
      <section
        aria-labelledby="social-heading"
        className="py-24 md:py-36 bg-[#F6F3EB] text-[#1C1917]"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-6">
              <p
                data-reveal="p"
                className="text-xs uppercase tracking-[0.26em] text-[#8C5A32] font-medium"
              >
                04 · Convivência
              </p>
              <h2
                id="social-heading"
                data-reveal="h"
                className="mt-4 font-editorial text-[clamp(2.4rem,4.6vw,4.25rem)] font-normal leading-[0.96]"
              >
                Sala, cozinha e varanda
              </h2>
            </div>
            <p
              data-reveal="p"
              className="lg:col-span-5 lg:col-start-8 text-base md:text-lg leading-relaxed text-[#44403C] font-light"
            >
              Ambientes integrados em madeira natural e fibras cearenses que conectam a cozinha
              equipada, a sala climatizada e a varanda aberta para o jardim e a praia.
            </p>
          </div>

          {/* Imagem Panorâmica 16/9 */}
          <div
            data-reveal="ctn"
            className="mt-12 overflow-hidden rounded-xs bg-[#EFE9DC] aspect-[16/9]"
          >
            <img
              src="/images/social-jantar-integrado.jpg"
              alt="Sala de jantar com mesa em madeira maciça integrada à varanda e ao jardim central da Casa na Areia Preá"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Trio de Imagens 4/3 */}
          <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div
              data-reveal="ctn"
              className="overflow-hidden rounded-xs bg-[#EFE9DC] aspect-[4/3]"
            >
              <img
                src="/images/social-sala-estar-1.jpg"
                alt="Sala de estar ampla e climatizada com sofás claros e luminárias artesanais"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <div
              data-reveal="ctn"
              className="overflow-hidden rounded-xs bg-[#EFE9DC] aspect-[4/3]"
            >
              <img
                src="/images/social-cozinha-bancada.jpg"
                alt="Cozinha completa com bancada em madeira integrada à área de refeições"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <div
              data-reveal="ctn"
              className="overflow-hidden rounded-xs bg-[#EFE9DC] aspect-[4/3]"
            >
              <img
                src="/images/rooftop-gourmet-kitesurf.jpg"
                alt="Espaço gourmet no rooftop com churrasqueira e vista para os kitesurfistas no mar"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 05 · Ao entardecer — Full-Bleed Noturno com Parallax */}
      <section
        aria-labelledby="twilight-heading"
        data-parallax-w
        className="relative h-[82svh] md:h-[92svh] w-full overflow-hidden bg-[#0A161E] text-[#F6F3EB]"
      >
        <img
          src="/images/exterior-noturna-aerea.jpg"
          alt="Vista noturna da Casa na Areia Preá iluminada em frente ao mar"
          loading="lazy"
          decoding="async"
          data-parallax-img
          className="h-[116%] w-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#050D13]/85 via-[#050D13]/25 to-black/30"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-end px-6 pb-14 md:px-10 md:pb-20">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.26em] text-[#D5B895]">
              05 · Ao entardecer
            </p>
            <h2
              id="twilight-heading"
              className="mt-3 font-editorial text-4xl md:text-6xl font-normal leading-[0.95]"
            >
              Quando a luz muda
            </h2>
            <p className="mt-4 text-base md:text-lg text-[#EFE9DC]/85 font-light">
              Ao cair da tarde, a iluminação quente desenha os pergolados de madeira, as palmeiras
              do pátio interno e a piscina no terraço sob o som das ondas.
            </p>
          </div>
        </div>
      </section>

      {/* 06 · Praia e arredores (#localizacao) — Texto Enxuto + Mapa Interativo */}
      <section
        id="localizacao"
        aria-labelledby="location-heading"
        className="py-24 md:py-36 bg-[#F6F3EB] text-[#1C1917]"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <p
                data-reveal="p"
                className="text-xs uppercase tracking-[0.26em] text-[#8C5A32] font-medium"
              >
                06 · Praia e arredores
              </p>
              <h2
                id="location-heading"
                data-reveal="h"
                className="mt-4 font-editorial text-[clamp(2.4rem,4.6vw,4.25rem)] font-normal leading-[0.96]"
              >
                Praia do Preá, Ceará
              </h2>
              <p
                data-reveal="p"
                className="mt-6 text-base md:text-lg leading-relaxed text-[#44403C] font-light"
              >
                Situada no município de Cruz, a Praia do Preá é referência mundial para o kitesurf e
                ponto de partida privilegiado para explorar a Vila de Jericoacoara, dunas e lagoas
                do litoral oeste cearense.
              </p>

              {/* Indicadores tipográficos limpos */}
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-[#1C1917]/15 pt-8">
                <div>
                  <p className="font-editorial text-2xl md:text-3xl text-[#132A38]">Frente mar</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#57534E]">
                    Pé na areia
                  </p>
                </div>
                <div>
                  <p className="font-editorial text-2xl md:text-3xl text-[#132A38]">Kitesurf</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#57534E]">
                    Vento constante
                  </p>
                </div>
                <div>
                  <p className="font-editorial text-2xl md:text-3xl text-[#132A38]">Cruz · CE</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#57534E]">
                    Vizinha a Jeri
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-u inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#1C1917]"
                >
                  <span>Abrir no Google Maps</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div
                data-reveal="ctn"
                className="overflow-hidden rounded-xs border border-[#1C1917]/12 bg-[#EFE9DC] aspect-[4/3]"
              >
                <iframe
                  title="Mapa de localização — Praia do Preá, Cruz, Ceará"
                  src={mapEmbedUrl}
                  className="h-full w-full border-0 grayscale-[20%] contrast-[1.02]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
