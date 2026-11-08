"use client";

import { useSyncExternalStore } from "react";
import { eventStartMs } from "@/config/event";
import { getEventPhase, getTimeRemaining, pad2 } from "@/lib/countdown";

/* Relógio compartilhado: um único intervalo, atualizado a cada segundo. */
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
let currentSecond = Math.floor(Date.now() / 1000);

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    currentSecond = Math.floor(Date.now() / 1000);
    timer = setInterval(() => {
      currentSecond = Math.floor(Date.now() / 1000);
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => currentSecond;
/* No servidor (e na hidratação) não há "agora": mostramos um estado neutro. */
const getServerSnapshot = () => null;

const units = [
  { key: "days", label: "dias" },
  { key: "hours", label: "horas" },
  { key: "minutes", label: "minutos" },
  { key: "seconds", label: "segundos" },
] as const;

export function Countdown() {
  const nowSecond = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const now = nowSecond === null ? null : nowSecond * 1000;
  const phase = now === null ? "upcoming" : getEventPhase(eventStartMs, now);

  if (phase !== "upcoming") {
    return (
      <div role="status" className="glass mx-auto max-w-xl rounded-3xl px-6 py-8 text-center">
        <p className="font-display text-2xl text-creme sm:text-3xl">
          {phase === "live"
            ? "As cortinas se abriram: o Kids Fest Emes 2026 está acontecendo agora!"
            : "Obrigado por fazer parte do Kids Fest Emes 2026. Até o próximo espetáculo!"}
        </p>
      </div>
    );
  }

  const remaining = now === null ? null : getTimeRemaining(eventStartMs, now);
  const label = remaining
    ? `Faltam ${remaining.days} dias, ${remaining.hours} horas, ${remaining.minutes} minutos e ${remaining.seconds} segundos para o Kids Fest Emes 2026.`
    : "Contagem regressiva para o Kids Fest Emes 2026.";

  return (
    <div className="mx-auto max-w-3xl">
      <p className="sr-only" aria-live="off">
        {label}
      </p>
      <ol aria-hidden className="grid grid-cols-4 gap-2 sm:gap-4">
        {units.map(({ key, label }) => (
          <li
            key={key}
            className="glass relative flex flex-col items-center overflow-hidden rounded-2xl px-1 py-4 sm:rounded-3xl sm:py-6"
          >
            <span className="absolute inset-x-0 top-1/2 h-px bg-ouro/10" />
            <span className="font-display text-3xl font-semibold text-creme tabular-nums sm:text-6xl">
              {remaining ? pad2(remaining[key]) : "--"}
            </span>
            <span className="mt-1 text-[0.6rem] font-semibold tracking-[0.2em] text-ouro uppercase sm:mt-2 sm:text-xs">
              {label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
