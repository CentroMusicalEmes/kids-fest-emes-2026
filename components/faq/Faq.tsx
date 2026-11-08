"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/config/event";
import { cn } from "@/lib/utils";

/** Acordeão acessível (padrão WAI-ARIA: botão + região). */
export function Faq({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ul className="divide-y divide-ouro/10 rounded-3xl border border-ouro/15 bg-white/[0.03]">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const buttonId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <li key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-display text-lg text-creme transition-colors hover:text-ouro sm:px-8 sm:text-xl"
              >
                {item.question}
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "size-5 shrink-0 text-ouro transition-transform duration-500",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              data-open={isOpen}
              inert={!isOpen}
              className="accordion-panel"
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-relaxed text-nevoa sm:px-8">{item.answer}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
