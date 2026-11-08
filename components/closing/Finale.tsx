import { event } from "@/config/event";
import { formatBRL } from "@/lib/utils";
import { CtaButton } from "@/components/ui/CtaButton";
import { Reveal } from "@/components/ui/Reveal";
import { Particles, Sparkle, Spotlights } from "@/components/ui/StageBackdrop";

export function Finale() {
  return (
    <section
      id="final"
      aria-labelledby="final-title"
      className="relative isolate overflow-hidden py-28 text-center sm:py-40"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 100%, rgb(244 139 203 / 0.3), transparent 70%), radial-gradient(60% 60% at 50% 30%, #30145c, #0c0420 80%)",
        }}
      />
      <Spotlights className="-z-10 opacity-70" />
      <Particles count={26} seed={42} className="-z-10" />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <Sparkle className="top-0 left-[8%]" delay="0.3s" />
        <Sparkle className="top-16 right-[10%]" size={12} delay="1.4s" />

        <Reveal>
          <h2
            id="final-title"
            className="font-display text-4xl leading-[1.1] font-semibold text-creme sm:text-6xl lg:text-7xl"
          >
            O palco está esperando.{" "}
            <span className="text-gold shimmer-text italic">E a próxima grande emoção pode ser a sua.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-nevoa sm:text-xl">
            No dia 30 de novembro, cada nota será uma conquista. Cada sorriso, uma celebração. E
            cada aplauso, uma lembrança que ficará para sempre.
          </p>
          <p className="mt-4 font-display text-2xl text-creme italic">
            Venha viver essa noite com a família Emes.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mx-auto mt-12 inline-flex flex-col items-center gap-2 rounded-3xl border border-ouro/25 bg-noite/40 px-8 py-6 backdrop-blur">
            <p className="eyebrow">{event.name}</p>
            <p className="text-sm font-medium tracking-[0.2em] text-creme uppercase">
              {event.labels.dayMonth} • {event.labels.time}
            </p>
            <p className="text-sm font-medium tracking-[0.2em] text-creme uppercase">{event.venue.name}</p>
            <p className="mt-1 font-display text-2xl text-ouro">
              Ingresso {formatBRL(event.ticket.priceCents)}
            </p>
          </div>
          <div className="mt-10">
            <CtaButton />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
