import { event } from "./event";
import { buildPixPayload, sanitizePixText, validatePixInput } from "@/lib/pix";

/**
 * Configuração do recebimento PIX.
 *
 * Os valores vêm de variáveis de ambiente públicas (NEXT_PUBLIC_*), porque a
 * chave PIX de recebimento precisa estar no navegador para gerar o QR Code.
 * Uma chave PIX não é segredo, mas NUNCA coloque tokens de bancos ou
 * provedores de pagamento em variáveis NEXT_PUBLIC_*.
 *
 * O PIX só é exibido quando:
 *  1. chave, nome e cidade estão preenchidos e são válidos; e
 *  2. NEXT_PUBLIC_PIX_VALIDATED=true — a equipe fez um pagamento de teste e
 *     confirmou que o valor caiu na conta certa.
 */
export interface PixSettings {
  key: string;
  merchantName: string;
  merchantCity: string;
  txid: string;
  amountCents: number;
  validated: boolean;
}

export const pixSettings: PixSettings = {
  key: process.env.NEXT_PUBLIC_PIX_KEY ?? "",
  merchantName: process.env.NEXT_PUBLIC_PIX_MERCHANT_NAME ?? "",
  merchantCity: process.env.NEXT_PUBLIC_PIX_MERCHANT_CITY ?? "",
  txid: process.env.NEXT_PUBLIC_PIX_TXID || "***",
  amountCents: event.ticket.priceCents,
  validated: process.env.NEXT_PUBLIC_PIX_VALIDATED === "true",
};

export type PixState =
  | { status: "ready"; payload: string; merchantName: string; amountCents: number }
  | { status: "pending"; issues: string[] };

export function resolvePixState(settings: PixSettings): PixState {
  const issues = validatePixInput(settings);
  if (!settings.validated) {
    issues.push(
      "Defina NEXT_PUBLIC_PIX_VALIDATED=true após confirmar um pagamento de teste.",
    );
  }
  if (issues.length) return { status: "pending", issues };
  return {
    status: "ready",
    payload: buildPixPayload(settings),
    merchantName: sanitizePixText(settings.merchantName, 25),
    amountCents: settings.amountCents,
  };
}

export const pixState = resolvePixState(pixSettings);
