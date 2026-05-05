"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform } from "framer-motion";
import { useSectionProgress } from "@/lib/hooks";

const STAGES = [
  {
    no: "01",
    title: "Origin",
    detail:
      "Two billion years beneath the earth — carbon, pressure, and patience. We do not invent the diamond. We listen for it.",
    fg: "Coal & Stone",
    palette: "from-[#1a1612] via-[#2a221b] to-[#0f0c09]",
    accent: "rgba(180,120,60,0.25)",
  },
  {
    no: "02",
    title: "Extraction",
    detail:
      "A single fracture reveals the heart inside the rough. We hand-select 1 stone in 10,000.",
    fg: "Rough Crystal",
    palette: "from-[#13140f] via-[#22231a] to-[#0a0a07]",
    accent: "rgba(220,180,90,0.25)",
  },
  {
    no: "03",
    title: "Refinement",
    detail:
      "Lasers and master-cutters work to thousandths of a millimeter. Sparks become facets.",
    fg: "Cutting Laser",
    palette: "from-[#0e1418] via-[#16242c] to-[#070a0c]",
    accent: "rgba(120,200,255,0.3)",
  },
  {
    no: "04",
    title: "Structuring",
    detail:
      "Fifty-eight planes are mapped in CAD, then carved by hand until math becomes light.",
    fg: "Wireframe",
    palette: "from-[#11141a] via-[#1c2030] to-[#080a0e]",
    accent: "rgba(180,200,255,0.3)",
  },
  {
    no: "05",
    title: "Polishing",
    detail:
      "Three days of rotating discs and powders distilled from older diamonds. Surface becomes mirror.",
    fg: "Mirror Polish",
    palette: "from-[#1a1812] via-[#2c281d] to-[#0c0a07]",
    accent: "rgba(255,225,170,0.3)",
  },
  {
    no: "06",
    title: "Perfection",
    detail:
      "What was buried is now luminous — clear enough to hold every promise made over it.",
    fg: "Final Stone",
    palette: "from-[#f6f1e6] via-[#e9dfc6] to-[#fff8e8]",
    accent: "rgba(255,231,180,0.6)",
    invertText: true,
  },
];

export default function Craftsmanship() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { progress, progressMV } = useSectionProgress(sectionRef);

  // Background parallax layers
  const bgY = useTransform(progressMV, [0, 1], ["0%", "-30%"]);
  const midY = useTransform(progressMV, [0, 1], ["0%", "-50%"]);
  const fgY = useTransform(progressMV, [0, 1], ["0%", "-70%"]);

  useEffect(() => {
    const idx = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length));
    setActive(idx);
  }, [progress]);

  const stage = STAGES[active];

  return (
    <section
      id="craft"
      ref={sectionRef}
      className="relative h-[600vh] w-full"
      data-theme={stage.invertText ? "light" : undefined}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Background layer */}
        <motion.div
          aria-hidden
          style={{ y: bgY }}
          className={`absolute inset-0 -z-30 bg-gradient-to-b ${stage.palette} transition-colors duration-700`}
        />
        {/* Particle midground */}
        <motion.div
          aria-hidden
          style={{ y: midY }}
          className="absolute inset-0 -z-20 transition-opacity duration-700"
        >
          <Particles accent={stage.accent} />
        </motion.div>

        {/* Foreground vignette */}
        <motion.div
          aria-hidden
          style={{ y: fgY }}
          className="absolute inset-0 -z-10"
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(60% 50% at 50% 50%, ${stage.accent}, transparent 70%)`,
            }}
          />
        </motion.div>

        {/* Content */}
        <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col items-start justify-center px-6">
          <span
            className={`eyebrow transition-colors ${stage.invertText ? "!text-black/60" : ""}`}
          >
            Craftsmanship · Stage {stage.no} of 06
          </span>

          <motion.h2
            key={stage.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`mt-4 font-serif text-6xl leading-[1.0] tracking-tight md:text-[120px] ${
              stage.invertText ? "text-ink-900" : "text-foreground"
            }`}
          >
            {stage.title}
          </motion.h2>

          <motion.p
            key={`d-${stage.title}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`mt-6 max-w-xl text-balance text-base leading-relaxed md:text-lg ${
              stage.invertText ? "text-ink-700" : "text-foreground/70"
            }`}
          >
            {stage.detail}
          </motion.p>

          {/* Progress timeline */}
          <div className="absolute bottom-12 left-6 right-6 flex items-center gap-2 md:bottom-16">
            {STAGES.map((_, i) => (
              <span
                key={i}
                className={`h-px flex-1 transition-all duration-700 ${
                  i === active
                    ? stage.invertText
                      ? "bg-ink-900"
                      : "bg-gold-300"
                    : i < active
                      ? stage.invertText
                        ? "bg-ink-900/40"
                        : "bg-foreground/40"
                      : stage.invertText
                        ? "bg-ink-900/15"
                        : "bg-foreground/15"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Particles({ accent }: { accent: string }) {
  const dots = Array.from({ length: 60 });
  return (
    <div className="absolute inset-0 overflow-hidden">
      {dots.map((_, i) => {
        const top = (i * 53) % 100;
        const left = (i * 37) % 100;
        const size = ((i % 5) + 1) * 1.2;
        const dur = 6 + (i % 5) * 2;
        const delay = (i % 7) * 0.4;
        return (
          <span
            key={i}
            className="absolute block rounded-full"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              background: accent,
              boxShadow: `0 0 ${size * 4}px ${accent}`,
              animation: `floaty ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
