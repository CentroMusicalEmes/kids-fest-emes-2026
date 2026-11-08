export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata centavos como moeda brasileira, ex.: 2000 → "R$ 20,00". */
export function formatBRL(cents: number): string {
  // Intl usa espaço não separável; normalizamos para evitar diferenças.
  return brl.format(cents / 100).replace(/ /g, " ");
}

export const onlyDigits = (value: string) => value.replace(/\D/g, "");
