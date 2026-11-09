/**
 * Geração de payload PIX "copia e cola" (BR Code) estático.
 *
 * Segue o Manual de Padrões para Iniciação do PIX (Banco Central do Brasil),
 * baseado no padrão EMV® QRCPS-MPM: cada campo é codificado como
 * ID (2 dígitos) + tamanho (2 dígitos) + valor, e o payload termina com o
 * CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF) no campo 63.
 *
 * Este módulo é puro (sem dependências de navegador) para poder ser testado.
 */

export type PixKeyType = "cpf" | "cnpj" | "email" | "phone" | "evp";

export interface PixPayloadInput {
  /** Chave PIX do recebedor (CPF, CNPJ, e-mail, telefone +55 ou chave aleatória). */
  key: string;
  /** Nome do recebedor, como cadastrado no banco (máx. 25 caracteres). */
  merchantName: string;
  /** Cidade do recebedor (máx. 15 caracteres). */
  merchantCity: string;
  /** Valor em centavos. */
  amountCents: number;
  /** Identificador da transação (até 25 caracteres alfanuméricos) ou "***". */
  txid?: string;
}

export class PixConfigError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Configuração PIX inválida: ${issues.join("; ")}`);
    this.name = "PixConfigError";
  }
}

const GUI = "br.gov.bcb.pix";
const MAX_NAME = 25;
const MAX_CITY = 15;
const TXID_PATTERN = /^[A-Za-z0-9]{1,25}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EVP_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const digit = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

export function isValidCnpj(value: string): boolean {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  const digit = (len: number) => {
    const weights =
      len === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = weights.reduce((acc, w, i) => acc + Number(cnpj[i]) * w, 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  return digit(12) === Number(cnpj[12]) && digit(13) === Number(cnpj[13]);
}

/**
 * Identifica o tipo da chave. Telefones precisam do prefixo +55 para não
 * serem confundidos com CPF.
 */
export function detectPixKeyType(rawKey: string): PixKeyType | null {
  const key = rawKey.trim();
  if (!key) return null;
  if (EVP_PATTERN.test(key)) return "evp";
  if (EMAIL_PATTERN.test(key)) return "email";
  if (key.startsWith("+")) {
    return /^\+55\d{10,11}$/.test("+" + onlyDigits(key)) ? "phone" : null;
  }
  if (/^[\d.\-/\s]+$/.test(key)) {
    if (isValidCpf(key)) return "cpf";
    if (isValidCnpj(key)) return "cnpj";
  }
  return null;
}

/** Normaliza a chave para o formato exigido no payload. */
export function normalizePixKey(rawKey: string, type: PixKeyType): string {
  const key = rawKey.trim();
  switch (type) {
    case "cpf":
    case "cnpj":
      return onlyDigits(key);
    case "phone":
      return "+" + onlyDigits(key);
    case "email":
      return key.toLowerCase();
    case "evp":
      return key.toLowerCase();
  }
}

/** Remove acentos e caracteres fora do conjunto aceito pelos bancos. */
export function sanitizePixText(value: string, maxLength: number): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength)
    .trim()
    .toUpperCase();
}

function field(id: string, value: string): string {
  if (value.length > 99) {
    throw new PixConfigError([`O campo ${id} excede 99 caracteres.`]);
  }
  return `${id}${value.length.toString().padStart(2, "0")}${value}`;
}

/** CRC16-CCITT-FALSE (poly 0x1021, init 0xFFFF), em hexadecimal maiúsculo. */
export function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** Lista os problemas de uma configuração PIX. Vazio significa válida. */
export function validatePixInput(input: PixPayloadInput): string[] {
  const issues: string[] = [];
  if (!input.key.trim()) issues.push("Chave PIX não informada.");
  else if (!detectPixKeyType(input.key))
    issues.push(
      "Chave PIX inválida (use CPF, CNPJ, e-mail, telefone com +55 ou chave aleatória).",
    );

  const name = sanitizePixText(input.merchantName, MAX_NAME);
  if (!name) issues.push("Nome do recebedor não informado.");
  const city = sanitizePixText(input.merchantCity, MAX_CITY);
  if (!city) issues.push("Cidade do recebedor não informada.");

  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    issues.push("Valor inválido.");
  }
  const txid = input.txid?.trim() || "***";
  if (txid !== "***" && !TXID_PATTERN.test(txid)) {
    issues.push("Identificador (txid) deve ter até 25 letras ou números, sem espaços.");
  }
  return issues;
}

/** Monta o payload PIX completo, já com CRC. Lança PixConfigError se inválido. */
export function buildPixPayload(input: PixPayloadInput): string {
  const issues = validatePixInput(input);
  if (issues.length) throw new PixConfigError(issues);

  const type = detectPixKeyType(input.key) as PixKeyType;
  const key = normalizePixKey(input.key, type);
  const txid = input.txid?.trim() || "***";

  const merchantAccount = field("00", GUI) + field("01", key);
  const payload =
    field("00", "01") +
    field("26", merchantAccount) +
    field("52", "0000") +
    field("53", "986") +
    field("54", (input.amountCents / 100).toFixed(2)) +
    field("58", "BR") +
    field("59", sanitizePixText(input.merchantName, MAX_NAME)) +
    field("60", sanitizePixText(input.merchantCity, MAX_CITY)) +
    field("62", field("05", txid)) +
    "6304";

  return payload + crc16(payload);
}

/** Lê um payload EMV em pares ID → valor (útil para testes e conferência). */
export function parseEmv(payload: string): Record<string, string> {
  const result: Record<string, string> = {};
  let i = 0;
  while (i < payload.length) {
    const id = payload.slice(i, i + 2);
    const length = Number(payload.slice(i + 2, i + 4));
    if (!/^\d{2}$/.test(id) || Number.isNaN(length)) {
      throw new Error(`Payload malformado na posição ${i}.`);
    }
    result[id] = payload.slice(i + 4, i + 4 + length);
    i += 4 + length;
  }
  return result;
}

/** Confere se o CRC de um payload está correto. */
export function hasValidCrc(payload: string): boolean {
  if (payload.length < 8) return false;
  const body = payload.slice(0, -4);
  return body.endsWith("6304") && crc16(body) === payload.slice(-4);
}

/* -------------------------------------------------------------------------- */
/* Payload oficial fornecido pelo banco                                       */
/* -------------------------------------------------------------------------- */

/** Lê o payload em pares [ID, valor] preservando a ordem original. */
export function parseEmvEntries(payload: string): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  let i = 0;
  while (i < payload.length) {
    const id = payload.slice(i, i + 2);
    const lengthText = payload.slice(i + 2, i + 4);
    if (!/^\d{2}$/.test(id) || !/^\d{2}$/.test(lengthText)) {
      throw new Error(`Payload malformado na posição ${i}.`);
    }
    const length = Number(lengthText);
    const value = payload.slice(i + 4, i + 4 + length);
    if (value.length !== length) throw new Error("Payload truncado.");
    entries.push([id, value]);
    i += 4 + length;
  }
  return entries;
}

/**
 * Confere um payload PIX gerado pelo banco (QR Code oficial do recebedor).
 * Não reinterpreta a chave: apenas garante que o código é íntegro e é PIX.
 */
export function validateProvidedPixPayload(payload: string): string[] {
  const issues: string[] = [];
  const text = payload.trim();
  if (!text) return ["Payload PIX oficial não informado."];
  if (!hasValidCrc(text)) issues.push("O CRC do payload oficial não confere.");
  let fields: Record<string, string>;
  try {
    fields = Object.fromEntries(parseEmvEntries(text));
  } catch {
    return [...issues, "Payload oficial malformado."];
  }
  let account: Record<string, string> = {};
  try {
    account = Object.fromEntries(parseEmvEntries(fields["26"] ?? ""));
  } catch {
    issues.push("Campo 26 (conta PIX) malformado.");
  }
  if ((account["00"] ?? "").toLowerCase() !== GUI) issues.push("O payload não é um PIX (br.gov.bcb.pix).");
  if (!account["01"] && !account["25"]) issues.push("O payload não contém chave PIX.");
  if (fields["53"] !== "986") issues.push("A moeda do payload não é o real (986).");
  if (fields["58"] !== "BR") issues.push("O país do payload não é BR.");
  if (!fields["59"]) issues.push("O payload não contém o nome do recebedor.");
  if (!fields["60"]) issues.push("O payload não contém a cidade do recebedor.");
  return issues;
}

/**
 * Acrescenta (ou substitui) o valor no payload oficial, no campo 54 previsto
 * pelo padrão, e recalcula o CRC. Todos os outros campos ficam intactos.
 */
export function setPixPayloadAmount(payload: string, amountCents: number): string {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new PixConfigError(["Valor inválido."]);
  }
  const entries = parseEmvEntries(payload.trim()).filter(
    ([id]) => id !== "54" && id !== "63",
  );
  entries.push(["54", (amountCents / 100).toFixed(2)]);
  entries.sort(([a], [b]) => Number(a) - Number(b));
  const body = entries.map(([id, value]) => field(id, value)).join("") + "6304";
  return body + crc16(body);
}

export function getPixMerchantName(payload: string): string {
  return Object.fromEntries(parseEmvEntries(payload.trim()))["59"] ?? "";
}
