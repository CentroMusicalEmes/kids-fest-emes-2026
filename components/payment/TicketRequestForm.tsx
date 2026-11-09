"use client";

import { useId, useRef, useState } from "react";
import { CircleCheck, FileText, Loader2, Paperclip, Phone, RotateCcw } from "lucide-react";
import { event } from "@/config/event";
import { MAX_TICKETS_PER_PURCHASE } from "@/config/payment";
import { buildTicketRequestMessage, salesSheetConfig, whatsappConfig } from "@/config/integrations";
import { trackMetaEvent } from "@/lib/analytics";
import { prepareReceipt, RECEIPT_ACCEPT, validateReceiptFile } from "@/lib/receipt";
import { formatBRL } from "@/lib/utils";
import { isValidEmail, isValidFullName } from "@/lib/validation";
import { resolveWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type Field = "fullName" | "email" | "studentName" | "quantity" | "receipt" | "consent" | `guest-${number}`;
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "done" | "error";

interface RequestData {
  fullName: string;
  email: string;
  studentName: string;
  quantity: number;
  guests: string[];
}

const inputClass =
  "w-full rounded-xl border bg-black/25 px-4 py-3.5 text-base text-creme placeholder:text-nevoa-2/70 transition focus:border-ouro/70 focus:bg-black/35 focus:outline-none aria-[invalid=true]:border-rosa/70";

/**
 * Envia dados + comprovante para o Apps Script, que salva o arquivo no Drive
 * da Emes e grava o pedido na planilha. Só considera sucesso quando a
 * resposta confirma que o comprovante foi salvo.
 */
async function submitToSheet(data: RequestData, file: File): Promise<boolean> {
  const receipt = await prepareReceipt(file);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60_000);
  try {
    const res = await fetch(salesSheetConfig.url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...data, token: salesSheetConfig.token, receipt }),
      signal: controller.signal,
    });
    const json = (await res.json()) as { ok?: boolean; receiptUrl?: string };
    return json.ok === true && typeof json.receiptUrl === "string" && json.receiptUrl.length > 0;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Dados do convidado para a emissão do ingresso na Sympla, com o
 * comprovante do PIX obrigatório.
 */
