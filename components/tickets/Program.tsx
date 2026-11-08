import { Music } from "lucide-react";
import { performances, program } from "@/config/event";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Program() {
  const ordered = [...performances].sort((a, b) => a.order - b.order);

  return (
    <div id="programacao" className="scroll-mt-24">
      <SectionHeading
        eyebrow="Programação"
        title={
          <>
            A noite em que nossos pequenos artistas serão{" "}
            <span className="text-gold italic">as estrelas</span>
          </>
        }
      />

      <ol className="relative mx-auto mt-14 max-w-2xl space-y-6 border-l border-ouro/25 pl-8 sm:pl-10">
        {program.map((item, i) => (
          <li key={item.title} className="relative">
            <span
              aria-hidden
              className="absolute top-1.5 -left-[2.6rem] flex size-5 items-center justify-center rounded-full border border-ouro/60 bg-noite sm:-left-[3.15rem]"
            >
              <span className="size-2 rounded-full bg-ouro" />
            </span>
            <Reveal delay={i * 0.1}>
              <div className="glass rounded-2xl p-6">
                {item.time && (
                  <p className="font-display text-3xl font-semibold text-ouro">{item.time}</p>
                )}
                <p className="mt-1 text-lg font-medium text-creme">{item.title}</p>
                {item.description && <p className="mt-2 text-nevoa">{item.description}</p>}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal className="mx-auto mt-10 max-w-2xl">
        {ordered.length > 0 ? (
          <div className="glass rounded-3xl p-6 sm:p-8">
            <h3 className="font-display text-2xl text-creme">Ordem das apresentações</h3>
            <ol className="mt-5 divide-y divide-white/5">
              {ordered.map((p) => (
                <li key={`${p.order}-${p.title}`} className="flex items-baseline gap-4 py-3">
                  <span className="w-8 shrink-0 font-display text-xl text-ouro">{p.order}</span>
                  <span className="flex-1">
                    <span className="block font-medium text-creme">{p.title}</span>
                    {p.group && <span className="text-sm text-nevoa">{p.group}</span>}
                  </span>
                  {p.time && <span className="text-sm text-nevoa-2">{p.time}</span>}
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-ouro/25 px-5 py-4 text-center text-sm text-nevoa">
            <Music aria-hidden className="size-4 shrink-0 text-ouro" />
            A ordem das apresentações será divulgada em breve.
          </p>
        )}
      </Reveal>
    </div>
  );
}
