import { event } from "./event";
import {
  buildPixPayload,
  getPixMerchantName,
  sanitizePixText,
  setPixPayloadAmount,
  validatePixInput,
  validateProvidedPixPayload,
} from "@/lib/pix";

/**
 * Configuração do recebimento PIX.
 *
 * Há duas formas de configurar, nesta ordem de prioridade:
 *
 *  A) Payload oficial do banco (recomendado): o código "copia e cola" do QR
 *     Code que o banco da Emes gerou. O site usa o código como está e só
 *     acrescenta o valor de R$ 20,00 (campo 54 do padrão BR Code).
 *
 *  B) Chave, nome e cidade: o site monta o payload a partir desses dados.
 *
 * Em qualquer caso, o PIX só aparece no site quando `validated` for true —
 * ou seja, depois de um pagamento de teste lido a partir do próprio site
 * ter caído na conta certa. Nada aqui é segredo; nunca coloque tokens de
 * bancos ou provedores em variáveis NEXT_PUBLIC_*.
 */

/**
 * QR Code oficial de recebimento enviado pela Emes em 09/11/2026
 * (recebedor: Centro Musical Emes, Belo Horizonte; sem valor fixo).
 */
export const OFFICIAL_PIX_PAYLOAD =
  "00020126820014BR.GOV.BCB.PIX016069b8545b-093c566d 854e0efa-6d36297e 82996ca4-a51234c8 fd99175204000053039865802BR5919Centro Musical Emes6014Belo Horizonte62070503***63043383";

/**
 * Mude para true SOMENTE depois que a equipe pagar R$ 20,00 lendo o QR Code
 * exibido no próprio site e confirmar o crédito na conta da Emes.
 * A variável NEXT_PUBLIC_PIX_VALIDATED=true também ativa.
 */
const TEST_PAYMENT_CONFIRMED = false;

export interface PixSettings {
  /** Payload oficial do banco. Quando preenchido, tem prioridade. */
  payload: string;
  key: string;
  merchantName: string;
  merchantCity: string;
  txid: string;
  amountCents: number;
  validated: boolean;
}

export const pixSettings: PixSettings = {
  payload: process.env.NEXT_PUBLIC_PIX_PAYLOAD || OFFICIAL_PIX_PAYLOAD,
  key: process.env.NEXT_PUBLIC_PIX_KEY ?? "",
  merchantName: process.env.NEXT_PUBLIC_PIX_MERCHANT_NAME ?? "",
  merchantCity: process.env.NEXT_PUBLIC_PIX_MERCHANT_CITY ?? "",
  txid: process.env.NEXT_PUBLIC_PIX_TXID || "***",
  amountCents: event.ticket.priceCents,
  validated: TEST_PAYMENT_CONFIRMED || process.env.NEXT_PUBLIC_PIX_VALIDATED === "true",
};

export type PixState =
  | { status: "ready"; payload: string; merchantName: string; amountCents: number }
  | { status: "pending"; issues: string[] };

const NOT_VALIDATED =
  "Aguardando pagamento de teste: mude TEST_PAYMENT_CONFIRMED para true em config/payment.ts (ou NEXT_PUBLIC_PIX_VALIDATED=true).";

export function resolvePixState(settings: PixSettings): PixState {
  if (settings.payload.trim()) {
    const issues = validateProvidedPixPayload(settings.payload);
    if (!settings.validated) issues.push(NOT_VALIDATED);
    if (issues.length) return { status: "pending", issues };
    return {
      status: "ready",
      payload: setPixPayloadAmount(settings.payload, settings.amountCents),
      merchantName: getPixMerchantName(settings.payload),
      amountCents: settings.amountCents,
    };
  }

  const issues = validatePixInput(settings);
  if (!settings.validated) issues.push(NOT_VALIDATED);
  if (issues.length) return { status: "pending", issues };
  return {
    status: "ready",
    payload: buildPixPayload(settings),
    merchantName: sanitizePixText(settings.merchantName, 25),
    amountCents: settings.amountCents,
  };
}

export const pixState = resolvePixState(pixSettings);
