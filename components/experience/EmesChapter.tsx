import { event, gallery } from "@/config/event";
import { Gallery } from "@/components/gallery/Gallery";
import { Sponsors } from "@/components/sponsors/Sponsors";
import { Reveal } from "@/components/ui/Reveal";
import { GoldDivider, SectionHeading } from "@/components/ui/SectionHeading";
import { Atmosphere, Sparkle } from "@/components/ui/StageBackdrop";

const paragraphs = [
  `Há ${event.yearsOfHistory} anos, a Emes acredita que a música é muito mais do que aprender notas, ritmos e melodias. É descobrir possibilidades, despertar talentos e construir memórias que acompanham uma criança por toda a vida.`,
  "Com uma trajetória fundamentada na excelência pedagógica, no cuidado e na sensibilidade, a Emes transforma cada aula em uma oportunidade de crescimento, expressão e descoberta.",
  "Aqui, cada pequeno avanço tem um significado imenso. Cada melodia aprendida representa uma conquista. Cada criança carrega dentro de si um universo de possibilidades esperando para florescer.",
  "E quando as luzes do teatro se acendem, algo extraordinário acontece: o aprendizado se transforma em emoção, a dedicação ganha voz e os sonhos encontram o palco.",
];

export function EmesChapter() {
  // Somente fotos com autorização de uso de imagem confirmada.
  const authorizedImages = gallery.filter((img) => img.imageUseAuthorized);

  return (
    <section id="emes" aria-labelledby="emes-title" className="relative isolate overflow-hidden py-24 sm:py-32">
      <Atmosphere variant="rose" className="-z-10" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="emes-title"
          chapter="Capítulo IV"
          eyebrow="A experiência Emes"
          title={
            <>
              <span className="text-gold">EMES</span> — Há {event.yearsOfHistory} anos transformando
              música em <span className="italic">histórias que emocionam.</span>
            </>
          }
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="space-y-6 text-lg leading-[1.85] text-nevoa">
            {paragraphs.map((p) => (
              <Reveal key={p.slice(0, 24)}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="glass relative rounded-[2rem] p-8 sm:p-10">
              <Sparkle className="-top-3 right-10" />
              <span aria-hidden className="text-gold font-display text-7xl leading-none">“</span>
              <div className="-mt-4 space-y-5 text-lg leading-relaxed text-nevoa">
                <p className="font-display text-2xl text-creme">
                  O Kids Fest Emes 2026 é a celebração dessa jornada.
                </p>
                <p>
                  Mais do que um espetáculo musical, é o encontro entre a dedicação dos professores,
                  a coragem dos pequenos artistas e o orgulho de famílias que acompanham cada passo
                  dessa história.
                </p>
                <p>
                  Porque, na Emes, não formamos apenas músicos. Ajudamos a desenvolver pessoas mais
                  sensíveis, confiantes e capazes de expressar ao mundo aquilo que existe de mais
                  bonito dentro delas.
                </p>
              </div>
              <p className="mt-8 border-t border-ouro/20 pt-6 font-display text-xl text-ouro italic">
                EMES — Onde a música começa, a emoção permanece.
              </p>
            </div>
          </Reveal>
        </div>

        <GoldDivider className="my-24" />

        <div id="galeria" className="scroll-mt-24">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow">Galeria</p>
            <h3 className="font-display mx-auto mt-4 max-w-3xl text-3xl leading-tight font-semibold text-creme sm:text-4xl">
              Momentos que já emocionaram.{" "}
              <span className="text-aurora italic">Histórias que continuam sendo escritas.</span>
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <Gallery images={authorizedImages} />
          </Reveal>
        </div>

        <GoldDivider className="my-24" />

        <Sponsors />
      </div>
    </section>
  );
}
