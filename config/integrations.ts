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

export const mapsLinks = {
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.venue.mapsQuery)}`,
  embed: `https://www.google.com/maps?q=${encodeURIComponent(event.venue.mapsQuery)}&output=embed`,
};
