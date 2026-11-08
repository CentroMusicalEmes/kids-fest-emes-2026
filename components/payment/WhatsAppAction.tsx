"use client";

import { Phone } from "lucide-react";
import { event } from "@/config/event";
import { trackMetaEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

interface WhatsAppActionProps {
  href: string | null;
  label: string;
  context: "receipt" | "support";
  className?: string;
}

/**
 * Botão de WhatsApp. Sem link validado, mostra um estado desativado claro e
 * oferece o telefone informado pela Emes como alternativa.
 */
export function WhatsAppAction({ href, label, context, className }: WhatsAppActionProps) {
  if (!href) {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <span
          role="link"
          aria-disabled="true"
          className="cta-primary btn-disabled w-full sm:w-auto"
        >
          <WhatsAppIcon className="size-5" />
          {label}
        </span>
        <p className="max-w-sm text-center text-sm text-nevoa">
          Canal de WhatsApp em validação. Enquanto isso, fale com a Emes pelo telefone{" "}
          <a
            href={`tel:${event.contactPhone.tel}`}
            className="inline-flex items-center gap-1 font-semibold text-ouro underline-offset-4 hover:underline"
          >
            <Phone aria-hidden className="size-3.5" />
            {event.contactPhone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("cta-primary w-full sm:w-auto", className)}
      onClick={() => trackMetaEvent("Contact", { content_name: context }, { once: true })}
    >
      <WhatsAppIcon className="size-5" />
      {label}
      <span className="sr-only">(abre o WhatsApp em nova janela)</span>
    </a>
  );
}
