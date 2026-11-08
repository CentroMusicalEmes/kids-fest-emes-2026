"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/config/event";
import { cn } from "@/lib/utils";

/** Galeria com lightbox acessível (diálogo nativo, teclado e foco). */
export function Gallery({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  const open = (i: number, trigger: HTMLButtonElement) => {
    lastTrigger.current = trigger;
    setIndex(i);
  };
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setIndex((i) => (i === null ? i : (i + delta + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) {
      dialog.close();
      lastTrigger.current?.focus();
    }
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, step]);

  if (images.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-ouro/25 bg-white/[0.02] p-6 text-center",
              i !== 1 && "hidden sm:flex",
            )}
          >
            <Camera aria-hidden className="size-8 text-ouro/70" />
            {i === 1 && (
              <p className="text-sm leading-relaxed text-nevoa">
                Em breve, registros reais das apresentações da Emes.
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  const current = index === null ? null : images[index];

  return (
    <>
      <ul className="columns-2 gap-3 sm:gap-4 md:columns-3 [&>li]:mb-3 sm:[&>li]:mb-4">
        {images.map((img, i) => (
          <li key={img.src} className="break-inside-avoid">
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="group relative block w-full overflow-hidden rounded-2xl"
              aria-label={`Ampliar foto: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading="lazy"
                sizes="(min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition duration-700 group-hover:scale-105"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-noite/70 via-transparent opacity-0 transition group-hover:opacity-100"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => e.target === e.currentTarget && close()}
        aria-label="Visualização ampliada da foto"
        className="m-auto max-h-[100dvh] w-full max-w-5xl bg-transparent p-4 text-creme backdrop:bg-noite/90 backdrop:backdrop-blur-sm"
      >
        {current && (
          <figure className="relative">
            <Image
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="100vw"
              className="mx-auto max-h-[78dvh] w-auto rounded-2xl object-contain"
            />
            <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-nevoa">
              <span>{current.caption ?? current.alt}</span>
              <span className="shrink-0 tabular-nums">
                {(index ?? 0) + 1} / {images.length}
              </span>
            </figcaption>
          </figure>
        )}
        <div className="mt-4 flex justify-center gap-3">
          <button type="button" onClick={() => step(-1)} className="btn-ghost" aria-label="Foto anterior">
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button type="button" onClick={close} className="btn-ghost" aria-label="Fechar">
            <X aria-hidden className="size-5" />
          </button>
          <button type="button" onClick={() => step(1)} className="btn-ghost" aria-label="Próxima foto">
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
      </dialog>
    </>
  );
}
