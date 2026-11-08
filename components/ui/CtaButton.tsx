"use client";

import { Ticket } from "lucide-react";
import { trackMetaEvent, ticketEventParams } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface CtaButtonProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

/** Botão principal “Garantir meu ingresso”: leva à área de pagamento. */
export function CtaButton({
  href = "#pagamento",
  children = "Garantir meu ingresso",
  className,
}: CtaButtonProps) {
  return (
    <a
      href={href}
      className={cn("cta-primary", className)}
      onClick={() => trackMetaEvent("InitiateCheckout", ticketEventParams, { once: true })}
    >
      <Ticket aria-hidden className="size-5 shrink-0" strokeWidth={2.2} />
      <span>{children}</span>
    </a>
  );
}
