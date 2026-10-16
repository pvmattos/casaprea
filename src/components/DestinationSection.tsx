import React from 'react';
import { Compass, MapPin, Sun, Wind, ExternalLink } from 'lucide-react';
import { PROPERTY_CONFIG } from '../config/property';

const DESTINATION_PILLARS = [
  {
    icon: Wind,
    title: 'Capital Mundial do Kitesurf',
    description:
      'A Praia do Preá é mundialmente reconhecida pelos ventos constantes e pelas condições ideais para o kitesurf e esportes náuticos diretamente em frente à propriedade.',
  },
  {
    icon: Sun,
    title: 'Pôr do Sol Inesquecível',
    description:
      'Ao final da tarde, o horizonte do Preá oferece um dos pores do sol mais celebrados do litoral cearense, contemplado com privacidade da piscina no rooftop.',
  },
  {
    icon: Compass,
    title: 'Dunas, Lagoas e Jericoacoara',
    description:
      'Ponto de partida privilegiado para passeios de buggy pelas dunas, visitas a lagoas cristalinas e à gastronomia e vida noturna da Vila de Jericoacoara.',
  },
] as const;

export const DestinationSection: React.FC = () => {
  const { latitude, longitude } = PROPERTY_CONFIG.location.coordinates;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <section
      id="experiencia"
      aria-labelledby="destination-heading"
      className="py-20 sm:py-28 lg:py-32 bg-[#132A38] text-[#F6F3EB]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Parte 1: A Experiência na Praia do Preá */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[#D5B895] font-medium">
              O Destino · Praia do Preá
            </p>
            <h2
              id="destination-heading"
              className="font-editorial text-3xl sm:text-5xl font-normal leading-[1.12] text-[#F6F3EB]"
            >
              Vento constante, mar aberto e a essência do Ceará.
            </h2>
            <p className="text-base sm:text-lg text-[#EFE9DC]/85 font-light leading-relaxed">
              Localizada no município de Cruz, Ceará, a Praia do Preá preserva o charme autêntico de
              uma vila de pescadores aliado a uma cena internacional de hospitalidade, gastronomia e
              esportes à vela.
            </p>
            <p className="text-sm sm:text-base text-[#EFE9DC]/75 font-light leading-relaxed">
              Na Casa na Areia Preá, você desperta com a brisa do Atlântico, observa as pipas de
              kitesurf colorindo o céu a partir do terraço e aproveita o mar a poucos passos do
              jardim.
            </p>

            <div className="pt-4 grid grid-cols-1 gap-6">
              {DESTINATION_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="flex items-start gap-4 p-4 rounded-sm bg-white/5 border border-white/10"
                  >
                    <div className="p-2.5 rounded-xs bg-[#D5B895]/15 text-[#D5B895] shrink-0">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-editorial text-xl font-medium text-[#F6F3EB]">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-[#EFE9DC]/75 font-light leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <figure className="overflow-hidden rounded-sm bg-[#1C3D52] aspect-[16/11]">
              <img
                src="/images/rooftop-gourmet-kitesurf.jpg"
                alt="Vista do espaço gourmet no rooftop da Casa na Areia Preá com kitesurfistas velejando no mar ao fundo"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="grid grid-cols-2 gap-6">
              <figure className="overflow-hidden rounded-sm bg-[#1C3D52] aspect-[4/3]">
                <img
                  src="/images/jardim-frente-mar-jangadas.jpg"
                  alt="Jangadas tradicionais na areia em frente à Casa na Areia Preá"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </figure>
              <figure className="overflow-hidden rounded-sm bg-[#1C3D52] aspect-[4/3]">
                <img
                  src="/images/rooftop-zenital-arquitetura.jpg"
                  alt="Vista aérea zenital da Casa na Areia Preá integrada à areia da praia"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </figure>
            </div>
          </div>
        </div>

        {/* Parte 2: Localização Privilegiada (#localizacao) */}
        <div
          id="localizacao"
          className="mt-20 sm:mt-28 pt-14 border-t border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#D5B895] font-medium mb-3">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Localização Privilegiada</span>
            </p>
            <h3 className="font-editorial text-2xl sm:text-4xl font-normal text-[#F6F3EB]">
              {PROPERTY_CONFIG.location.fullLabel}
            </h3>
            <p className="mt-3 text-sm sm:text-base text-[#EFE9DC]/80 font-light max-w-2xl leading-relaxed">
              Posicionada diretamente na orla da Praia do Preá, oferecendo tranquilidade à beira-mar
              e fácil acesso às experiências gastronômicas e naturais da região.
            </p>

            <ul className="mt-6 space-y-3">
              {PROPERTY_CONFIG.location.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-[#EFE9DC]/90 font-light"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D5B895]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-sm bg-[#183446] border border-white/15 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-[#D5B895]">
                  Coordenadas Verificadas
                </span>
                <span className="text-xs font-mono text-[#EFE9DC]/75">
                  {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
                </span>
              </div>

              <div className="py-4 border-y border-white/10 space-y-1.5">
                <p className="font-editorial text-xl text-[#F6F3EB]">
                  Frente à Praia do Preá
                </p>
                <p className="text-xs text-[#EFE9DC]/75">
                  Município de Cruz · Litoral Oeste do Ceará · Brasil
                </p>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#F6F3EB] text-[#132A38] text-xs uppercase tracking-[0.14em] font-medium rounded-sm hover:bg-white transition-colors"
              >
                <span>Ver localização no Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
