import Image from "next/image";
import { Handshake } from "lucide-react";
import { sponsors } from "@/config/event";
import { Reveal } from "@/components/ui/Reveal";

export function Sponsors() {
  return (
    <div id="patrocinadores" className="scroll-mt-24 text-center">
      <Reveal>
        <h3 className="font-display mx-auto max-w-3xl text-3xl leading-tight font-semibold text-creme sm:text-4xl">
          Quem acredita na magia da música{" "}
          <span className="text-gold italic">também faz parte desta história.</span>
        </h3>
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        {sponsors.length > 0 ? (
          <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {sponsors.map((s) => {
              const logo = (
                <Image
                  src={s.logo}
                  alt={s.name}
                  width={s.width}
                  height={s.height}
                  className="h-12 w-auto max-w-[160px] object-contain opacity-80 brightness-0 invert transition group-hover:opacity-100 sm:h-14"
                />
              );
              return (
                <li key={s.name}>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass group flex h-24 w-40 items-center justify-center rounded-2xl px-5 sm:w-48"
                    >
                      {logo}
                      <span className="sr-only">(abre em nova janela)</span>
                    </a>
                  ) : (
                    <div className="glass group flex h-24 w-40 items-center justify-center rounded-2xl px-5 sm:w-48">
                      {logo}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mx-auto inline-flex items-center gap-3 rounded-full border border-dashed border-ouro/25 px-6 py-3 text-sm text-nevoa">
            <Handshake aria-hidden className="size-4 text-ouro" />
            Os apoiadores desta edição serão apresentados em breve.
          </p>
        )}
      </Reveal>
    </div>
  );
}
