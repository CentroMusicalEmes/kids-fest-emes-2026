/**
 * Eventos do Meta Pixel.
 *
 * - Eventos só são enviados se o pixel foi carregado (ID configurado e,
 *   quando exigido, consentimento do visitante).
 * - `once` evita duplicidade dentro da mesma visita.
 * - `Purchase` NÃO é disparado pela página: clicar no PIX ou copiar o código
 *   não significa pagamento confirmado. Use `trackConfirmedPurchase` apenas
 *   em um fluxo futuro em que a equipe confirme o pagamento de fato.
 */

export type MetaStandardEvent = "PageView" | "ViewContent" | "InitiateCheckout" | "Contact";

type Fbq = (command: "track" | "init" | "consent", ...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

const sent = new Set<string>();

export function trackMetaEvent(
  name: MetaStandardEvent,
  params?: Record<string, string | number>,
  options: { once?: boolean } = {},
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  const key = `${name}:${JSON.stringify(params ?? {})}`;
  if (options.once && sent.has(key)) return;
  sent.add(key);
  window.fbq("track", name, params);
}

/** Use somente após confirmação real do pagamento pela equipe. */
export function trackConfirmedPurchase(valueBRL: number): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", "Purchase", { value: valueBRL, currency: "BRL" });
}

export const ticketEventParams = {
  content_name: "Kids Fest Emes 2026 - Ingresso único",
  content_category: "Ingresso",
  value: 20,
  currency: "BRL",
} as const;