export function TicketRequestForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [quantity, setQuantity] = useState(1);
  const [guests, setGuests] = useState<string[]>([""]);

  const changeQuantity = (value: number) => {
    setQuantity(value);
    if (value >= 1 && value <= MAX_TICKETS_PER_PURCHASE) {
      setGuests((prev) => Array.from({ length: value }, (_, i) => prev[i] ?? ""));
    }
  };

  const setGuest = (index: number, value: string) =>
    setGuests((prev) => prev.map((g, i) => (i === index ? value : g)));
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [lastData, setLastData] = useState<RequestData | null>(null);

  const sheetEnabled = salesSheetConfig.url !== "";
  const whatsappEnabled = resolveWhatsAppUrl(whatsappConfig) !== null;

  const fieldId = (name: Field) => `${id}-${name}`;
  const errorId = (name: Field) => `${id}-${name}-erro`;

  const openWhatsApp = (data: RequestData) => {
    const url = resolveWhatsAppUrl(whatsappConfig, buildTicketRequestMessage(data));
    if (!url) return;
    trackMetaEvent("Contact", { content_name: "receipt" }, { once: true });
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.assign(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = new FormData(e.currentTarget);
    const data: RequestData = {
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      studentName: String(form.get("studentName") ?? ""),
      quantity,
      guests: guests.slice(0, quantity).map((g) => g.trim().replace(/\s+/g, " ")),
    };
    const consent = form.get("consent") === "on";

    const next: Errors = {};
    if (!isValidFullName(data.fullName)) next.fullName = "Informe seu nome e sobrenome.";
    if (!isValidEmail(data.email)) next.email = "Informe um e-mail válido: o ingresso será enviado para ele.";
    if (!isValidFullName(data.studentName)) next.studentName = "Informe o nome e sobrenome do aluno(a).";
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_TICKETS_PER_PURCHASE) {
      next.quantity = `Escolha entre 1 e ${MAX_TICKETS_PER_PURCHASE} ingressos.`;
    } else {
      data.guests.forEach((g, i) => {
        if (!isValidFullName(g)) next[`guest-${i}`] = `Informe nome e sobrenome do convidado ${i + 1}.`;
      });
    }
    if (sheetEnabled) {
      const receiptError = validateReceiptFile(file);
      if (receiptError) next.receipt = receiptError;
    }
    if (!consent) next.consent = "É preciso autorizar o uso dos dados para emitir o ingresso.";
    setErrors(next);

    const firstInvalid = (Object.keys(next) as Field[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(firstInvalid))}`)?.focus();
      return;
    }

    setLastData(data);

    // Sem planilha configurada: fluxo antigo, pelo WhatsApp.
    if (!sheetEnabled || !file) {
      openWhatsApp(data);
      setStatus("done");
      return;
    }

    setStatus("sending");
    const ok = await submitToSheet(data, file);
    setStatus(ok ? "done" : "error");
    if (ok) trackMetaEvent("Contact", { content_name: "receipt_upload" }, { once: true });
  };

  const describe = (name: Field, hint?: string) =>
    [hint, errors[name] ? errorId(name) : undefined].filter(Boolean).join(" ") || undefined;

  const errorText = (name: Field) =>
    errors[name] ? (
      <p id={errorId(name)} className="mt-1.5 text-sm text-rosa-claro">
        {errors[name]}
      </p>
    ) : null;

  const labelClass = "mb-1.5 block text-sm font-medium text-creme";

  /* ------------------------------ Confirmação ----------------------------- */
  if (status === "done" && lastData) {
    return (
      <div role="status" className="mx-auto mt-8 max-w-xl rounded-3xl border border-verde/40 bg-verde/10 p-7 text-center">
        <CircleCheck aria-hidden className="mx-auto size-12 text-verde-claro" />
        <h4 className="mt-4 font-display text-2xl font-semibold text-creme">
          {sheetEnabled ? "Pedido e comprovante recebidos!" : "Abrimos o WhatsApp com seus dados"}
        </h4>
        <p className="mt-3 leading-relaxed text-nevoa">
          {sheetEnabled ? (
            <>
              Obrigado, <strong className="text-creme">{lastData.fullName.split(" ")[0]}</strong>! Após a
              conferência do pagamento, você receberá{" "}
              {lastData.quantity > 1 ? `seus ${lastData.quantity} ingressos` : "seu ingresso"} pela{" "}
              <strong className="text-creme">Sympla</strong> no e-mail{" "}
              <strong className="break-all text-creme">{lastData.email.trim().toLowerCase()}</strong>.
            </>
          ) : (
            "Anexe o comprovante do PIX na conversa e envie a mensagem."
          )}
        </p>
        {sheetEnabled && whatsappEnabled && (
          <p className="mt-5 text-sm text-nevoa-2">
            Dúvidas?{" "}
            <a
              href={resolveWhatsAppUrl(whatsappConfig, buildTicketRequestMessage(lastData).split("\n")[0]) ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ouro underline-offset-4 hover:underline"
            >
              Fale com a Emes no WhatsApp
            </a>
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setFile(null);
            setQuantity(1);
            setGuests([""]);
            formRef.current?.reset();
          }}
          className="btn-ghost mt-6"
        >
          <RotateCcw aria-hidden className="size-4" />
          Enviar outro pedido
        </button>
      </div>
    );
  }

  /* ------------------------------ Formulário ------------------------------ */
  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Dados para emissão do ingresso"
      aria-busy={status === "sending"}
      className="mx-auto mt-8 grid max-w-xl gap-5 text-left"
    >
      <div>
        <label htmlFor={fieldId("fullName")} className={labelClass}>
          Seu nome completo
        </label>
        <input
          id={fieldId("fullName")}
          name="fullName"
          type="text"
          autoComplete="name"
          required
          maxLength={120}
          placeholder="Ex.: Maria da Silva Souza"
          aria-invalid={!!errors.fullName}
          aria-describedby={describe("fullName")}
          className={inputClass + " border-white/15"}
        />
        {errorText("fullName")}
      </div>

      <div>
        <label htmlFor={fieldId("email")} className={labelClass}>
          E-mail para receber o ingresso
        </label>
        <input
          id={fieldId("email")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          maxLength={254}
          placeholder="seuemail@exemplo.com"
          aria-invalid={!!errors.email}
          aria-describedby={describe("email", `${id}-email-dica`)}
          className={inputClass + " border-white/15"}
        />
        <p id={`${id}-email-dica`} className="mt-1.5 text-xs text-nevoa-2">
          O ingresso será enviado pela Sympla para este e-mail. Confira se está correto.
        </p>
        {errorText("email")}
      </div>

      <div>
        <label htmlFor={fieldId("studentName")} className={labelClass}>
          Nome do aluno(a) que você vai assistir
        </label>
        <input
          id={fieldId("studentName")}
          name="studentName"
          type="text"
          autoComplete="off"
          required
          maxLength={120}
          placeholder="Ex.: Pedro Souza"
          aria-invalid={!!errors.studentName}
          aria-describedby={describe("studentName")}
          className={inputClass + " border-white/15"}
        />
        {errorText("studentName")}
      </div>

      <div>
        <label htmlFor={fieldId("quantity")} className={labelClass}>
          Quantidade de ingressos pagos
        </label>
        <div className="flex items-center gap-4">
          <input
            id={fieldId("quantity")}
            name="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_TICKETS_PER_PURCHASE}
            value={quantity}
            onChange={(e) => changeQuantity(Math.trunc(Number(e.target.value)) || 0)}
            aria-invalid={!!errors.quantity}
            aria-describedby={describe("quantity", `${id}-qtd-total`)}
            className={inputClass.replace("w-full", "w-24") + " shrink-0 border-white/15 text-center"}
          />
          <p id={`${id}-qtd-total`} className="text-sm text-nevoa">
            Total pago:{" "}
            <strong className="font-display text-xl text-ouro">
              {formatBRL(event.ticket.priceCents * Math.max(0, quantity))}
            </strong>
          </p>
        </div>
        {errorText("quantity")}
      </div>

      {quantity >= 1 && quantity <= MAX_TICKETS_PER_PURCHASE && (
        <fieldset className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <legend className="px-2 text-sm font-medium text-creme">
            {quantity > 1 ? "Nome completo de cada convidado" : "Nome completo de quem vai assistir"}
          </legend>
          <p className="mb-3 text-xs text-nevoa-2">
            Um nome por ingresso. Os nomes aparecem nos ingressos emitidos pela Sympla.
          </p>
          <div className="grid gap-3">
            {Array.from({ length: quantity }, (_, i) => {
              const key = `guest-${i}` as const;
              return (
                <div key={i}>
                  <label htmlFor={fieldId(key)} className="sr-only">
                    Convidado {i + 1}
                  </label>
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="w-7 shrink-0 text-right font-display text-lg text-ouro">
                      {i + 1}.
                    </span>
                    <input
                      id={fieldId(key)}
                      type="text"
                      autoComplete={i === 0 ? "name" : "off"}
                      maxLength={120}
                      value={guests[i] ?? ""}
                      onChange={(e) => {
                        setGuest(i, e.target.value);
                        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
                      }}
                      onFocus={(e) => {
                        if (i === 0 && !guests[0]) {
                          const buyer = formRef.current?.querySelector<HTMLInputElement>('input[name="fullName"]')?.value ?? "";
                          if (buyer.trim()) setGuest(0, buyer.trim());
                          e.currentTarget.select();
                        }
                      }}
                      placeholder={i === 0 ? "Convidado 1 (pode ser você)" : `Convidado ${i + 1}`}
                      aria-invalid={!!errors[key]}
                      aria-describedby={describe(key)}
                      className={inputClass + " border-white/15 py-3"}
                    />
                  </div>
                  {errorText(key)}
                </div>
              );
            })}
          </div>
        </fieldset>
      )}

      {sheetEnabled && (
        <div>
          <span id={`${id}-receipt-label`} className={labelClass}>
            Comprovante do PIX <span className="text-rosa-claro">(obrigatório)</span>
          </span>
          <label
            htmlFor={fieldId("receipt")}
            className={
              "flex cursor-pointer items-center gap-4 rounded-xl border border-dashed px-4 py-4 transition hover:border-ouro/60 hover:bg-ouro/5 " +
              (errors.receipt ? "border-rosa/70" : file ? "border-verde/60 bg-verde/5" : "border-white/25")
            }
          >
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-ouro/15 text-ouro">
              {file ? <FileText aria-hidden className="size-5" /> : <Paperclip aria-hidden className="size-5" />}
            </span>
            <span className="min-w-0 flex-1 text-sm">
              {file ? (
                <>
                  <span className="block truncate font-medium text-creme">{file.name}</span>
                  <span className="text-nevoa-2">Toque para trocar o arquivo</span>
                </>
              ) : (
                <>
                  <span className="block font-medium text-creme">Anexar comprovante</span>
                  <span className="text-nevoa-2">Foto, print ou PDF · até 8 MB</span>
                </>
              )}
            </span>
          </label>
          <input
            id={fieldId("receipt")}
            name="receipt"
            type="file"
            accept={RECEIPT_ACCEPT}
            required
            aria-labelledby={`${id}-receipt-label`}
            aria-invalid={!!errors.receipt}
            aria-describedby={describe("receipt")}
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setErrors((prev) => ({ ...prev, receipt: undefined }));
            }}
            className="sr-only"
          />
          {errorText("receipt")}
        </div>
      )}

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-nevoa">
          <input
            id={fieldId("consent")}
            name="consent"
            type="checkbox"
            required
            aria-invalid={!!errors.consent}
            aria-describedby={describe("consent")}
            className="mt-1 size-5 shrink-0 accent-[#2fc48a]"
          />
          <span>
            Autorizo a Emes a usar meu nome, e-mail, o nome do aluno(a) e o comprovante apenas para
            conferir o pagamento, controlar a lista de convidados e enviar meu ingresso pela Sympla.
          </span>
        </label>
        {errorText("consent")}
      </div>

      {sheetEnabled ? (
        <button type="submit" disabled={status === "sending"} className="cta-primary w-full disabled:cursor-wait disabled:opacity-80">
          {status === "sending" ? (
            <>
              <Loader2 aria-hidden className="size-5 animate-spin" />
              Enviando comprovante…
            </>
          ) : (
            <>
              <Paperclip aria-hidden className="size-5" />
              Enviar pedido e comprovante
            </>
          )}
        </button>
      ) : whatsappEnabled ? (
        <button type="submit" className="cta-primary w-full">
          <WhatsAppIcon className="size-6 shrink-0" />
          Enviar comprovante pelo WhatsApp
        </button>
      ) : (
        <p className="rounded-xl bg-white/5 p-4 text-center text-sm text-nevoa">
          Fale com a Emes pelo telefone{" "}
          <a href={`tel:${event.contactPhone.tel}`} className="inline-flex items-center gap-1 font-semibold text-ouro">
            <Phone aria-hidden className="size-3.5" />
            {event.contactPhone.display}
          </a>
          .
        </p>
      )}

      <div role="status" aria-live="polite">
        {status === "error" && lastData && (
          <div className="rounded-2xl border border-rosa/40 bg-rosa/10 p-4 text-center text-sm text-rosa-claro">
            <p>
              Não conseguimos enviar o comprovante agora. Tente novamente em instantes
              {whatsappEnabled ? " ou envie pelo WhatsApp (anexe o comprovante na conversa)." : "."}
            </p>
            {whatsappEnabled && (
              <button
                type="button"
                onClick={() => {
                  openWhatsApp(lastData);
                }}
                className="btn-ghost mt-3"
              >
                <WhatsAppIcon className="size-5" />
                Enviar pelo WhatsApp
              </button>
            )}
          </div>
        )}
      </div>

      <ol className="grid gap-2 rounded-2xl bg-white/[0.04] p-4 text-sm text-nevoa sm:grid-cols-3 sm:gap-4">
        {(sheetEnabled
          ? [
              "Pague o PIX e salve o comprovante.",
              "Preencha os dados e anexe o comprovante.",
              "Após a conferência, você recebe o ingresso pela Sympla no seu e-mail.",
            ]
          : [
              "Preencha os dados e toque em enviar.",
              "No WhatsApp, anexe o comprovante do PIX.",
              "Após a conferência, você recebe o ingresso pela Sympla no seu e-mail.",
            ]
        ).map((step, i) => (
          <li key={i} className="flex gap-2">
            <span className="font-display text-lg leading-none text-ouro">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </form>
  );
}
