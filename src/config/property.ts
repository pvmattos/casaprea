import type { AmenityItem, GalleryItem, SuiteConfig } from '../shared/types';
import { formatDisplayDatePtBr } from '../shared/dateUtils';

export const PROPERTY_CONFIG = {
  name: 'Casa na Areia Preá',
  tagline: 'Seu refúgio exclusivo em frente ao mar.',
  shortDescription:
    'Pé na areia em frente à Praia do Preá. Seis suítes climatizadas, jardim interno e rooftop privativo com piscina sobre o mar.',
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
      'Saída direta para a faixa de areia e área de velejo de kitesurf',
      'Fácil acesso à Vila de Jericoacoara e às lagoas da região',
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
    highlights: ['Ar-condicionado', '1 cama king', 'Vista mar', 'Blackout'],
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
    capacityNote: 'Varanda com vista para a praia e brisa do oceano',
    highlights: ['Ar-condicionado', '1 cama queen + 1 solteiro', 'Varanda', 'Blackout'],
    image: '/images/suite-2-queen-solteiro.jpg',
    imageAlt: 'Suíte 2 da Casa na Areia Preá com cama queen, cama de solteiro e vista para o mar',
  },
  {
    id: 'suite-3',
    number: 3,
    name: 'Suíte 3',
    bedsSummary: '1 cama queen e 1 cama de solteiro',
    bedsDetail: ['1 cama queen', '1 cama de solteiro'],
    capacityNote: 'Ideal para famílias ou pequenos grupos com conforto térmico',
    highlights: ['Ar-condicionado', '1 cama queen + 1 solteiro', 'Enxoval completo', 'Blackout'],
    image: '/images/suite-3-queen-solteiro.jpg',
    imageAlt: 'Suíte 3 da Casa na Areia Preá equipada com cama queen, cama de solteiro e ar-condicionado',
  },
  {
    id: 'suite-4',
    number: 4,
    name: 'Suíte 4',
    bedsSummary: '1 cama queen',
    bedsDetail: ['1 cama queen'],
    capacityNote: 'Ambiente reservado com marcenaria em madeira natural',
    highlights: ['Ar-condicionado', '1 cama queen', 'Iluminação indireta', 'Blackout'],
    image: '/images/suite-4-queen.jpg',
    imageAlt: 'Suíte 4 da Casa na Areia Preá com cama queen, iluminação indireta e portas de madeira',
  },
  {
    id: 'suite-5',
    number: 5,
    name: 'Suíte 5',
    bedsSummary: '1 cama queen',
    bedsDetail: ['1 cama queen'],
    capacityNote: 'Atmosfera serena integrada ao pavimento superior da casa',
    highlights: ['Ar-condicionado', '1 cama queen', 'Enxoval completo', 'Blackout'],
    image: '/images/suite-5-queen.jpg',
    imageAlt: 'Suíte 5 da Casa na Areia Preá com cama queen e acabamento contemporâneo',
  },
  {
    id: 'suite-6',
    number: 6,
    name: 'Suíte 6',
    bedsSummary: '1 cama king',
    bedsDetail: ['1 cama king'],
    capacityNote: 'Suíte ampla com cama king e abertura para o deck',
    highlights: ['Ar-condicionado', '1 cama king', 'Marcenaria natural', 'Blackout'],
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
    caption: 'Fachada frontal pé na areia ao entardecer.',
    aspect: 'wide',
  },
  {
    id: 'gal-2',
    src: '/images/rooftop-piscina-mar.jpg',
    alt: 'Vista aérea da piscina privativa no rooftop em frente ao mar da Praia do Preá e jangadas',
    category: 'Rooftop',
    caption: 'Piscina privativa no rooftop com vista para o mar.',
    aspect: 'wide',
  },
  {
    id: 'gal-3',
    src: '/images/jardim-varanda-barcos.jpg',
    alt: 'Varanda térrea com sofá verde, tapete de fibra natural e vista direta para os barcos na praia',
    category: 'Áreas sociais',
    caption: 'Varanda térrea aberta diretamente para a areia.',
    aspect: 'standard',
  },
  {
    id: 'gal-4',
    src: '/images/rooftop-zenital-arquitetura.jpg',
    alt: 'Vista zenital da arquitetura da casa mostrando jardim central, piscina no rooftop e areia da praia',
    category: 'Casa',
    caption: 'Implantação arquitetônica abraçando o jardim tropical.',
    aspect: 'tall',
  },
  {
    id: 'gal-5',
    src: '/images/rooftop-gourmet-kitesurf.jpg',
    alt: 'Espaço gourmet coberto no rooftop com churrasqueira, mesa de jantar e kitesurfistas no mar ao fundo',
    category: 'Rooftop',
    caption: 'Espaço gourmet no rooftop com vista para os kites.',
    aspect: 'wide',
  },
  {
    id: 'gal-6',
    src: '/images/social-jantar-integrado.jpg',
    alt: 'Mesa de jantar em madeira maciça integrada à cozinha e à varanda com jardim interno',
    category: 'Áreas sociais',
    caption: 'Sala de jantar integrada ao pátio central.',
    aspect: 'standard',
  },
  {
    id: 'gal-7',
    src: '/images/jardim-interno-tropical.jpg',
    alt: 'Jardim interno com palmeiras e vegetação tropical com o mar e jangadas ao fundo',
    category: 'Casa',
    caption: 'Jardim interno com palmeiras e o oceano ao fundo.',
    aspect: 'standard',
  },
  {
    id: 'gal-8',
    src: '/images/exterior-rooftop-aerea.jpg',
    alt: 'Vista aérea destacando a piscina iluminada no rooftop e as suítes da casa',
    category: 'Rooftop',
    caption: 'Vista aérea do terraço panorâmico e suítes.',
    aspect: 'wide',
  },
  {
    id: 'gal-9',
    src: '/images/social-sala-estar-1.jpg',
    alt: 'Sala de estar ampla com sofás claros, pendentes de fibra natural e estrutura em madeira',
    category: 'Áreas sociais',
    caption: 'Sala de estar climatizada com fibras naturais.',
    aspect: 'standard',
  },
  {
    id: 'gal-10',
    src: '/images/jardim-frente-mar-jangadas.jpg',
    alt: 'Vista a partir do gramado da casa para a areia da Praia do Preá e jangadas coloridas',
    category: 'Casa',
    caption: 'Acesso direto do jardim para a areia da Praia do Preá.',
    aspect: 'wide',
  },
  {
    id: 'gal-11',
    src: '/images/rooftop-lounge-espreguicadeiras.jpg',
    alt: 'Espreguiçadeiras no deck do rooftop com vista para o mar',
    category: 'Rooftop',
    caption: 'Solarium no rooftop voltado para o pôr do sol.',
    aspect: 'standard',
  },
  {
    id: 'gal-12',
    src: '/images/social-cozinha-bancada.jpg',
    alt: 'Cozinha completa com bancada em madeira integrada à sala de jantar',
    category: 'Áreas sociais',
    caption: 'Cozinha completa integrada à área social.',
    aspect: 'standard',
  },
  {
    id: 'gal-13',
    src: '/images/exterior-noturna-aerea.jpg',
    alt: 'Vista geral noturna da Casa na Areia Preá em frente ao mar',
    category: 'Casa',
    caption: 'A casa iluminada ao anoitecer na beira da praia.',
    aspect: 'wide',
  },
  {
    id: 'gal-14',
    src: '/images/suite-1-king-vista-mar.jpg',
    alt: 'Suíte 1 com cama king e porta-balcão aberta para o mar',
    category: 'Suítes',
    caption: 'Suíte 1 — Cama king e vista frontal para o mar.',
    aspect: 'standard',
  },
  {
    id: 'gal-15',
    src: '/images/suite-2-queen-solteiro.jpg',
    alt: 'Suíte 2 com vista para a praia através da varanda',
    category: 'Suítes',
    caption: 'Suíte 2 — Cama queen, cama de solteiro e varanda.',
    aspect: 'standard',
  },
  {
    id: 'gal-16',
    src: '/images/suite-3-queen-solteiro.jpg',
    alt: 'Suíte 3 com cama queen e cama de solteiro',
    category: 'Suítes',
    caption: 'Suíte 3 — Cama queen, cama de solteiro e ar-condicionado.',
    aspect: 'standard',
  },
  {
    id: 'gal-17',
    src: '/images/suite-4-queen.jpg',
    alt: 'Suíte 4 com cama queen e iluminação aconchegante',
    category: 'Suítes',
    caption: 'Suíte 4 — Cama queen e marcenaria em madeira natural.',
    aspect: 'standard',
  },
  {
    id: 'gal-18',
    src: '/images/suite-5-queen.jpg',
    alt: 'Suíte 5 com cama queen',
    category: 'Suítes',
    caption: 'Suíte 5 — Cama queen e atmosfera silenciosa.',
    aspect: 'standard',
  },
  {
    id: 'gal-19',
    src: '/images/suite-6-king.jpg',
    alt: 'Suíte 6 com cama king e acabamento em madeira',
    category: 'Suítes',
    caption: 'Suíte 6 — Cama king e abertura para o deck.',
    aspect: 'standard',
  },
  {
    id: 'gal-20',
    src: '/images/suite-1-detalhe.jpg',
    alt: 'Detalhe interno da Suíte 1 com enxoval claro e madeira',
    category: 'Suítes',
    caption: 'Detalhe de acabamento e conforto nas suítes.',
    aspect: 'standard',
  },
  {
    id: 'gal-21',
    src: '/images/exterior-areia-praia.jpg',
    alt: 'Fachada da casa vista da faixa de areia da Praia do Preá',
    category: 'Casa',
    caption: 'A casa vista diretamente da areia da praia.',
    aspect: 'wide',
  },
  {
    id: 'gal-22',
    src: '/images/jardim-deck-varanda.jpg',
    alt: 'Deck de madeira e varanda integrada ao jardim interno',
    category: 'Casa',
    caption: 'Deck de madeira e circulação ao redor do jardim.',
    aspect: 'standard',
  },
  {
    id: 'gal-23',
    src: '/images/jardim-entardecer-palmeiras.jpg',
    alt: 'Luz de fim de tarde entre as palmeiras do jardim interno',
    category: 'Casa',
    caption: 'Luz dourada do entardecer no pátio central.',
    aspect: 'standard',
  },
  {
    id: 'gal-24',
    src: '/images/rooftop-churrasqueira.jpg',
    alt: 'Área de churrasqueira e apoio gourmet no rooftop',
    category: 'Rooftop',
    caption: 'Churrasqueira e bancada de apoio no terraço.',
    aspect: 'standard',
  },
  {
    id: 'gal-25',
    src: '/images/rooftop-piscina-detalhe.jpg',
    alt: 'Borda da piscina no rooftop com o mar da Praia do Preá ao fundo',
    category: 'Rooftop',
    caption: 'Água no alto e horizonte aberto para o Atlântico.',
    aspect: 'standard',
  },
  {
    id: 'gal-26',
    src: '/images/social-mesa-jantar-vista.jpg',
    alt: 'Mesa de jantar com vista para o jardim e o mar',
    category: 'Áreas sociais',
    caption: 'Mesa de refeições com brisa cruzada e vista mar.',
    aspect: 'standard',
  },
  {
    id: 'gal-27',
    src: '/images/social-sala-estar-2.jpg',
    alt: 'Segundo ângulo da sala de estar integrada à varanda',
    category: 'Áreas sociais',
    caption: 'Integração fluida entre sala de estar e varanda.',
    aspect: 'standard',
  },
];

