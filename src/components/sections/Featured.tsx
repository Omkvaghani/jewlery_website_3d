"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const RingScene = dynamic(() => import("@/components/three/RingScene"), {
  ssr: false,
});

const FEATURES = [
  {
    label: "F/VS1 Clarity",
    detail: "58 facets cut to within 0.001mm tolerance",
    pos: { top: "18%", left: "62%" },
  },
  {
    label: "950 Platinum",
    detail: "Hand-polished by master Émile L. (Atelier '08)",
    pos: { top: "58%", left: "22%" },
  },
  {
    label: "Eternel Setting",
    detail: "Six prongs · invisible bezel · 0.95g",
    pos: { top: "72%", left: "70%" },
  },
];

export default function Featured() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.45);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map scroll into the ring scene's later-half (polished + connection-ish)
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      // Hold around polish phase (0.55..0.78) so the finished ring is the centerpiece.
      setProgress(0.55 + v * 0.22);
    });
    return () => unsub();
  }, [scrollYProgress]);

  const titleY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="featured"
      ref={ref}
      className="relative overflow-hidden bg-ink-900 py-32 md:py-44"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-2 md:gap-6">
        <motion.div
          style={{ y: titleY }}
          className="flex flex-col justify-center"
        >
          <span className="eyebrow">Atelier · The Eternel</span>
          <h2 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl">
            One stone. <span className="gold-text italic">A lifetime</span>{" "}
            of refraction.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-foreground/70">
            The Eternel is our flagship. A single 1.42-carat brilliant set in 950
            platinum and engineered to throw colour at the slightest tilt of the
            hand. Examine each facet by scrolling.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-start gap-4 rounded-xl glass p-4"
              >
                <span className="mt-[5px] block h-1 w-6 bg-gradient-gold" />
                <div>
                  <div className="font-serif text-lg text-foreground">
                    {f.label}
                  </div>
                  <div className="text-sm text-foreground/60">{f.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-800">
          <RingScene progress={progress} />

          {/* Floating UI labels */}
          {FEATURES.map((f, i) => (
            <motion.div
              key={`label-${f.label}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: 0.3 + i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="pointer-events-none absolute"
              style={{ top: f.pos.top, left: f.pos.left }}
            >
              <div className="flex items-center gap-2">
                <span className="block h-2 w-2 rounded-full bg-gold-300 shadow-[0_0_12px_rgba(233,183,92,0.7)]" />
                <span className="block h-px w-12 bg-gradient-to-r from-gold-300 to-transparent" />
                <span className="rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest2 text-foreground/85">
                  {f.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
