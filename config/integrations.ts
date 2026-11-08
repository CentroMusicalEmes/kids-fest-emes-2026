import { event } from "./event";
import { resolveWhatsAppUrl } from "@/lib/whatsapp";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

/**
 * WhatsApp.
 *
 * O número informado pela Emes, (31) 2555-3273, tem formato de telefone fixo.
 * Ele pode funcionar com WhatsApp Business, mas isso precisa ser testado.
 * Os links só são ativados com NEXT_PUBLIC_WHATSAPP_VALIDATED=true.
 */
export const whatsappConfig = {
  number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "553125553273",
  validated: process.env.NEXT_PUBLIC_WHATSAPP_VALIDATED === "true",
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
