"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#emocao", label: "A emoção" },
  { href: "#ingressos", label: "Ingressos" },
  { href: "#programacao", label: "Programação" },
  { href: "#emes", label: "A Emes" },
  { href: "#faq", label: "Dúvidas" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "border-b border-ouro/10 bg-noite/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-full focus:bg-ouro focus:px-4 focus:py-2 focus:text-noite"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <a href="#abertura" className="group flex items-baseline gap-2" aria-label="Kids Fest Emes 2026 — início">
          <span className="font-display text-xl font-semibold tracking-wide text-creme sm:text-2xl">
            Kids Fest
          </span>
          <span className="text-gold font-display text-xl font-semibold italic sm:text-2xl">Emes</span>
          <span className="hidden text-xs font-medium tracking-[0.3em] text-nevoa-2 sm:inline">2026</span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative text-sm font-medium text-nevoa transition-colors hover:text-ouro after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-ouro after:transition-all hover:after:w-full"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#pagamento"
            className="hidden rounded-full border border-verde/50 bg-verde/10 px-5 py-2.5 text-xs font-semibold tracking-[0.12em] text-verde-claro uppercase transition hover:bg-verde/20 sm:inline-flex"
          >
            Ingresso R$ 20
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-ouro/25 text-ouro lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <nav
        id="menu-mobile"
        aria-label="Menu móvel"
        hidden={!open}
        className="border-t border-ouro/10 bg-noite/95 px-4 pb-6 lg:hidden"
      >
        <ul className="flex flex-col pt-2">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-white/5 py-4 font-display text-xl text-creme"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#pagamento" onClick={() => setOpen(false)} className="cta-primary mt-6 w-full">
          Garantir meu ingresso
        </a>
      </nav>
    </header>
  );
}
