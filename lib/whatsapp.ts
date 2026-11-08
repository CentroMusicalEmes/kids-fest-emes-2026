import { onlyDigits } from "./utils";

/** Número brasileiro no formato internacional, só dígitos: 55 + DDD + número. */
export function isValidBrazilianWhatsAppNumber(number: string): boolean {
  return /^55[1-9]{2}\d{8,9}$/.test(onlyDigits(number));
}

export function buildWhatsAppUrl(number: string, message?: string): string {
  const base = `https://wa.me/${onlyDigits(number)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Retorna o link apenas quando o número foi validado manualmente pela equipe
 * (flag `validated`) e tem formato correto. Caso contrário, retorna null e a
 * interface mostra o estado "em validação".
 */
export function resolveWhatsAppUrl(
  config: { number: string; validated: boolean },
  message?: string,
): string | null {
  if (!config.validated || !isValidBrazilianWhatsAppNumber(config.number)) {
    return null;
  }
  return buildWhatsAppUrl(config.number, message);
}
