import { describe, expect, it } from "vitest";
import { fileToBase64, RECEIPT_MAX_BYTES, validateReceiptFile } from "@/lib/receipt";

describe("validateReceiptFile", () => {
  it("exige o arquivo", () => {
    expect(validateReceiptFile(null)).toMatch(/Anexe o comprovante/);
    expect(validateReceiptFile({ type: "image/png", size: 0 })).toMatch(/Anexe o comprovante/);
  });

  it("aceita imagens e PDF", () => {
    expect(validateReceiptFile({ type: "image/jpeg", size: 1000 })).toBeNull();
    expect(validateReceiptFile({ type: "image/png", size: 1000 })).toBeNull();
    expect(validateReceiptFile({ type: "application/pdf", size: 1000 })).toBeNull();
  });

  it("recusa outros formatos e arquivos grandes", () => {
    expect(validateReceiptFile({ type: "text/plain", size: 10 })).toMatch(/Formato/);
    expect(validateReceiptFile({ type: "image/jpeg", size: RECEIPT_MAX_BYTES + 1 })).toMatch(/grande/);
  });
});

describe("fileToBase64", () => {
  it("codifica o conteúdo", async () => {
    const blob = new Blob(["Olá, PIX!"]);
    expect(await fileToBase64(blob)).toBe(Buffer.from("Olá, PIX!").toString("base64"));
  });
});
