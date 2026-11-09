import { describe, expect, it } from "vitest";
import { buildTicketRequestMessage } from "@/config/integrations";
import { isValidEmail, isValidFullName } from "@/lib/validation";

describe("buildTicketRequestMessage", () => {
  it("inclui nome, e-mail, quantidade e total", () => {
    const msg = buildTicketRequestMessage({
      fullName: "  Maria   da Silva ",
      email: " Maria@Exemplo.com ",
      studentName: " Pedro  Silva ",
      quantity: 3,
    });
    expect(msg).toContain("Realizei o pagamento do ingresso para o Kids Fest Emes 2026");
    expect(msg).toContain("*Nome completo:* Maria da Silva");
    expect(msg).toContain("*E-mail para receber o ingresso (Sympla):* maria@exemplo.com");
    expect(msg).toContain("*Nome do aluno(a):* Pedro Silva");
    expect(msg).toContain("*Quantidade de ingressos:* 3");
    expect(msg).toContain("*Valor pago:* R$ 60,00");
  });

  it("lista os convidados, um por ingresso", () => {
    const msg = buildTicketRequestMessage({
      fullName: "Maria da Silva",
      email: "maria@exemplo.com",
      studentName: "Pedro Silva",
      quantity: 3,
      guests: ["Maria da Silva", " João  Silva ", "Ana Silva"],
    });
    expect(msg).toContain("*Convidados:*\n1. Maria da Silva\n2. João Silva\n3. Ana Silva");
  });
});

describe("validação do formulário", () => {
  it("exige nome e sobrenome", () => {
    expect(isValidFullName("Maria da Silva")).toBe(true);
    expect(isValidFullName("Ana Lu")).toBe(true);
    expect(isValidFullName("Maria")).toBe(false);
    expect(isValidFullName("  ")).toBe(false);
  });

  it("valida e-mail", () => {
    expect(isValidEmail("maria@exemplo.com.br")).toBe(true);
    expect(isValidEmail("maria@exemplo")).toBe(false);
    expect(isValidEmail("maria exemplo.com")).toBe(false);
  });
});
