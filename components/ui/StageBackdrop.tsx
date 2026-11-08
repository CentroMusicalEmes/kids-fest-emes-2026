import { cn } from "@/lib/utils";

/** Gerador pseudoaleatório determinístico: mesmo resultado no servidor e no cliente. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function makeParticles(count: number, seed: number) {
  const rand = seeded(seed);
  return Array.from({ length: count }, (_, i) => {
    const size = 2 + rand() * 4;
    return {
      id: i,
      left: `${(rand() * 100).toFixed(2)}%`,
      top: `${(60 + rand() * 50).toFixed(2)}%`,
      size: `${size.toFixed(1)}px`,
      dur: `${(12 + rand() * 16).toFixed(1)}s`,
      delay: `-${(rand() * 20).toFixed(1)}s`,
      drift: `${((rand() - 0.5) * 120).toFixed(0)}px`,
    };
  });
}

export function Particles({
  count = 28,
  seed = 7,
  className,
}: {
  count?: number;
  seed?: number;
  className?: string;
}) {
  const particles = makeParticles(count, seed);
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={
            {
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              "--dur": p.dur,
              "--delay": p.delay,
              "--drift": p.drift,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Estrela de quatro pontas usada como brilho delicado. */
export function Sparkle({
  className,
  delay = "0s",
  size = 18,
}: {
  className?: string;
  delay?: string;
  size?: number;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("sparkle absolute text-ouro", className)}
      style={{ "--delay": delay } as React.CSSProperties}
    >
      <path
        fill="currentColor"
        d="M12 0c.6 5.6 2.4 9 7 11-4.6 1-6.4 4.4-7 13-.6-8.6-2.4-12-7-13 4.6-2 6.4-5.4 7-11Z"
      />
    </svg>
  );
}

/** Feixes de luz de palco em roxo, azul e rosa. */
export function Spotlights({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="spotlight left-[-12%]"
        style={
          {
            background: "linear-gradient(to bottom, rgb(82 101 216 / 0.9), transparent 75%)",
            "--from": "-22deg",
            "--to": "-4deg",
          } as React.CSSProperties
        }
      />
      <div
        className="spotlight left-[28%]"
        style={
          {
            background: "linear-gradient(to bottom, rgb(248 217 139 / 0.75), transparent 70%)",
            "--from": "-6deg",
            "--to": "8deg",
            animationDuration: "14s",
          } as React.CSSProperties
        }
      />
      <div
        className="spotlight right-[-12%]"
        style={
          {
            background: "linear-gradient(to bottom, rgb(244 139 203 / 0.85), transparent 75%)",
            "--from": "20deg",
            "--to": "4deg",
            animationDuration: "12s",
          } as React.CSSProperties
        }
      />
    </div>
  );
}

/** Cortinas de teatro em SVG, com dobras e acabamento dourado. */
export function Curtains() {
  const folds = [0, 1, 2, 3, 4, 5];
  const side = (flip: boolean) => {
    const sfx = flip ? "r" : "l";
    return (
    <svg
      viewBox="0 0 300 1000"
      preserveAspectRatio="none"
      className={cn(
        "absolute top-0 h-full w-[30vw] max-w-[360px] min-w-[90px]",
        flip ? "right-0 -scale-x-100 curtain-open-right" : "left-0 curtain-open-left",
      )}
    >
      <defs>
        <linearGradient id={`fold-${sfx}`} x1="0" x2="1">
          <stop offset="0" stopColor="#12052b" />
          <stop offset="0.45" stopColor="#4a1d7e" />
          <stop offset="0.6" stopColor="#5b2690" />
          <stop offset="1" stopColor="#170735" />
        </linearGradient>
        <linearGradient id={`fade-${sfx}`} x1="0" x2="1">
          <stop offset="0.55" stopColor="#0c0420" stopOpacity="0" />
          <stop offset="1" stopColor="#0c0420" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {folds.map((i) => (
        <path
          key={i}
          d={`M${i * 46} 0 h50 C ${i * 46 + 60} 400 ${i * 46 + 30 + i * 6} 700 ${i * 46 + 64 + i * 10} 1000 H ${i * 46 - 4} C ${i * 46 + 6} 700 ${i * 46 - 8} 400 ${i * 46} 0Z`}
          fill={`url(#fold-${sfx})`}
          opacity={1 - i * 0.08}
        />
      ))}
      <rect width="300" height="1000" fill={`url(#fade-${sfx})`} />
    </svg>
    );
  };

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-80">
      {side(false)}
      {side(true)}
      {/* bambinela (sanefa) superior */}
      <svg viewBox="0 0 1200 90" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-28 w-full lg:h-36">
        <defs>
          <linearGradient id="valance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b0838" />
            <stop offset="1" stopColor="#3d1d73" />
          </linearGradient>
        </defs>
        <path
          d="M0 0h1200v52c-50 0-50 30-100 30s-50-30-100-30-50 30-100 30-50-30-100-30-50 30-100 30-50-30-100-30-50 30-100 30-50-30-100-30-50 30-100 30-50-30-100-30-50 30-100 30S50 52 0 52Z"
          fill="url(#valance)"
        />
        <path
          d="M0 52c50 0 50 30 100 30s50-30 100-30 50 30 100 30 50-30 100-30 50 30 100 30 50-30 100-30 50 30 100 30 50-30 100-30 50 30 100 30 50-30 100-30 50 30 100 30 50-30 100-30"
          fill="none"
          stroke="#f8d98b"
          strokeOpacity="0.55"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

/** Fundo atmosférico reutilizável para as seções. */
export function Atmosphere({
  variant = "violet",
  className,
}: {
  variant?: "violet" | "blue" | "rose" | "gold";
  className?: string;
}) {
  const palettes = {
    violet:
      "radial-gradient(60% 50% at 20% 10%, rgb(82 101 216 / 0.22), transparent 70%), radial-gradient(50% 40% at 85% 30%, rgb(244 139 203 / 0.16), transparent 70%)",
    blue: "radial-gradient(55% 45% at 80% 15%, rgb(82 101 216 / 0.28), transparent 70%), radial-gradient(45% 40% at 10% 80%, rgb(48 20 92 / 0.8), transparent 70%)",
    rose: "radial-gradient(55% 45% at 15% 20%, rgb(244 139 203 / 0.2), transparent 70%), radial-gradient(50% 40% at 90% 80%, rgb(82 101 216 / 0.2), transparent 70%)",
    gold: "radial-gradient(50% 45% at 50% 0%, rgb(248 217 139 / 0.18), transparent 70%), radial-gradient(60% 50% at 50% 100%, rgb(244 139 203 / 0.14), transparent 70%)",
  } as const;
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ background: palettes[variant] }}
    />
  );
}
