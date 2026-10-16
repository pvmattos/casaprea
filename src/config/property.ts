import type { AmenityItem, GalleryItem, SuiteConfig } from '../shared/types';
import { formatDisplayDatePtBr } from '../shared/dateUtils';

export const PROPERTY_CONFIG = {
  name: 'Casa na Areia Preá',
  tagline: 'Seu refúgio exclusivo em frente ao mar.',
  shortDescription:
    'Arquitetura integrada à natureza, pé na areia em frente à Praia do Preá. Seis suítes climatizadas, jardim interno tropical e rooftop privativo com piscina e vista aberta para o oceano.',
  location: {
    beach: 'Praia do Preá',
    municipality: 'Cruz',
    state: 'Ceará',
    country: 'Brasil',
    fullLabel: 'Praia do Preá · Cruz, Ceará, Brasil',
    coordinates: {
      latitude: -2.8133,
      longitude: -40.4149,
    },
    highlights: [
      'Localização pé na areia, em frente à Praia do Preá',
      'A cerca de 20 minutos da Vila de Jericoacoara',
      'Próxima aos principais restaurantes, escolas de kitesurf e beach clubs da região',
    ],
  },
  stats: {
    suites: 6,
    maxGuests: 14,
    beds: 8,
    bathrooms: 7,
    rating: '5,0',
    reviewCount: 3,
  },
  rules: {
    checkIn: 'Após as 14:00',
    checkOut: 'Antes das 12:00',
    checkInMethod: 'Self check-in com auxílio de equipe no local (24h)',
    maxGuests: 'Máximo de 14 hóspedes',
    pets: 'Permitido animais de estimação',
  },
  officialLinks: {
    airbnb: 'https://www.airbnb.com.br/rooms/1360237649157263407',
    booking: 'https://www.booking.com/Share-iEDaqwW',
    whatsapp: 'https://wa.me/5531973385134',
    whatsappPhoneDisplay: '+55 (31) 97338-5134',
    instagram: 'https://www.instagram.com/casanaareiaprea/',
    instagramHandle: '@casanaareiaprea',
    linktree: 'https://linktr.ee/casanaareiaprea',
  },
} as const;

