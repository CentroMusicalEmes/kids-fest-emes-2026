import { Heart, Music, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { GoldDivider, SectionHeading } from "@/components/ui/SectionHeading";
import { Atmosphere, Sparkle } from "@/components/ui/StageBackdrop";

const cards = [
  {
    icon: Star,
    title: "O orgulho de ver seu filho brilhar",
    text: "Celebrar a coragem, a dedicação e a alegria de cada pequeno artista.",
    accent: "from-ouro/30",
  },
  {
    icon: Music,
    title: "A música como caminho de desenvolvimento",
    text: "Reconhecer as descobertas e conquistas musicais construídas ao longo das aulas.",
    accent: "from-azul/40",
  },
  {
    icon: Heart,
    title: "Uma memória para toda a família",
    text: "Compartilhar uma experiência especial entre gerações.",
    accent: "from-rosa/35",
  },
];

export function EmotionChapter() {
  return (
    <section
      id="emocao"
      aria-labelledby="emocao-title"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <Atmosphere variant="violet" className="-z-10" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="emocao-title"
          chapter="Capítulo II"
          eyebrow="A emoção de ver seu filho brilhar"
          title={
            <>
              Existem momentos que passam.{" "}
              <span className="text-gold italic">E existem momentos que permanecem para sempre.</span>
            </>
          }
        />

        <div className="relative mx-auto mt-16 max-w-2xl space-y-7 text-center text-lg leading-[1.85] text-nevoa sm:text-xl">
          <Sparkle className="-top-6 -left-2 sm:-left-16" delay="0.8s" />
          <Reveal>
            <p>
              Imagine as luzes do teatro se acendendo.
              <br />
              O palco ganha vida.
              <br />
              E, entre tantas emoções, seus olhos encontram alguém muito especial.
            </p>
          </Reveal>
          <Reveal>
            <p className="font-display text-4xl font-semibold text-creme italic sm:text-5xl">
              Seu filho.
            </p>
          </Reveal>
          <Reveal>
            <p>
              Aquela criança que começou descobrindo os primeiros sons, experimentando ritmos e
              aprendendo a transformar pequenas notas em grandes conquistas.
            </p>
          </Reveal>
          <Reveal>
            <p>
              Agora, diante de uma plateia, cada gesto carrega uma história. Cada melodia
              representa dedicação, aprendizado, coragem e crescimento.
            </p>
          </Reveal>
          <Reveal>
            <p className="font-display text-2xl leading-snug text-creme sm:text-3xl">
              Para quem está no palco, é uma apresentação.
              <br />
              <span className="text-gold italic">Para quem está na plateia, é muito mais.</span>
            </p>
          </Reveal>
          <Reveal>
            <p>
              É orgulho. É emoção. É a realização de ver alguém tão especial descobrindo o próprio
              brilho.
            </p>
          </Reveal>
          <Reveal>
            <p>
              O Kids Fest Emes 2026 nasce para celebrar exatamente isso: a beleza de cada conquista
              e a alegria de compartilhar com a família um momento que merece ser lembrado para
              sempre.
            </p>
          </Reveal>
          <Reveal>
            <p className="text-creme">
              Porque cada conquista merece ser celebrada. E algumas memórias merecem um lugar
              eterno no coração.
            </p>
          </Reveal>
        </div>

        <GoldDivider className="my-20" />

        <ul className="grid gap-5 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, text, accent }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.12} className="h-full">
                <article className="glass group relative h-full overflow-hidden rounded-3xl p-7 transition duration-500 hover:-translate-y-1 hover:border-ouro/35 sm:p-8">
                  <div
                    aria-hidden
                    className={`absolute -top-24 -right-24 size-56 rounded-full bg-gradient-to-br ${accent} to-transparent blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-60`}
                  />
                  <span className="relative inline-flex size-14 items-center justify-center rounded-2xl border border-ouro/30 bg-ouro/10 text-ouro">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <h3 className="relative mt-6 font-display text-2xl leading-snug font-semibold text-creme">
                    {title}
                  </h3>
                  <p className="relative mt-3 leading-relaxed text-nevoa">{text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-20 text-center">
          <p className="font-display mx-auto max-w-3xl text-3xl leading-tight font-semibold text-creme sm:text-4xl">
            Mais do que assistir a um espetáculo.{" "}
            <span className="text-aurora italic">É fazer parte de uma conquista.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
