export interface TimeRemaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Calcula o tempo restante até `target`. Nunca retorna valores negativos:
 * depois do horário, tudo fica zerado e `isOver` passa a ser true.
 */
export function getTimeRemaining(target: number, now: number): TimeRemaining {
  const totalMs = Math.max(0, target - now);
  return {
    totalMs,
    days: Math.floor(totalMs / DAY),
    hours: Math.floor((totalMs % DAY) / HOUR),
    minutes: Math.floor((totalMs % HOUR) / MINUTE),
    seconds: Math.floor((totalMs % MINUTE) / SECOND),
    isOver: totalMs === 0,
  };
}

/** Duração do evento usada para decidir quando ele "já aconteceu". */
export const EVENT_DURATION_MS = 3 * HOUR;

export type EventPhase = "upcoming" | "live" | "finished";

export function getEventPhase(
  start: number,
  now: number,
  durationMs = EVENT_DURATION_MS,
): EventPhase {
  if (now < start) return "upcoming";
  if (now < start + durationMs) return "live";
  return "finished";
}

export const pad2 = (value: number) => value.toString().padStart(2, "0");
