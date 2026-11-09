"use client";

import { useId, useRef, useState } from "react";
import { Phone, Send } from "lucide-react";
import { event } from "@/config/event";
import { MAX_TICKETS_PER_PURCHASE } from "@/config/payment";
import { buildTicketRequestMessage, whatsappConfig } from "@/config/integrations";
import { trackMetaEvent } from "@/lib/analytics";
import { formatBRL } from "@/lib/utils";
import { isValidEmail, isValidFullName } from "@/lib/validation";
import { resolveWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type Field = "fullName" | "email" | "studentName" | "quantity" | "consent";
type Errors = Partial<Record<Field, string>>;

const inputClass =
  "w-full rounded-xl border bg-black/25 px-4 py-3.5 text-base text-creme placeholder:text-nevoa-2/70 transition focus:border-ouro/70 focus:bg-black/35 focus:outline-none aria-[invalid=true]:border-rosa/70";

/**
 * Dados do convidado para a emissão do ingresso na Sympla. Nada é salvo no
 * site: ao enviar, o WhatsApp da Emes abre com os dados já escritos e o
 * convidado anexa o comprovante.
 */
export function TicketRequestForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [quantity, setQuantity] = useState(1);
  const [sent, setSent] = useState(false);
  const whatsappEnabled = resolveWhatsAppUrl(whatsappConfig) !== null;

  const fieldId = (name: Field) => `${id}-${name}`;
  const errorId = (name: Field) => `${id}-${name}-erro`;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const fullName = String(form.get("fullName") ?? "");
    const email = String(form.get("email") ?? "");
    const studentName = String(form.get("studentName") ?? "");
    const consent = form.get("consent") === "on";

    const next: Errors = {};
    if (!isValidFullName(fullName)) next.fullName = "Informe seu nome e sobrenome.";
    if (!isValidEmail(email)) next.email = "Informe um e-mail válido: o ingresso será enviado para ele.";
    if (!isValidFullName(studentName)) next.studentName = "Informe o nome e sobrenome do aluno(a).";
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_TICKETS_PER_PURCHASE) {
      next.quantity = `Escolha entre 1 e ${MAX_TICKETS_PER_PURCHASE} ingressos.`;
    }
    if (!consent) next.consent = "É preciso autorizar o uso dos dados para emitir o ingresso.";
    setErrors(next);

    const firstInvalid = (Object.keys(next) as Field[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(firstInvalid))}`)?.focus();
      return;
    }

    const url = resolveWhatsAppUrl(
      whatsappConfig,
      buildTicketRequestMessage({ fullName, email, studentName, quantity }),
    );
    if (!url) return;
    trackMetaEvent("Contact", { content_name: "receipt" }, { once: true });
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url; // bloqueador de pop-up: abre na mesma aba
    setSent(true);
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

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Dados para emissão do ingresso"
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
            onChange={(e) => setQuantity(Math.trunc(Number(e.target.value)) || 0)}
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
            Autorizo a Emes a usar meu nome, e-mail e o nome do aluno(a) apenas para emitir e
            enviar meu ingresso pela Sympla.
          </span>
        </label>
        {errorText("consent")}
      </div>

      {whatsappEnabled ? (
        <button type="submit" className="cta-primary w-full">
          <WhatsAppIcon className="size-6 shrink-0" />
          Enviar comprovante pelo WhatsApp
        </button>
      ) : (
        <p className="rounded-xl bg-white/5 p-4 text-center text-sm text-nevoa">
          Canal de WhatsApp em validação. Fale com a Emes pelo telefone{" "}
          <a href={`tel:${event.contactPhone.tel}`} className="inline-flex items-center gap-1 font-semibold text-ouro">
            <Phone aria-hidden className="size-3.5" />
            {event.contactPhone.display}
          </a>
          .
        </p>
      )}

      <p role="status" className="min-h-5 text-center text-sm">
        {sent && (
          <span className="inline-flex items-center gap-2 text-verde-claro">
            <Send aria-hidden className="size-4" />
            Abrimos o WhatsApp com seus dados. Anexe o comprovante e envie a mensagem.
          </span>
        )}
      </p>

      <ol className="grid gap-2 rounded-2xl bg-white/[0.04] p-4 text-sm text-nevoa sm:grid-cols-3 sm:gap-4">
        {[
          "Preencha os dados e toque em enviar.",
          "No WhatsApp, anexe o comprovante do PIX.",
          "Após a conferência, você recebe o ingresso pela Sympla no seu e-mail.",
        ].map((step, i) => (
          <li key={i} className="flex gap-2">
            <span className="font-display text-lg leading-none text-ouro">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </form>
  );
}
