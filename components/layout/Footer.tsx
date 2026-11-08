import { Phone } from "lucide-react";
import { event } from "@/config/event";

export function Footer() {
  return (
    <footer className="border-t border-ouro/10 bg-noite pt-14 pb-24 text-sm text-nevoa-2 sm:pb-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 text-center sm:px-8">
        <p className="font-display text-2xl text-creme">
          Kids Fest <span className="text-gold italic">Emes</span> 2026
        </p>
        <p>
          {event.labels.fullDate} · {event.labels.time} · {event.venue.name}, {event.venue.city} —{" "}
          {event.venue.state}
        </p>
        <a
          href={`tel:${event.contactPhone.tel}`}
          className="inline-flex items-center gap-2 text-nevoa transition hover:text-ouro"
        >
          <Phone aria-hidden className="size-4" />
          {event.contactPhone.display}
        </a>
        <p className="max-w-xl text-xs leading-relaxed">
          As imagens de alunos publicadas neste site são utilizadas mediante autorização dos
          responsáveis. Pagamentos são confirmados manualmente pela equipe da Emes.
        </p>
        <p className="text-xs">© 2026 Emes. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
