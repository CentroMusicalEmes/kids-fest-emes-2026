import { CalendarDays, MapPin } from "lucide-react";
import { event } from "@/config/event";
import { formatBRL } from "@/lib/utils";
import { CtaButton } from "@/components/ui/CtaButton";
import { Curtains, Particles, Sparkle, Spotlights } from "@/components/ui/StageBackdrop";

const d = (s: number) => ({ "--delay": `${s}s` }) as React.CSSProperties;

export function Hero() {
  return (
    <section
      id="abertura"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-32 pb-28 lg:pt-40"
    >
      {/* Camadas de profundidade */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 105%, rgb(244 139 203 / 0.35), transparent 60%), radial-gradient(70% 70% at 50% 40%, #30145c 0%, #170836 55%, #0c0420 100%)",
        }}
      />
      <Spotlights className="-z-10" />
      <Curtains />
      <Particles count={34} className="-z-10" />
      {/* piso do palco */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-56"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 100%, rgb(248 217 139 / 0.28), transparent 70%), linear-gradient(to top, #0c0420, transparent)",
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
        <Sparkle className="top-[-2.5rem] left-[12%]" delay="0.4s" />
        <Sparkle className="top-[18%] right-[6%]" size={14} delay="1.6s" />
        <Sparkle className="bottom-[22%] left-[4%]" size={12} delay="2.4s" />

        <p className="rise-in eyebrow mb-7 inline-flex items-center gap-3" style={d(0.2)}>
          <span aria-hidden className="h-px w-10 bg-ouro/60" />
          {event.name}
          <span aria-hidden className="h-px w-10 bg-ouro/60" />
        </p>

        <h1
          id="hero-title"
          className="font-display text-[2.55rem] leading-[1.04] font-semibold tracking-tight sm:text-6xl md:text-7xl lg:text-[5.4rem]"
        >
          <span className="rise-in block text-creme" style={d(0.45)}>
            Pequenos artistas.
          </span>
          <span className="rise-in text-gold shimmer-text block px-[0.08em] italic" style={d(0.75)}>
            Grandes conquistas.
          </span>
          <span className="rise-in text-aurora block" style={d(1.05)}>
            Memórias para toda a vida.
          </span>
        </h1>

        <p
          className="rise-in mx-auto mt-8 max-w-2xl text-base leading-relaxed text-nevoa sm:text-lg"
          style={d(1.35)}
        >
          Uma noite em que a música ganha vida, os pequenos talentos iluminam o palco e
          cada família descobre que existem emoções que ficam guardadas para sempre.
        </p>

        <div
          className="rise-in mt-9 flex flex-col items-center justify-center gap-3 text-sm font-medium tracking-[0.18em] text-ouro-claro uppercase sm:flex-row sm:gap-6"
          style={d(1.6)}
        >
          <span className="inline-flex items-center gap-2">
            <CalendarDays aria-hidden className="size-4 text-ouro" />
            {event.labels.dayMonth} • {event.labels.time}
          </span>
          <span aria-hidden className="hidden h-4 w-px bg-ouro/40 sm:block" />
          <span className="inline-flex items-center gap-2">
            <MapPin aria-hidden className="size-4 text-ouro" />
            {event.venue.name} • {event.venue.city}
          </span>
        </div>

        <div className="rise-in mt-10 flex flex-col items-center gap-4" style={d(1.85)}>
          <CtaButton />
          <p className="text-sm text-nevoa">
            {event.ticket.label} —{" "}
            <strong className="font-semibold text-ouro">{formatBRL(event.ticket.priceCents)}</strong>
          </p>
        </div>
      </div>

      <a
        href="#emocao"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] font-medium tracking-[0.35em] text-nevoa-2 uppercase transition hover:text-ouro"
      >
        Explore
        <span aria-hidden className="flex h-10 w-6 justify-center rounded-full border border-ouro/40 pt-2">
          <span className="scroll-cue block h-2 w-1 rounded-full bg-ouro" />
        </span>
      </a>
    </section>
  );
}