export const SUITES_DATA: SuiteConfig[] = [
  {
    id: 'suite-1',
    number: 1,
    name: 'Suíte 1',
    bedsSummary: '1 cama king',
    bedsDetail: ['1 cama king'],
    capacityNote: 'Suíte master com varanda voltada para o mar',
    highlights: ['Ar-condicionado', 'Cama king', 'Cortinas blackout', 'Roupas de cama'],
    image: '/images/suite-1-king-vista-mar.jpg',
    secondaryImage: '/images/suite-1-detalhe.jpg',
    imageAlt: 'Suíte 1 da Casa na Areia Preá com cama king e varanda de madeira com vista para o mar',
  },
  {
    id: 'suite-2',
    number: 2,
    name: 'Suíte 2',
    bedsSummary: '1 cama queen e 1 cama de solteiro',
    bedsDetail: ['1 cama queen', '1 cama de solteiro'],
    capacityNote: 'Configuração versátil com varanda e vista para a praia',
    highlights: [
      'Ar-condicionado',
      'Cama queen + solteiro',
      'Cortinas blackout',
      'Roupas de cama',
    ],
    image: '/images/suite-2-queen-solteiro.jpg',
    imageAlt: 'Suíte 2 da Casa na Areia Preá com cama queen, cama de solteiro e vista para o mar',
  },
  {
    id: 'suite-3',
    number: 3,
    name: 'Suíte 3',
    bedsSummary: '1 cama queen e 1 cama de solteiro',
    bedsDetail: ['1 cama queen', '1 cama de solteiro'],
    capacityNote: 'Ideal para famílias ou pequenos grupos com total conforto térmico',
    highlights: [
      'Ar-condicionado',
      'Cama queen + solteiro',
      'Cortinas blackout',
      'Roupas de cama',
    ],
    image: '/images/suite-3-queen-solteiro.jpg',
    imageAlt: 'Suíte 3 da Casa na Areia Preá equipada com cama queen, cama de solteiro e ar-condicionado',
  },
  {
    id: 'suite-4',
    number: 4,
    name: 'Suíte 4',
    bedsSummary: '1 cama queen',
    bedsDetail: ['1 cama queen'],
    capacityNote: 'Ambiente reservado e acolhedor com marcenaria em madeira natural',
    highlights: ['Ar-condicionado', 'Cama queen', 'Cortinas blackout', 'Roupas de cama'],
    image: '/images/suite-4-queen.jpg',
    imageAlt: 'Suíte 4 da Casa na Areia Preá com cama queen, iluminação indireta e portas de madeira',
  },
  {
    id: 'suite-5',
    number: 5,
    name: 'Suíte 5',
    bedsSummary: '1 cama queen',
    bedsDetail: ['1 cama queen'],
    capacityNote: 'Atmosfera serena integrada à circulação superior da casa',
    highlights: ['Ar-condicionado', 'Cama queen', 'Cortinas blackout', 'Roupas de cama'],
    image: '/images/suite-5-queen.jpg',
    imageAlt: 'Suíte 5 da Casa na Areia Preá com cama queen e acabamento contemporâneo',
  },
  {
    id: 'suite-6',
    number: 6,
    name: 'Suíte 6',
    bedsSummary: '1 cama king',
    bedsDetail: ['1 cama king'],
    capacityNote: 'Suíte ampla com cama king e iluminação aconchegante',
    highlights: ['Ar-condicionado', 'Cama king', 'Cortinas blackout', 'Roupas de cama'],
    image: '/images/suite-6-king.jpg',
    imageAlt: 'Suíte 6 da Casa na Areia Preá com cama king, cabeceira em madeira e abertura para o deck',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    src: '/images/exterior-fachada-crepusculo.jpg',
    alt: 'Fachada frontal da Casa na Areia Preá iluminada ao entardecer sobre a areia da praia',
    category: 'Casa',
    caption: 'Fachada frontal pé na areia ao entardecer, com pergolados de madeira e jardim central.',
    aspect: 'wide',
  },
  {
    id: 'gal-2',
    src: '/images/rooftop-piscina-mar.jpg',
    alt: 'Vista aérea da piscina privativa no rooftop em frente ao mar da Praia do Preá e jangadas',
    category: 'Rooftop',
    caption: 'Piscina privativa no rooftop com vista panorâmica para a Praia do Preá.',
    aspect: 'wide',
  },
  {
    id: 'gal-3',
    src: '/images/jardim-varanda-barcos.jpg',
    alt: 'Varanda térrea com sofá verde, tapete de fibra natural e vista direta para os barcos na praia',
    category: 'Áreas sociais',
    caption: 'Varanda térrea integrada diretamente à areia da praia.',
    aspect: 'standard',
  },
  {
    id: 'gal-4',
    src: '/images/rooftop-zenital-arquitetura.jpg',
    alt: 'Vista zenital da arquitetura da casa mostrando jardim central, piscina no rooftop e areia da praia',
    category: 'Casa',
    caption: 'Composição arquitetônica em U abraçando o jardim tropical interno e voltada para o oceano.',
    aspect: 'tall',
  },
  {
    id: 'gal-5',
    src: '/images/rooftop-gourmet-kitesurf.jpg',
    alt: 'Espaço gourmet coberto no rooftop com churrasqueira, mesa de jantar e kitesurfistas no mar ao fundo',
    category: 'Rooftop',
    caption: 'Espaço gourmet no rooftop com churrasqueira e vista para os ventos de kitesurf do Preá.',
    aspect: 'wide',
  },
  {
    id: 'gal-6',
    src: '/images/social-jantar-integrado.jpg',
    alt: 'Mesa de jantar em madeira maciça integrada à cozinha e à varanda com jardim interno',
    category: 'Áreas sociais',
    caption: 'Área de jantar com mesa em madeira natural para confraternizações em grupo.',
    aspect: 'standard',
  },
  {
    id: 'gal-7',
    src: '/images/jardim-interno-tropical.jpg',
    alt: 'Jardim interno com palmeiras e vegetação tropical com o mar e jangadas ao fundo',
    category: 'Casa',
    caption: 'Jardim interno com vegetação nativa que conecta todos os ambientes ao mar.',
    aspect: 'standard',
  },
  {
    id: 'gal-8',
    src: '/images/exterior-rooftop-aerea.jpg',
    alt: 'Vista aérea noturna destacando a piscina iluminada no rooftop e as suítes da casa',
    category: 'Rooftop',
    caption: 'Iluminação noturna destacando o rooftop com piscina, solarium e lounge coberto.',
    aspect: 'wide',
  },
  {
    id: 'gal-9',
    src: '/images/social-sala-estar-1.jpg',
    alt: 'Sala de estar ampla com sofás claros, pendentes de fibra natural e estrutura em madeira',
    category: 'Áreas sociais',
    caption: 'Sala de estar climatizada com mobiliário orgânico e luminárias artesanais.',
    aspect: 'standard',
  },
  {
    id: 'gal-10',
    src: '/images/jardim-frente-mar-jangadas.jpg',
    alt: 'Vista a partir do gramado da casa para a areia da Praia do Preá e jangadas coloridas',
    category: 'Casa',
    caption: 'O mar como extensão da varanda: acesso direto à areia da Praia do Preá.',
    aspect: 'wide',
  },
  {
    id: 'gal-11',
    src: '/images/rooftop-lounge-espreguicadeiras.jpg',
    alt: 'Espreguiçadeiras no deck do rooftop com vista para o mar',
    category: 'Rooftop',
    caption: 'Solarium no rooftop com espreguiçadeiras voltadas para o pôr do sol.',
    aspect: 'standard',
  },
  {
    id: 'gal-12',
    src: '/images/social-cozinha-bancada.jpg',
    alt: 'Cozinha completa com bancada em madeira integrada à sala de jantar',
    category: 'Áreas sociais',
    caption: 'Cozinha equipada integrada aos espaços de convivência.',
    aspect: 'standard',
  },
  {
    id: 'gal-13',
    src: '/images/exterior-noturna-aerea.jpg',
    alt: 'Vista geral noturna da Casa na Areia Preá em frente ao mar',
    category: 'Casa',
    caption: 'Presença arquitetônica à beira-mar na hora azul.',
    aspect: 'wide',
  },
  {
    id: 'gal-14',
    src: '/images/suite-1-king-vista-mar.jpg',
    alt: 'Suíte 1 com cama king e porta-balcão aberta para o mar',
    category: 'Suítes',
    caption: 'Suíte 1 — Cama king, ar-condicionado e vista frontal para o mar.',
    aspect: 'standard',
  },
  {
    id: 'gal-15',
    src: '/images/suite-2-queen-solteiro.jpg',
    alt: 'Suíte 2 com vista para a praia através da varanda',
    category: 'Suítes',
    caption: 'Suíte 2 — Cama queen, cama de solteiro e varanda voltada para o oceano.',
    aspect: 'standard',
  },
  {
    id: 'gal-16',
    src: '/images/suite-6-king.jpg',
    alt: 'Suíte 6 com cama king e acabamento em madeira',
    category: 'Suítes',
    caption: 'Suíte 6 — Cama king, marcenaria aconchegante e ar-condicionado.',
    aspect: 'standard',
  },
];

