"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { metaPixelConfig } from "@/config/integrations";

const STORAGE_KEY = "kidsfest-consent-marketing";
type Consent = "granted" | "denied" | null;

const listeners = new Set<() => void>();

function readConsent(): Consent {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

let memoryConsent: Consent | undefined;
const getSnapshot = (): Consent => (memoryConsent === undefined ? readConsent() : memoryConsent);
/** No servidor não sabemos a escolha: nada é carregado nem exibido. */
const getServerSnapshot = (): Consent | "unknown" => "unknown";

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setConsent(value: "granted" | "denied") {
  memoryConsent = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* navegação privada: vale só para esta visita */
  }
  listeners.forEach((l) => l());
}

/**
 * Carrega o Meta Pixel somente se houver ID configurado e, quando exigido,
 * após o consentimento do visitante. PageView é enviado uma vez, na carga.
 */
export function MetaPixel() {
  const consent = useSyncExternalStore<Consent | "unknown">(subscribe, getSnapshot, getServerSnapshot);
  const { id, requireConsent } = metaPixelConfig;

  if (!id || consent === "unknown") return null;

  const allowed = !requireConsent || consent === "granted";

  return (
    <>
      {allowed && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`}
        </Script>
      )}

      {requireConsent && consent === null && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Aviso de privacidade"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border border-ouro/25 bg-noite-2/95 p-5 text-sm text-nevoa shadow-2xl backdrop-blur-xl sm:inset-x-6 sm:bottom-6"
        >
          <p>
            Usamos o Meta Pixel para medir a divulgação do evento. Ele só é ativado com a sua
            permissão. Você pode mudar de ideia limpando os dados do site no navegador.
          </p>
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <button type="button" onClick={() => setConsent("denied")} className="btn-ghost min-h-10 py-2">
              Recusar
            </button>
            <button
              type="button"
              onClick={() => setConsent("granted")}
              className="min-h-10 rounded-full bg-ouro px-5 py-2 text-xs font-semibold tracking-wider text-noite uppercase transition hover:bg-ouro-claro"
            >
              Aceitar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
