import { describe, expect, it } from "vitest";
import {
  buildPixPayload,
  crc16,
  detectPixKeyType,
  hasValidCrc,
  parseEmv,
  PixConfigError,
  sanitizePixText,
  validatePixInput,
} from "@/lib/pix";
import { resolvePixState } from "@/config/payment";

// Dados de TESTE apenas (CPF gerado para testes, válido pelos dígitos verificadores).
const TEST_CPF = "529.982.247-25";
const TEST_EVP = "123e4567-e12b-12d1-a456-426655440000";

describe("crc16", () => {
  it("calcula o CRC16-CCITT-FALSE de referência", () => {
    expect(crc16("123456789")).toBe("29B1");
  });

  it("confere o exemplo do manual do Banco Central", () => {
    const example =
      "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D";
    expect(hasValidCrc(example)).toBe(true);
  });
});

describe("detectPixKeyType", () => {
  it.each([
    [TEST_CPF, "cpf"],
    ["11.222.333/0001-81", "cnpj"],
    ["financeiro@exemplo.com.br", "email"],
    ["+55 (31) 99999-0000", "phone"],
    [TEST_EVP, "evp"],
  ])("%s → %s", (key, type) => {
    expect(detectPixKeyType(key)).toBe(type);
  });

  it.each(["", "123", "111.111.111-11", "31999990000", "+1 555 0100", "abc"])(
    "rejeita %s",
    (key) => {
      expect(detectPixKeyType(key)).toBeNull();
    },
  );
});

describe("sanitizePixText", () => {
  it("remove acentos, símbolos e respeita o limite", () => {
    expect(sanitizePixText("Escola de Música São João & Cia", 25)).toBe(
      "ESCOLA DE MUSICA SAO JOAO",
    );
    expect(sanitizePixText("Belo Horizonte", 15)).toBe("BELO HORIZONTE");
  });
});

describe("buildPixPayload", () => {
  const input = {
    key: TEST_EVP,
    merchantName: "Fulano de Tal",
    merchantCity: "Belo Horizonte",
    amountCents: 2000,
  };

  it("gera um payload com estrutura e CRC válidos", () => {
    const payload = buildPixPayload(input);
    expect(hasValidCrc(payload)).toBe(true);

    const fields = parseEmv(payload);
    expect(fields["00"]).toBe("01");
    expect(fields["52"]).toBe("0000");
    expect(fields["53"]).toBe("986");
    expect(fields["54"]).toBe("20.00");
    expect(fields["58"]).toBe("BR");
    expect(fields["59"]).toBe("FULANO DE TAL");
    expect(fields["60"]).toBe("BELO HORIZONTE");

    const account = parseEmv(fields["26"]);
    expect(account["00"]).toBe("br.gov.bcb.pix");
    expect(account["01"]).toBe(TEST_EVP);
    expect(parseEmv(fields["62"])["05"]).toBe("***");
  });

  it("normaliza CPF e aceita txid", () => {
    const payload = buildPixPayload({ ...input, key: TEST_CPF, txid: "KIDSFEST2026" });
    const fields = parseEmv(payload);
    expect(parseEmv(fields["26"])["01"]).toBe("52998224725");
    expect(parseEmv(fields["62"])["05"]).toBe("KIDSFEST2026");
    expect(hasValidCrc(payload)).toBe(true);
  });

  it("reproduz o exemplo do manual do Banco Central", () => {
    // O exemplo oficial não tem valor; validamos a mesma montagem manualmente.
    const body =
      "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***6304";
    expect(crc16(body)).toBe("1D3D");
  });

  it("recusa configuração incompleta", () => {
    expect(() => buildPixPayload({ ...input, key: "" })).toThrow(PixConfigError);
    expect(validatePixInput({ ...input, merchantName: "" })).toContain(
      "Nome do recebedor não informado.",
    );
    expect(validatePixInput({ ...input, txid: "com espaço" })).toHaveLength(1);
    expect(validatePixInput({ ...input, amountCents: 0 })).toContain("Valor inválido.");
  });
});

describe("resolvePixState", () => {
  const base = {
    key: TEST_EVP,
    merchantName: "Fulano de Tal",
    merchantCity: "Belo Horizonte",
    txid: "***",
    amountCents: 2000,
    validated: true,
  };

  it("fica pendente sem dados (nenhum QR fictício)", () => {
    const state = resolvePixState({ ...base, key: "", merchantName: "", merchantCity: "" });
    expect(state.status).toBe("pending");
  });

  it("fica pendente sem a confirmação manual", () => {
    expect(resolvePixState({ ...base, validated: false }).status).toBe("pending");
  });

  it("fica pronto com dados válidos e validados", () => {
    const state = resolvePixState(base);
    expect(state.status).toBe("ready");
    if (state.status === "ready") expect(hasValidCrc(state.payload)).toBe(true);
  });
});
