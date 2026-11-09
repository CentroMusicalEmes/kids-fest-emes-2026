import { event } from "./event";
import { resolveWhatsAppUrl } from "@/lib/whatsapp";

/**
 * URL pública do site: variável NEXT_PUBLIC_SITE_URL, se definida, ou o
 * domínio oficial configurado na Vercel em 09/11/2026.
 * Quando o site principal da escola ocupar o www, troque para
 * https://kidsfest.centromusicalemes.com.br (já configurado).
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.centromusicalemes.com.br"
).replace(/\/$/, "");

/**
 * WhatsApp.
 *
 * O número da Emes, (31) 2555-3273, foi testado pela equipe e recebe
 * mensagens no WhatsApp (confirmado em 09/11/2026), por isso os links ficam
 * ativos por padrão.
 *
 * Para trocar de número: NEXT_PUBLIC_WHATSAPP_NUMBER=55DDDNUMERO.
 * Para desativar os links: NEXT_PUBLIC_WHATSAPP_VALIDATED=false.
 */
export const whatsappConfig = {
  number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "553125553273",
  validated: process.env.NEXT_PUBLIC_WHATSAPP_VALIDATED !== "false",
};

export const whatsappMessages = {
  receipt: `Olá! Realizei o pagamento do ingresso para o ${event.name} e gostaria de enviar meu comprovante para confirmação.`,
  support: `Olá! Tenho uma dúvida sobre o ${event.name}.`,
};

export interface TicketRequest {
  fullName: string;
  email: string;
  /** Aluno(a) da Emes que o convidado vai assistir. */
  studentName: string;
  /** Nome completo de cada pessoa que vai assistir (um por ingresso). */
  guests?: string[];
  quantity: number;
}

/**
 * Mensagem enviada junto com o comprovante: traz os dados que a equipe usa
 * para emitir o ingresso na Sympla.
 */
export function buildTicketRequestMessage(
  data: TicketRequest,
  unitPriceCents: number = event.ticket.priceCents,
): string {
  const total = ((unitPriceCents * data.quantity) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return [
    whatsappMessages.receipt,
    "",
    `*Nome completo:* ${data.fullName.trim().replace(/\s+/g, " ")}`,
    `*E-mail para receber o ingresso (Sympla):* ${data.email.trim().toLowerCase()}`,
    `*Nome do aluno(a):* ${data.studentName.trim().replace(/\s+/g, " ")}`,
    `*Quantidade de ingressos:* ${data.quantity}`,
    ...(data.guests && data.guests.length
      ? [
          "*Convidados:*",
          ...data.guests.map((g, i) => `${i + 1}. ${g.trim().replace(/\s+/g, " ")}`),
        ]
      : []),
    `*Valor pago:* ${total.replace(/\u00a0/g, " ")}`,
    "",
    "Segue o comprovante em anexo.",
  ].join("\n");
}

export const whatsappLinks = {
  receipt: resolveWhatsAppUrl(whatsappConfig, whatsappMessages.receipt),
  support: resolveWhatsAppUrl(whatsappConfig, whatsappMessages.support),
};

/**
 * Meta Pixel. Informe apenas o ID numérico do pixel.
 * Com NEXT_PUBLIC_META_PIXEL_REQUIRE_CONSENT diferente de "false", o pixel
 * só carrega depois que o visitante aceita no aviso de privacidade.
 */
const rawPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
export const metaPixelConfig = {
  id: /^\d{8,20}$/.test(rawPixelId) ? rawPixelId : "",
  requireConsent: process.env.NEXT_PUBLIC_META_PIXEL_REQUIRE_CONSENT !== "false",
};

/**
 * Planilha de controle de vendas (Google Planilhas + Apps Script).
 * Quando configurada, cada envio do formulário vira uma linha na aba Vendas,
 * na ordem de chegada. Passo a passo em docs/planilha-google.md.
 *
 * O token apenas filtra envios aleatórios: ele fica visível no navegador,
 * então não é uma senha.
 */
const rawSalesUrl = process.env.NEXT_PUBLIC_SALES_SHEET_URL ?? "";
export const salesSheetConfig = {
  url: /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(rawSalesUrl) ? rawSalesUrl : "",
  token: process.env.NEXT_PUBLIC_SALES_SHEET_TOKEN ?? "",
};

export const mapsLinks = {
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.venue.mapsQuery)}`,
  embed: `https://www.google.com/maps?q=${encodeURIComponent(event.venue.mapsQuery)}&output=embed`,
};
