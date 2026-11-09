/**
 * Informações oficiais do Kids Fest Emes 2026.
 *
 * Este é o ponto central de edição do conteúdo do site. Altere aqui e todas
 * as seções são atualizadas. Não adicione informações que não tenham sido
 * confirmadas pela equipe da Emes.
 */

export const event = {
  name: "Kids Fest Emes 2026",
  organizer: "Emes",
  yearsOfHistory: 11,
  concept: ["Pequenos artistas.", "Grandes conquistas.", "Memórias para toda a vida."],

  /** Início com fuso de Brasília explícito (UTC−03:00, sem horário de verão). */
  startsAtISO: "2026-11-30T19:00:00-03:00",
  timeZone: "America/Sao_Paulo",
  labels: {
    fullDate: "30 de novembro de 2026",
    dayMonth: "30 de novembro",
    shortDate: "30/11/2026",
    time: "19h",
    timeWithZone: "19h (horário de Brasília)",
  },

  venue: {
    name: "Teatro Marília",
    city: "Belo Horizonte",
    state: "MG",
    /**
     * Endereço conferido na ficha técnica do Teatro Marília publicada pela
     * Prefeitura de Belo Horizonte. Reconfirme com o teatro antes de divulgar.
     */
    address: {
      street: "Av. Professor Alfredo Balena, 586",
      neighborhood: "Santa Efigênia",
      postalCode: "30130-100",
    },
    addressVerified: true,
    mapsQuery:
      "Teatro Marília, Av. Professor Alfredo Balena, 586 - Santa Efigênia, Belo Horizonte - MG, 30130-100",
  },

  ticket: {
    label: "Ingresso único",
    priceCents: 2000,
    paymentMethod: "PIX",
  },

  /** Telefone informado pela Emes. Formato de telefone fixo. */
  contactPhone: {
    display: "(31) 2555-3273",
    tel: "+553125553273",
  },
} as const;

export const eventStartMs = Date.parse(event.startsAtISO);

/* -------------------------------------------------------------------------- */
/* Programação                                                                */
/* -------------------------------------------------------------------------- */

export interface ProgramItem {
  /** Deixe null quando o horário ainda não estiver confirmado. */
  time: string | null;
  title: string;
  description?: string;
}

/** Itens confirmados. */
export const program: ProgramItem[] = [
  { time: "19h", title: "Início do Kids Fest Emes 2026" },
  { time: null, title: "Apresentações musicais dos alunos da Emes" },
];

export interface Performance {
  /** Ordem de entrada no palco. */
  order: number;
  title: string;
  /** Turma, grupo ou professor responsável, se a Emes quiser divulgar. */
  group?: string;
  time?: string;
}

/**
 * Ordem das apresentações. Preencha quando a equipe pedagógica confirmar.
 * Exemplo: { order: 1, title: "Nome da música", group: "Turma de 4 anos" }
 */
export const performances: Performance[] = [];

/* -------------------------------------------------------------------------- */
/* Perguntas frequentes                                                       */
/* -------------------------------------------------------------------------- */

export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: "Quando será o evento?",
    answer: "Dia 30 de novembro de 2026, às 19h.",
  },
  {
    question: "Onde será realizado?",
    answer: "No Teatro Marília, em Belo Horizonte.",
  },
  {
    question: "Quanto custa o ingresso?",
    answer: "R$ 20,00 por ingresso.",
  },
  {
    question: "Como faço para comprar?",
    answer:
      "Utilize o QR Code PIX ou o código copia e cola na área de ingressos. Escolha quantos ingressos quiser: o QR Code é atualizado com o valor total (R$ 20,00 por ingresso).",
  },
  {
    question: "Como confirmo o pagamento?",
    answer:
      "Envie o comprovante pelo WhatsApp e aguarde a conferência da equipe da Emes.",
  },
  {
    question: "Quem pode assistir?",
    answer:
      "Pais, familiares, amigos, convidados e público interessado em música infantil.",
  },
  {
    question: "Haverá outras atrações?",
    answer: "O evento será dedicado às apresentações musicais dos alunos da Emes.",
  },
  // Adicione aqui, somente após confirmação da Emes, respostas sobre:
  // quantidade de ingressos por pessoa, crianças de colo, acessibilidade,
  // horário de abertura dos portões, estacionamento etc.
];