export const VERIFIED_AMENITIES: AmenityItem[] = [
  {
    id: 'beachfront',
    title: 'Pé na areia · Frente ao mar',
    description: 'Saída direta para a areia da Praia do Preá.',
    category: 'Localização e Exterior',
    iconName: 'Waves',
  },
  {
    id: 'rooftop-pool',
    title: 'Piscina privativa no rooftop',
    description: 'Deck elevado com vista panorâmica para o oceano.',
    category: 'Localização e Exterior',
    iconName: 'Sparkles',
  },
  {
    id: 'gourmet-grill',
    title: 'Espaço gourmet com churrasqueira',
    description: 'Cozinha aberta e mesa externa coberta no rooftop.',
    category: 'Localização e Exterior',
    iconName: 'Flame',
  },
  {
    id: 'internal-garden',
    title: 'Jardim tropical interno e varanda',
    description: 'Pátio central arborizado integrado à brisa do mar.',
    category: 'Localização e Exterior',
    iconName: 'Trees',
  },
  {
    id: 'air-conditioning',
    title: 'Ar-condicionado nas 6 suítes e sala',
    description: 'Climatização completa em todos os quartos e estar.',
    category: 'Conforto e Suítes',
    iconName: 'Wind',
  },
  {
    id: 'bedding-blackout',
    title: 'Enxoval completo e cortinas blackout',
    description: 'Roupas de cama e vedação de luz em todas as suítes.',
    category: 'Conforto e Suítes',
    iconName: 'Moon',
  },
  {
    id: 'hot-water-bath',
    title: '7 banheiros com água quente',
    description: '6 suítes + lavabo social com amenidades de banho.',
    category: 'Conforto e Suítes',
    iconName: 'Droplets',
  },
  {
    id: 'full-kitchen',
    title: 'Cozinha completa equipada',
    description: 'Geladeira, fogão, forno, louças, panelas e utensílios.',
    category: 'Gastronomia e Convivência',
    iconName: 'Utensils',
  },
  {
    id: 'dining-table',
    title: 'Mesas de jantar interna e externa',
    description: 'Amplas mesas em madeira natural para até 14 pessoas.',
    category: 'Gastronomia e Convivência',
    iconName: 'Coffee',
  },
  {
    id: 'wifi-workspace',
    title: 'Wi-Fi e espaço de trabalho',
    description: 'Internet sem fio na propriedade e bancada dedicada.',
    category: 'Conectividade e Serviços',
    iconName: 'Wifi',
  },
  {
    id: 'tv-entertainment',
    title: 'TV na sala de estar',
    description: 'Área social climatizada com televisão.',
    category: 'Conectividade e Serviços',
    iconName: 'Tv',
  },
  {
    id: 'staff-self-checkin',
    title: 'Equipe de apoio e recepção 24h',
    description: 'Entrada privada com suporte presencial no check-in.',
    category: 'Conectividade e Serviços',
    iconName: 'KeyRound',
  },
  {
    id: 'pet-friendly',
    title: 'Aceita animais de estimação',
    description: 'Propriedade pet-friendly para toda a família.',
    category: 'Conectividade e Serviços',
    iconName: 'Heart',
  },
  {
    id: 'first-aid',
    title: 'Kit de primeiros socorros',
    description: 'Item de segurança disponível na casa.',
    category: 'Conectividade e Serviços',
    iconName: 'ShieldCheck',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'Quantas pessoas a casa acomoda e como são divididas as suítes?',
    answer:
      'A casa acomoda até 14 hóspedes em 6 suítes climatizadas: Suíte 1 (1 cama king), Suíte 2 (1 cama queen + 1 cama de solteiro), Suíte 3 (1 cama queen + 1 cama de solteiro), Suíte 4 (1 cama queen), Suíte 5 (1 cama queen) e Suíte 6 (1 cama king). Ao todo são 8 camas e 7 banheiros.',
  },
  {
    question: 'A casa fica realmente em frente ao mar?',
    answer:
      'Sim. A Casa na Areia Preá é totalmente pé na areia, posicionada diretamente em frente à Praia do Preá, com saída imediata da varanda térrea para a praia e vista desimpedida para o oceano tanto do térreo quanto do rooftop.',
  },
  {
    question: 'Quais são os horários de check-in e checkout?',
    answer:
      'O check-in ocorre a partir das 14:00 e o checkout até as 12:00. A propriedade conta com self check-in e apoio de equipe no local 24h para receber seu grupo com tranquilidade.',
  },
  {
    question: 'Como funciona a reserva pelo site?',
    answer:
      'O calendário desta página é sincronizado automaticamente com o Airbnb a cada 15 minutos. Basta selecionar as datas livres e a quantidade de hóspedes para finalizar seu atendimento diretamente pelo WhatsApp oficial ou pelo anúncio verificado no Airbnb.',
  },
  {
    question: 'Animais de estimação são permitidos?',
    answer:
      'Sim, animais de estimação são bem-vindos na Casa na Areia Preá.',
  },
] as const;

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
