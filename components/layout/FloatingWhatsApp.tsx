"use client";

import { whatsappLinks } from "@/config/integrations";
import { trackMetaEvent } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/** Botão flutuante: só aparece quando o número do WhatsApp foi validado. */
export function FloatingWhatsApp() {
  const href = whatsappLinks.support;
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Emes no WhatsApp (abre em nova janela)"
      onClick={() => trackMetaEvent("Contact", { content_name: "floating" }, { once: true })}
      className="fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-verde-claro to-verde text-verde-tinta shadow-[0_10px_30px_-5px_rgb(47_196_138/0.7)] transition hover:scale-110 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
