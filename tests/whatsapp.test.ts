import { describe, expect, it } from "vitest";
import {
  buildWhatsAppUrl,
  isValidBrazilianWhatsAppNumber,
  resolveWhatsAppUrl,
} from "@/lib/whatsapp";
import { formatBRL } from "@/lib/utils";

describe("WhatsApp", () => {
  it("valida o formato internacional brasileiro", () => {
    expect(isValidBrazilianWhatsAppNumber("553125553273")).toBe(true);
    expect(isValidBrazilianWhatsAppNumber("5531999990000")).toBe(true);
    expect(isValidBrazilianWhatsAppNumber("3125553273")).toBe(false);
  });

  it("monta link com mensagem codificada", () => {
    expect(buildWhatsAppUrl("55 31 2555-3273", "Olá! Tudo bem?")).toBe(
      "https://wa.me/553125553273?text=Ol%C3%A1!%20Tudo%20bem%3F",
    );
  });

  it("não gera link sem validação manual", () => {
    expect(resolveWhatsAppUrl({ number: "553125553273", validated: false })).toBeNull();
    expect(resolveWhatsAppUrl({ number: "123", validated: true })).toBeNull();
    expect(resolveWhatsAppUrl({ number: "553125553273", validated: true })).toBe(
      "https://wa.me/553125553273",
    );
  });
});

describe("formatBRL", () => {
  it("formata o ingresso", () => {
    expect(formatBRL(2000)).toBe("R$ 20,00");
  });
});
