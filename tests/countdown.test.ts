import { describe, expect, it } from "vitest";
import { getEventPhase, getTimeRemaining, pad2 } from "@/lib/countdown";
import { event, eventStartMs } from "@/config/event";

describe("data do evento", () => {
  it("corresponde a 30/11/2026 19h em Brasília (22h UTC)", () => {
    expect(new Date(eventStartMs).toISOString()).toBe("2026-11-30T22:00:00.000Z");
    const local = new Intl.DateTimeFormat("pt-BR", {
      timeZone: event.timeZone,
      dateStyle: "short",
      timeStyle: "short",
    }).format(eventStartMs);
    expect(local).toBe("30/11/2026, 19:00");
  });
});

describe("getTimeRemaining", () => {
  it("decompõe dias, horas, minutos e segundos", () => {
    const now = Date.parse("2026-11-28T17:58:30-03:00");
    expect(getTimeRemaining(eventStartMs, now)).toEqual({
      totalMs: (2 * 86400 + 3600 + 90) * 1000,
      days: 2,
      hours: 1,
      minutes: 1,
      seconds: 30,
      isOver: false,
    });
  });

  it("nunca retorna valores negativos", () => {
    const after = eventStartMs + 5 * 60 * 1000;
    const r = getTimeRemaining(eventStartMs, after);
    expect(r).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
  });

  it("zera exatamente no horário", () => {
    expect(getTimeRemaining(eventStartMs, eventStartMs).isOver).toBe(true);
    expect(getTimeRemaining(eventStartMs, eventStartMs - 1000).seconds).toBe(1);
  });
});

describe("getEventPhase", () => {
  it("identifica antes, durante e depois", () => {
    expect(getEventPhase(eventStartMs, eventStartMs - 1)).toBe("upcoming");
    expect(getEventPhase(eventStartMs, eventStartMs + 60_000)).toBe("live");
    expect(getEventPhase(eventStartMs, eventStartMs + 4 * 3600_000)).toBe("finished");
  });
});

describe("pad2", () => {
  it("completa com zero", () => {
    expect(pad2(7)).toBe("07");
    expect(pad2(12)).toBe("12");
  });
});
