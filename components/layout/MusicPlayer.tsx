"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { music } from "@/config/event";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "kidsfest-music";
const TARGET_VOLUME = 0.55;
const FADE_MS = 1800;

function readPreference(): "on" | "off" | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "on" || value === "off" ? value : null;
  } catch {
    return null;
  }
}

function savePreference(value: "on" | "off") {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* navegação privada: vale só para esta visita */
  }
}

/**
 * Trilha do site. Navegadores não permitem tocar áudio antes de uma
 * interação do visitante, então a música começa no primeiro toque/clique
 * na página (se `autoStartOnFirstInteraction`) ou pelo botão.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fadeRef = useRef<number | undefined>(undefined);
  const resumeOnVisible = useRef(false);
  const [playing, setPlaying] = useState(false);

  const fadeTo = (target: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(fadeRef.current ?? 0);
    const start = audio.volume;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / FADE_MS);
      audio.volume = Math.min(1, Math.max(0, start + (target - start) * k));
      if (k < 1) fadeRef.current = requestAnimationFrame(step);
      else onDone?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  };

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;
    try {
      await audio.play();
      fadeTo(TARGET_VOLUME);
    } catch {
      /* bloqueado pelo navegador: o botão continua disponível */
    }
  };

  const pause = () => fadeTo(0, () => audioRef.current?.pause());

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      savePreference("on");
      void play();
    } else {
      savePreference("off");
      pause();
    }
  };

  // Sincroniza o estado do botão com o elemento de áudio.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      cancelAnimationFrame(fadeRef.current ?? 0);
    };
  }, []);

  // Começa no primeiro toque/clique/tecla, salvo se o visitante desligou antes.
  useEffect(() => {
    if (!music.autoStartOnFirstInteraction || readPreference() === "off") return;
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    const start = (e: Event) => {
      if (buttonRef.current?.contains(e.target as Node)) return; // o botão cuida de si
      remove();
      if (audioRef.current?.paused) void play();
    };
    const remove = () => events.forEach((name) => window.removeEventListener(name, start));
    events.forEach((name) => window.addEventListener(name, start, { passive: true }));
    return remove;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pausa ao trocar de aba e retoma ao voltar.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden && !audio.paused) {
        resumeOnVisible.current = true;
        audio.pause();
      } else if (!document.hidden && resumeOnVisible.current) {
        resumeOnVisible.current = false;
        void audio.play().catch(() => undefined);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <>
      <audio ref={audioRef} src={music.src} preload="none" loop />
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Pausar a música “${music.title}”` : `Tocar a música “${music.title}”`}
        className={cn(
          "fixed bottom-4 left-4 z-40 inline-flex h-12 items-center gap-2.5 rounded-full border px-4 text-xs font-semibold tracking-[0.14em] uppercase backdrop-blur-xl transition sm:bottom-6 sm:left-6",
          playing
            ? "border-ouro/50 bg-noite/80 text-ouro shadow-[0_0_30px_-6px_rgb(248_217_139/0.6)]"
            : "border-ouro/30 bg-noite/70 text-ouro-claro hover:border-ouro/60",
        )}
      >
        {playing ? (
          <span aria-hidden className="flex h-4 items-end gap-[3px]">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="music-bar w-[3px] rounded-full bg-ouro"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        ) : (
          <VolumeX aria-hidden className="size-4" />
        )}
        <span className="hidden sm:inline">{playing ? "Trilha tocando" : "Ouvir a trilha"}</span>
        {playing ? (
          <Volume2 aria-hidden className="size-4 sm:hidden" />
        ) : (
          <span className="sm:hidden">Música</span>
        )}
      </button>
    </>
  );
}