export const VERIFIED_AMENITIES: AmenityItem[] = [
  {
    id: 'beachfront',
    title: 'Pé na areia e acesso à praia',
    description: 'Localização em frente à Praia do Preá com saída direta para a areia.',
    category: 'Localização e Exterior',
    iconName: 'Waves',
  },
  {
    id: 'rooftop-pool',
    title: 'Piscina privativa no rooftop',
    description: 'Piscina elevada com deck de madeira, espreguiçadeiras e vista panorâmica do mar.',
    category: 'Localização e Exterior',
    iconName: 'Sparkles',
  },
  {
    id: 'gourmet-grill',
    title: 'Espaço gourmet com churrasqueira',
    description: 'Cozinha ao ar livre, churrasqueira e mesa externa coberta no terraço.',
    category: 'Localização e Exterior',
    iconName: 'Flame',
  },
  {
    id: 'internal-garden',
    title: 'Jardim interno e varandas',
    description: 'Pátio central arborizado integrando as áreas sociais à brisa marítima.',
    category: 'Localização e Exterior',
    iconName: 'Trees',
  },
  {
    id: 'air-conditioning',
    title: 'Ar-condicionado',
    description: 'Presente nas 6 suítes e na sala de estar.',
    category: 'Conforto e Suítes',
    iconName: 'Wind',
  },
  {
    id: 'bedding-blackout',
    title: 'Roupas de cama e cortinas blackout',
    description: 'Enxoval de cama e cortinas blackout em todas as suítes.',
    category: 'Conforto e Suítes',
    iconName: 'Moon',
  },
  {
    id: 'hot-water-bath',
    title: 'Água quente e amenidades de banho',
    description: '7 banheiros na propriedade, com água quente, xampu e condicionador.',
    category: 'Conforto e Suítes',
    iconName: 'Droplets',
  },
  {
    id: 'full-kitchen',
    title: 'Cozinha completa equipada',
    description: 'Refrigerador, fogão, forno, louças, talheres, panelas e utensílios básicos.',
    category: 'Gastronomia e Convivência',
    iconName: 'Utensils',
  },
  {
    id: 'dining-table',
    title: 'Mesa de jantar interna e externa',
    description: 'Ampla mesa em madeira maciça na área social e mesa de refeições no rooftop.',
    category: 'Gastronomia e Convivência',
    iconName: 'Coffee',
  },
  {
    id: 'wifi-workspace',
    title: 'Wi-Fi e espaço de trabalho',
    description: 'Conexão sem fio disponível e espaço de trabalho exclusivo.',
    category: 'Conectividade e Serviços',
    iconName: 'Wifi',
  },
  {
    id: 'tv-entertainment',
    title: 'TV na área social',
    description: 'Sala de estar integrada equipada com televisão.',
    category: 'Conectividade e Serviços',
    iconName: 'Tv',
  },
  {
    id: 'staff-self-checkin',
    title: 'Recepção 24h e self check-in',
    description: 'Entrada privada e apoio de funcionários no local para receber os hóspedes.',
    category: 'Conectividade e Serviços',
    iconName: 'KeyRound',
  },
  {
    id: 'pet-friendly',
    title: 'Permitido animais de estimação',
    description: 'Sua família completa é bem-vinda (animais de assistência sempre permitidos).',
    category: 'Conectividade e Serviços',
    iconName: 'Heart',
  },
  {
    id: 'first-aid',
    title: 'Kit de primeiros socorros',
    description: 'Item de segurança doméstica disponível na propriedade.',
    category: 'Conectividade e Serviços',
    iconName: 'ShieldCheck',
  },
];