/* -------------------------------------------------------------------------- */
/* Galeria                                                                    */
/* -------------------------------------------------------------------------- */

export interface GalleryImage {
  /** Caminho em /public, ex.: "/images/gallery/kids-fest-2025-01.jpg". */
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  /**
   * Marque true somente quando houver autorização de uso de imagem dos
   * responsáveis por todas as crianças que aparecem na foto. Fotos sem
   * autorização não são exibidas.
   */
  imageUseAuthorized: boolean;
}

/**
 * Fotos reais da Emes, enviadas pela escola em 09/11/2026 (metadados
 * removidos). Nunca use imagens geradas por IA como registro real.
 *
 * Só aparecem no site as fotos com `imageUseAuthorized: true`, que deve ser
 * marcado apenas com autorização de uso de imagem dos responsáveis por todas
 * as crianças visíveis na foto.
 */
// Confirmado pela Emes em 09/11/2026: autorização de uso de imagem em contrato.
const IMAGE_USE_AUTHORIZED = true;

export const gallery: GalleryImage[] = [
  {
    src: "/images/gallery/apresentacao-violao.jpg",
    alt: "Menino sorrindo enquanto toca violão diante do microfone durante uma apresentação",
    width: 1800,
    height: 1193,
    caption: "A alegria de tocar para quem ama",
    imageUseAuthorized: IMAGE_USE_AUTHORIZED,
  },
  {
    src: "/images/gallery/apresentacao-tambores-palco.jpg",
    alt: "Três crianças sentadas no palco tocando tambores azuis junto com a professora",
    width: 1800,
    height: 1200,
    caption: "Ritmo, palco e cumplicidade",
    imageUseAuthorized: IMAGE_USE_AUTHORIZED,
  },
  {
    src: "/images/gallery/musicalizacao-percussao.jpg",
    alt: "Menino de óculos tocando tambor e segurando um chocalho, com colegas ao fundo",
    width: 1800,
    height: 1395,
    caption: "Concentração de pequeno artista",
    imageUseAuthorized: IMAGE_USE_AUTHORIZED,
  },
  {
    src: "/images/gallery/apresentacao-flauta-teclado.jpg",
    alt: "Jovem tocando flauta transversal ao microfone, ao lado de um menino ao teclado",
    width: 1800,
    height: 1193,
    caption: "Cada nota, uma conquista",
    imageUseAuthorized: IMAGE_USE_AUTHORIZED,
  },
  {
    src: "/images/gallery/aula-musicalizacao-bebe.jpg",
    alt: "Professora tocando violão e cantando para uma bebê na sala de musicalização",
    width: 1350,
    height: 1800,
    caption: "Onde a música começa",
    imageUseAuthorized: IMAGE_USE_AUTHORIZED,
  },
];

/* -------------------------------------------------------------------------- */
/* Patrocinadores                                                             */
/* -------------------------------------------------------------------------- */

export interface Sponsor {
  name: string;
  /** Caminho em /public/sponsors, preferencialmente SVG ou PNG transparente. */
  logo: string;
  width: number;
  height: number;
  url?: string;
}

/** Cadastre os patrocinadores confirmados. */
export const sponsors: Sponsor[] = [];

/* -------------------------------------------------------------------------- */
/* Trilha sonora                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Música "Kids Fest", criada pela Emes (maestrokielsaraiva) no Suno em
 * 09/11/2026. Navegadores só permitem áudio após uma interação: com
 * `autoStartOnFirstInteraction`, a música começa no primeiro toque/clique.
 */
export const music = {
  src: "/audio/kids-fest-emes-2026.mp3",
  title: "Kids Fest",
  autoStartOnFirstInteraction: true,
};
