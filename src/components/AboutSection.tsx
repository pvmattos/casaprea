import React from 'react';

const HOUSE_HIGHLIGHTS = [
  {
    number: '01',
    title: 'Localização em frente à Praia do Preá',
    description:
      'Completamente pé na areia. O mar é a extensão natural da varanda, com acesso direto à faixa de areia a poucos passos da área social.',
  },
  {
    number: '02',
    title: 'Vista para o mar',
    description:
      'Abertura franca para o oceano Atlântico a partir da varanda térrea, das suítes frontais e do terraço panorâmico.',
  },
  {
    number: '03',
    title: 'Piscina privativa no rooftop',
    description:
      'Terraço elevado com piscina privativa, deck de madeira e espreguiçadeiras para contemplar o pôr do sol do Ceará.',
  },
  {
    number: '04',
    title: 'Jardim interno',
    description:
      'Pátio central com palmeiras e vegetação tropical nativa que integra a arquitetura contemporânea à brisa constante da praia.',
  },
  {
    number: '05',
    title: 'Espaço gourmet com churrasqueira',
    description:
      'Cozinha ao ar livre no rooftop com churrasqueira e ampla mesa de refeições sob cobertura de palha trançada e madeira.',
  },
  {
    number: '06',
    title: 'Seis suítes com ar-condicionado',
    description:
      'Seis suítes espaçosas, todas equipadas com ar-condicionado, cortinas blackout e enxoval de cama para receber até 14 hóspedes.',
  },
] as const;

export const AboutSection: React.FC = () => {
  return (
    <section
      id="a-casa"
      aria-labelledby="about-heading"
      className="py-20 sm:py-28 lg:py-32 bg-[#F6F3EB] text-[#1C1917]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Introdução Editorial Assimétrica */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[#8C5A32] font-semibold mb-3">
              A Casa
            </p>
            <h2
              id="about-heading"
              className="font-editorial text-3xl sm:text-5xl font-normal leading-[1.12] text-[#1C1917]"
            >
              Onde o mar é a extensão da sua varanda.
            </h2>
          </div>

          <div className="lg:col-span-7 lg:pt-4 space-y-5 text-[#44403C] text-base sm:text-lg leading-relaxed font-light">
            <p>
              Concebida para unir a autenticidade rústica do litoral cearense ao conforto da
              arquitetura contemporânea, a <strong className="font-medium text-[#1C1917]">Casa na Areia Preá</strong> ocupa
              uma posição privilegiada diretamente sobre a areia da Praia do Preá, em Cruz, Ceará.
            </p>
            <p>
              Sua planta em formato de pátio abraça um jardim tropical interno e conduz o olhar
              diretamente para o oceano e para as tradicionais jangadas da vila. Da convivência à
              sombra das pérgolas de madeira ao entardecer na piscina privativa do rooftop, cada
              espaço foi desenhado para famílias e grupos de amigos que buscam tranquilidade e
              exclusividade à beira-mar.
            </p>
          </div>
        </div>

        {/* Composição Fotográfica Editorial Assimétrica */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          <figure className="lg:col-span-7 flex flex-col justify-between">
            <div className="overflow-hidden rounded-sm bg-[#EFE9DC] aspect-[16/11]">
              <img
                src="/images/jardim-varanda-barcos.jpg"
                alt="Varanda térrea da Casa na Areia Preá com sofás verdes, mesa de centro em madeira orgânica e vista direta para os barcos na areia da praia"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
            <figcaption className="mt-3 text-xs text-[#57534E] tracking-wide">
              Varanda térrea integrada ao jardim central e aberta diretamente para a areia da Praia do Preá.
            </figcaption>
          </figure>

          <div className="lg:col-span-5 flex flex-col justify-between gap-6 sm:gap-8">
            <figure>
              <div className="overflow-hidden rounded-sm bg-[#EFE9DC] aspect-[16/10]">
                <img
                  src="/images/rooftop-piscina-mar.jpg"
                  alt="Piscina privativa no rooftop da Casa na Areia Preá com vista panorâmica para o mar e jangadas na praia"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
              <figcaption className="mt-2.5 text-xs text-[#57534E] tracking-wide">
                Rooftop privativo com piscina elevada, solarium e vista desimpedida para o oceano.
              </figcaption>
            </figure>

            <figure>
              <div className="overflow-hidden rounded-sm bg-[#EFE9DC] aspect-[16/10]">
                <img
                  src="/images/social-jantar-integrado.jpg"
                  alt="Sala de jantar ampla com mesa em madeira maciça para 14 pessoas integrada à cozinha e ao deck externo"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
              <figcaption className="mt-2.5 text-xs text-[#57534E] tracking-wide">
                Ambientes sociais amplos e integrados com madeira natural e iluminação acolhedora.
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Diferenciais Confirmados da Propriedade */}
        <div className="mt-16 sm:mt-24 pt-14 border-t border-[#DFD6C3]">
          <div className="max-w-2xl mb-12">
            <p className="text-xs uppercase tracking-[0.22em] text-[#8C5A32] font-semibold mb-2">
              Diferenciais Confirmados
            </p>
            <h3 className="font-editorial text-2xl sm:text-4xl font-normal text-[#1C1917]">
              Arquitetura pensada para dias solares e noites serenas.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {HOUSE_HIGHLIGHTS.map((item) => (
              <div
                key={item.number}
                className="pt-5 border-t border-[#DFD6C3]/80 flex flex-col justify-between"
              >
                <div>
                  <span className="font-editorial text-sm italic text-[#8C5A32] block mb-2">
                    {item.number}
                  </span>
                  <h4 className="font-editorial text-xl sm:text-2xl font-medium text-[#1C1917] mb-2.5">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[#57534E] leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