/**
 * Gera o link oficial de consulta via WhatsApp com mensagem estruturada em português.
 */
export function buildWhatsAppInquiryUrl(params?: {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  nights?: number;
}): string {
  const baseUrl = 'https://wa.me/5531973385134';
  if (!params?.checkIn || !params?.checkOut) {
    const defaultMsg =
      'Olá! Gostaria de consultar a disponibilidade e informações de reserva da Casa na Areia Preá.';
    return `${baseUrl}?text=${encodeURIComponent(defaultMsg)}`;
  }

  const checkInBr = formatDisplayDatePtBr(params.checkIn, 'short');
  const checkOutBr = formatDisplayDatePtBr(params.checkOut, 'short');
  const guestsText = params.guests
    ? `${params.guests} ${params.guests === 1 ? 'hóspede' : 'hóspedes'}`
    : 'a definir';
  const nightsText = params.nights
    ? ` (${params.nights} ${params.nights === 1 ? 'noite' : 'noites'})`
    : '';

  const text = [
    'Olá! Consultei o calendário no site oficial da *Casa na Areia Preá* e gostaria de verificar as condições de reserva para:',
    '',
    `• Check-in: ${checkInBr}`,
    `• Checkout: ${checkOutBr}${nightsText}`,
    `• Hóspedes: ${guestsText}`,
    '',
    'Poderiam confirmar a disponibilidade e os valores para esse período?',
  ].join('\n');

  return `${baseUrl}?text=${encodeURIComponent(text)}`;
}

/**
 * Gera o link direto para o anúncio oficial no Airbnb preenchido com as datas e quantidade de hóspedes.
 */
export function buildAirbnbBookingUrl(params?: {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}): string {
  const url = new URL(PROPERTY_CONFIG.officialLinks.airbnb);
  if (params?.checkIn) url.searchParams.set('check_in', params.checkIn);
  if (params?.checkOut) url.searchParams.set('check_out', params.checkOut);
  if (params?.guests) {
    url.searchParams.set('guests', String(params.guests));
    url.searchParams.set('adults', String(params.guests));
  }
  return url.toString();
}
