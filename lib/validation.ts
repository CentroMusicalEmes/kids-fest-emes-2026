/** Nome completo: ao menos duas palavras com 2+ letras. */
export function isValidFullName(value: string): boolean {
  const parts = value.trim().split(/\s+/).filter((p) => p.replace(/[^\p{L}]/gu, "").length >= 2);
  return parts.length >= 2 && value.trim().length <= 120;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) && value.trim().length <= 254;
}
