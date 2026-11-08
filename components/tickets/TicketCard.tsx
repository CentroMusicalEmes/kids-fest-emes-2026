import { event } from "@/config/event";
import { formatBRL } from "@/lib/utils";
import { CtaButton } from "@/components/ui/CtaButton";
import { Sparkle } from "@/components/ui/StageBackdrop";

/** Ingresso em estilo de bilhete de teatro. */
export function TicketCard() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-ouro/25 via-rosa/15 to-azul/25 blur-3xl"
      />
      <article
        aria-label="Ingresso Kids Fest Emes 2026"
        className="ticket-notch relative overflow-hidden rounded-[2rem] border border-ouro/40 bg-gradient-to-b from-roxo-700 via-roxo to-roxo-900 p-1"
      >
        <div className="rounded-[1.8rem] border border-ouro/20 px-6 py-10 text-center sm:px-10">
          <Sparkle className="top-6 left-6" size={14} />
          <Sparkle className="top-10 right-8" size={10} delay="1.2s" />
          <p className="eyebrow">{event.name}</p>
          <p className="mt-6 text-sm font-semibold tracking-[0.35em] text-nevoa uppercase">
            {event.ticket.label}
          </p>
          <p className="text-gold mt-2 font-display text-7xl leading-none font-bold sm:text-8xl">
            {formatBRL(event.ticket.priceCents)}
          </p>

          <div aria-hidden className="my-8 border-t border-dashed border-ouro/35" />

          <dl className="grid grid-cols-2 gap-4 text-left">
            <div>
              <dt className="text-[0.65rem] tracking-[0.25em] text-nevoa-2 uppercase">Data</dt>
              <dd className="mt-1 font-semibold text-creme">{event.labels.shortDate}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] tracking-[0.25em] text-nevoa-2 uppercase">Horário</dt>
              <dd className="mt-1 font-semibold text-creme">{event.labels.time}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[0.65rem] tracking-[0.25em] text-nevoa-2 uppercase">Local</dt>
              <dd className="mt-1 font-semibold text-creme">
                {event.venue.name} · {event.venue.city}
              </dd>
            </div>
          </dl>

          <CtaButton className="mt-9 w-full" />
          <p className="mt-4 text-xs tracking-wide text-nevoa-2">Pagamento via PIX</p>
        </div>
      </article>
    </div>
  );
}
