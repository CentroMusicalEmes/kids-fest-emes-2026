"use client";

import { useEffect, useRef } from "react";
import { trackMetaEvent, ticketEventParams, type MetaStandardEvent } from "@/lib/analytics";

/** Dispara um evento do Meta Pixel uma única vez quando o bloco entra na tela. */
export function TrackOnView({
  event = "ViewContent",
}: {
  event?: MetaStandardEvent;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackMetaEvent(event, ticketEventParams, { once: true });
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [event]);

  return <span ref={ref} aria-hidden className="block h-px" />;
}
