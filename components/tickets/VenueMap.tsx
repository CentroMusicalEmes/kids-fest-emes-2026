"use client";

import { useState } from "react";
import { Map as MapIcon, MapPin, Navigation } from "lucide-react";
import { event } from "@/config/event";
import { mapsLinks } from "@/config/integrations";

/**
 * O mapa do Google só é carregado quando o visitante pede, evitando
 * requisições a terceiros e peso extra no carregamento inicial.
 */
export function VenueMap() {
  const [showMap, setShowMap] = useState(false);
  const { address } = event.venue;

  return (
    <div className="glass grid overflow-hidden rounded-3xl lg:grid-cols-[1fr_1.3fr]">
      <div className="flex flex-col justify-center gap-5 p-7 sm:p-10">
        <p className="eyebrow">Localização</p>
        <h3 className="font-display text-3xl font-semibold text-creme sm:text-4xl">{event.venue.name}</h3>
        <address className="flex gap-3 not-italic leading-relaxed text-nevoa">
          <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-ouro" />
          <span>
            {address.street} — {address.neighborhood}
            <br />
            {event.venue.city} — {event.venue.state}, CEP {address.postalCode}
          </span>
        </address>
        <a
          href={mapsLinks.directions}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost self-start"
        >
          <Navigation aria-hidden className="size-4" />
          Como chegar ao teatro
          <span className="sr-only">(abre o Google Maps em nova janela)</span>
        </a>
      </div>

      <div className="relative min-h-[300px] bg-noite-2 sm:min-h-[380px]">
        {showMap ? (
          <iframe
            title={`Mapa: ${event.venue.name}, ${event.venue.city}`}
            src={mapsLinks.embed}
            className="absolute inset-0 h-full w-full border-0 grayscale-[30%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden text-center"
          >
            {/* Mapa estilizado em SVG como prévia */}
            <svg aria-hidden className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300">
              <defs>
                <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M28 0H0v28" fill="none" stroke="#5265d8" strokeOpacity="0.35" />
                </pattern>
              </defs>
              <rect width="400" height="300" fill="url(#grid)" />
              <path d="M-10 210 C 90 170 160 240 260 160 S 380 90 420 110" stroke="#f8d98b" strokeOpacity="0.6" strokeWidth="6" fill="none" />
              <path d="M120 -10 L 190 320" stroke="#f48bcb" strokeOpacity="0.45" strokeWidth="4" fill="none" />
            </svg>
            <span className="relative inline-flex size-16 items-center justify-center rounded-full bg-ouro text-noite shadow-[0_0_50px_rgb(248_217_139/0.6)] transition group-hover:scale-110">
              <MapPin aria-hidden className="size-7" />
            </span>
            <span className="relative inline-flex items-center gap-2 rounded-full border border-ouro/40 bg-noite/70 px-5 py-2.5 text-sm font-semibold text-ouro-claro">
              <MapIcon aria-hidden className="size-4" />
              Ver mapa interativo
            </span>
            <span className="relative max-w-xs px-4 text-xs text-nevoa-2">
              O mapa é fornecido pelo Google Maps e carregado somente após o clique.
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
