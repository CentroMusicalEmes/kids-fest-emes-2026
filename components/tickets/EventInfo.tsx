import { CalendarDays, Clock, MapPin, QrCode, Ticket } from "lucide-react";
import { event } from "@/config/event";
import { formatBRL } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

const items = [
  { icon: CalendarDays, label: "Data", value: event.labels.fullDate },
  { icon: Clock, label: "Horário", value: event.labels.timeWithZone },
  { icon: MapPin, label: "Local", value: `${event.venue.name}, ${event.venue.city}` },
  { icon: Ticket, label: "Valor", value: `${formatBRL(event.ticket.priceCents)} por ingresso` },
  { icon: QrCode, label: "Pagamento", value: "PIX, com envio do comprovante pelo WhatsApp" },
];

export function EventInfo() {
  return (
    <ul aria-label="Informações do evento" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map(({ icon: Icon, label, value }, i) => (
        <li key={label}>
          <Reveal delay={i * 0.07} className="h-full">
            <div className="glass flex h-full flex-col gap-3 rounded-2xl p-5 transition hover:border-ouro/35">
              <Icon aria-hidden className="size-6 text-ouro" />
              <p className="text-[0.7rem] font-semibold tracking-[0.25em] text-nevoa-2 uppercase">{label}</p>
              <p className="leading-snug font-medium text-creme">{value}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
