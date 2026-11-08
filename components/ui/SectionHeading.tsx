import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  chapter?: string;
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  id?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  chapter,
  eyebrow,
  title,
  subtitle,
  id,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "mx-auto items-center text-center" : "items-start text-left",
        "max-w-3xl",
        className,
      )}
    >
      {(chapter || eyebrow) && (
        <p className="eyebrow flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-ouro/70" />
          {chapter && <span>{chapter}</span>}
          {chapter && eyebrow && <span aria-hidden>·</span>}
          {eyebrow && <span>{eyebrow}</span>}
          <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-ouro/70" />
        </p>
      )}
      <h2
        id={id}
        className="font-display text-[2rem] leading-[1.12] font-semibold text-creme sm:text-5xl lg:text-[3.4rem]"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-base leading-relaxed text-nevoa sm:text-lg">{subtitle}</p>
      )}
    </Reveal>
  );
}

export function GoldDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center justify-center gap-3", className)}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-ouro/60 sm:w-28" />
      <svg viewBox="0 0 24 24" width="14" height="14" className="text-ouro">
        <path
          fill="currentColor"
          d="M12 0c.6 5.6 2.4 9 7 11-4.6 1-6.4 4.4-7 13-.6-8.6-2.4-12-7-13 4.6-2 6.4-5.4 7-11Z"
        />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-ouro/60 sm:w-28" />
    </div>
  );
}
