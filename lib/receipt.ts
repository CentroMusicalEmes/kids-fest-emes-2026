/**
 * Regras do comprovante de pagamento enviado pelo formulário.
 * Valem no navegador e são repetidas no Apps Script (servidor).
 */

export const RECEIPT_MAX_BYTES = 8 * 1024 * 1024; // 8 MB antes da compressão

export const RECEIPT_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
  "application/pdf": "pdf",
};

export const RECEIPT_ACCEPT = Object.keys(RECEIPT_TYPES).join(",");

/** Retorna a mensagem de erro, ou null se o arquivo é aceito. */
export function validateReceiptFile(file: { type: string; size: number } | null | undefined): string | null {
  if (!file || file.size === 0) return "Anexe o comprovante do PIX (foto, print ou PDF).";
  if (!RECEIPT_TYPES[file.type]) return "Formato não aceito. Envie uma imagem (JPG, PNG) ou PDF.";
  if (file.size > RECEIPT_MAX_BYTES) return "Arquivo muito grande. Envie um arquivo de até 8 MB.";
  return null;
}

export interface EncodedReceipt {
  name: string;
  type: string;
  base64: string;
}

/** Converte o arquivo para base64 (sem o prefixo data:). */
export async function fileToBase64(file: Blob): Promise<string> {
  const buffer = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < buffer.length; i += chunk) {
    binary += String.fromCharCode(...buffer.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/**
 * Prepara o comprovante para envio. Imagens grandes são reduzidas para no
 * máximo 1800 px em JPEG (fica legível e bem mais leve). PDFs e formatos que
 * o navegador não consegue abrir (ex.: HEIC no computador) vão como estão.
 */
export async function prepareReceipt(file: File): Promise<EncodedReceipt> {
  const isImage = file.type.startsWith("image/") && file.type !== "image/heic" && file.type !== "image/heif";
  if (isImage && typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
      if (scale < 1 || file.size > 1.5 * 1024 * 1024) {
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.85),
        );
        if (blob) {
          return {
            name: file.name.replace(/\.[^.]+$/, "") + ".jpg",
            type: "image/jpeg",
            base64: await fileToBase64(blob),
          };
        }
      }
    } catch {
      /* envia o original */
    }
  }
  return { name: file.name, type: file.type, base64: await fileToBase64(file) };
}
