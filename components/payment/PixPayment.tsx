"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Hourglass, QrCode, ShieldCheck } from "lucide-react";
import { pixState } from "@/config/payment";
import { trackMetaEvent, ticketEventParams } from "@/lib/analytics";
import { formatBRL } from "@/lib/utils";
import { QrCodeSvg } from "./QrCodeSvg";

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* tenta o método alternativo abaixo */
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

function PendingState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-2 py-6 text-center">
      <span className="relative inline-flex size-20 items-center justify-center rounded-full border border-ouro/30 bg-ouro/5">
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-ouro/20 motion-reduce:hidden" />
        <Hourglass aria-hidden className="size-8 text-ouro" />
      </span>
      <h3 className="mt-6 font-display text-2xl font-semibold text-creme sm:text-3xl">
        Pagamento em configuração
      </h3>
      <p className="mt-3 max-w-sm leading-relaxed text-nevoa">
        Estamos preparando os bastidores. Em breve, o QR Code PIX oficial da Emes estará
        disponível aqui para você garantir o seu ingresso.
      </p>
      <p className="mt-4 max-w-sm rounded-2xl border border-rosa/25 bg-rosa/5 px-4 py-3 text-sm text-rosa-claro">
        Por segurança, não realize pagamentos para chaves recebidas por outros canais sem
        confirmar com a equipe da Emes.
      </p>
      {process.env.NODE_ENV !== "production" && pixState.status === "pending" && (
        <details className="mt-6 w-full max-w-sm rounded-xl border border-white/10 bg-black/20 p-4 text-left text-xs text-nevoa-2">
          <summary className="cursor-pointer font-semibold text-nevoa">
            Pendências (visível só em desenvolvimento)
          </summary>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {pixState.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

export function PixPayment() {
  const [copied, setCopied] = useState<"idle" | "ok" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  if (pixState.status !== "ready") return <PendingState />;

  const { payload, merchantName, amountCents } = pixState;

  const handleCopy = async () => {
    const ok = await copyText(payload);
    setCopied(ok ? "ok" : "error");
    if (ok) trackMetaEvent("InitiateCheckout", ticketEventParams, { once: true });
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied("idle"), 3500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-verde/15 text-verde-claro">
          <QrCode aria-hidden className="size-5" />
        </span>
        <div>
          <h3 className="font-display text-2xl font-semibold text-creme">Pagamento via PIX</h3>
          <p className="text-sm text-nevoa">
            Valor: <strong className="text-ouro">{formatBRL(amountCents)}</strong> — 1 ingresso
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[260px] rounded-2xl bg-white p-3 shadow-[0_0_60px_-10px_rgb(248_217_139/0.5)]">
        <QrCodeSvg value={payload} label={`QR Code PIX de ${formatBRL(amountCents)} para ${merchantName}`} />
      </div>

      <div>
        <label htmlFor="pix-copia-e-cola" className="mb-2 block text-xs font-semibold tracking-[0.2em] text-ouro uppercase">
          PIX copia e cola
        </label>
        <textarea
          id="pix-copia-e-cola"
          readOnly
          rows={3}
          value={payload}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 font-mono text-xs leading-relaxed break-all text-nevoa focus:border-ouro/50"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="cta-primary mt-3 w-full"
          aria-describedby="pix-copy-status"
        >
          {copied === "ok" ? (
            <Check aria-hidden className="size-5" />
          ) : (
            <Copy aria-hidden className="size-5" />
          )}
          {copied === "ok" ? "Código copiado!" : "Copiar código PIX"}
        </button>
        <p id="pix-copy-status" role="status" className="mt-2 min-h-5 text-center text-sm">
          {copied === "ok" && (
            <span className="text-verde-claro">Pronto! Agora cole o código no app do seu banco.</span>
          )}
          {copied === "error" && (
            <span className="text-rosa-claro">
              Não foi possível copiar automaticamente. Selecione o código acima e copie manualmente.
            </span>
          )}
        </p>
      </div>

      <ol className="space-y-3 text-sm text-nevoa">
        {[
          "Abra o aplicativo do seu banco e escolha pagar com PIX.",
          "Escaneie o QR Code ou cole o código copia e cola.",
          <>
            Confira o valor de <strong className="text-creme">{formatBRL(amountCents)}</strong> e o
            recebedor <strong className="text-creme">{merchantName}</strong> antes de confirmar.
          </>,
          "Guarde o comprovante e envie pelo WhatsApp para a equipe da Emes.",
        ].map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-ouro/40 text-xs font-semibold text-ouro">
              {i + 1}
            </span>
            <span className="leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>

      <p className="flex items-start gap-2 rounded-xl bg-white/5 p-3 text-xs leading-relaxed text-nevoa-2">
        <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-verde-claro" />
        O ingresso é confirmado somente após a conferência do comprovante pela equipe da Emes.
      </p>
    </div>
  );
}
