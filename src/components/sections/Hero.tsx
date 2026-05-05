"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useTransform } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { useSectionProgress } from "@/lib/hooks";

const RingScene = dynamic(() => import("@/components/three/RingScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-2 w-2 animate-pulse rounded-full bg-gold-200" />
    </div>
  ),
});

const phaseLabels = [
  { id: 1, label: "Diamond Emergence" },
  { id: 2, label: "Metal Formation" },
  { id: 3, label: "Diamond Setting" },
  { id: 4, label: "Final Polish" },
  { id: 5, label: "Human Connection" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  const { progress, progressMV } = useSectionProgress(sectionRef);

  // Headline opacity follows scroll
  const headOpacity = useTransform(progressMV, [0, 0.18, 0.85, 1], [
    1, 0.95, 0.0, 0.0,
  ]);
  const subOpacity = useTransform(progressMV, [0, 0.12, 0.7, 1], [
    1, 0.9, 0.0, 0.0,
  ]);
  const ctaY = useTransform(progressMV, [0, 1], [0, -120]);

  useEffect(() => {
    // Use the static poster on tablets and phones (≤1024px) and when the
    // user prefers reduced motion or the device looks under-powered. This
    // keeps the page durable on cheap laptops and integrated GPUs without
    // sacrificing the cinematic feel on capable hardware.
    const w = window.matchMedia("(max-width: 1024px)");
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    type NavWithMem = Navigator & { deviceMemory?: number };
    // Treat a device as "weak" only if it is genuinely tiny: 1GB RAM or
    // 1 logical core. The optimized canvas (no transmission shader, no
    // HDR env, ~80 particles, adaptive DPR) runs comfortably on a 2-core
    // 4GB integrated GPU.
    const lowMem =
      typeof navigator !== "undefined" &&
      typeof (navigator as NavWithMem).deviceMemory === "number" &&
      ((navigator as NavWithMem).deviceMemory ?? 8) < 2;
    const lowCpu =
      typeof navigator !== "undefined" &&
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency < 2;
    const update = () => {
      setMobile(w.matches || lowMem || lowCpu);
      setReducedMotion(m.matches);
    };
    update();
    w.addEventListener("change", update);
    m.addEventListener("change", update);
    return () => {
      w.removeEventListener("change", update);
      m.removeEventListener("change", update);
    };
  }, []);

  // Mount the heavy Canvas only when the hero section is actually in the
  // viewport. With our 500vh sticky-pin section this is true on initial
  // load anyway, but if a user lands deep-linked further down the page we
  // skip the cost entirely.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setCanvasReady(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCanvasReady(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const idx = Math.min(4, Math.floor(progress / 0.2));
    setActivePhase(idx);
  }, [progress]);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative h-[500vh] w-full"
    >
      {/* Pinned 3D viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Soft cinematic spotlight backdrop */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden
          style={{
            background:
              "radial-gradient(60% 50% at 50% 35%, rgba(255,231,180,0.18), rgba(0,0,0,0) 70%), radial-gradient(120% 80% at 50% 100%, rgba(0,0,0,0.4), rgba(0,0,0,0) 70%)",
          }}
        />

        {/* 3D Canvas (desktop) — replaced with poster gradient on mobile,
            low-memory devices, and when the user prefers reduced motion. */}
        <div className="absolute inset-0">
          {!mobile && !reducedMotion && canvasReady ? (
            <RingScene progress={progress} />
          ) : (
            <MobileFallback />
          )}
        </div>

        {/* Vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle at 50% 60%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* Foreground copy */}
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex-1" />
          <motion.div
            style={{ opacity: headOpacity }}
            className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center"
          >
            <span className="eyebrow">A Diamond Becomes Emotion</span>
            <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-tight md:text-7xl lg:text-[88px]">
              Where light learns
              <br />
              to be <span className="gold-text italic">remembered</span>.
            </h1>
            <motion.p
              style={{ opacity: subOpacity }}
              className="mt-6 max-w-xl text-balance text-base text-foreground/70 md:text-lg"
            >
              Scroll to follow a single stone from raw crystal to a forever-worn ring.
              Every moment of the journey is rendered in real time.
            </motion.p>
            <motion.div style={{ y: ctaY }} className="mt-8 flex gap-3">
              <MagneticButton variant="gold">Begin the journey</MagneticButton>
              <MagneticButton variant="ghost">Discover collection</MagneticButton>
            </motion.div>
          </motion.div>

          <div className="flex-1" />

          {/* Phase indicator */}
          <div className="pointer-events-none absolute bottom-10 left-0 right-0 z-10 mx-auto flex max-w-7xl items-center justify-between px-6">
            <div className="hidden items-center gap-3 text-[10px] uppercase tracking-widest2 text-foreground/55 md:flex">
              <span className="block h-px w-10 bg-foreground/30" />
              Scroll · Story unfolds
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              {phaseLabels.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2">
                  <span
                    className={`block h-px transition-all duration-700 ${
                      i === activePhase
                        ? "w-12 bg-gold-300"
                        : i < activePhase
                          ? "w-8 bg-foreground/40"
                          : "w-6 bg-foreground/15"
                    }`}
                  />
                  <span
                    className={`hidden text-[10px] uppercase tracking-widest2 transition-colors lg:inline ${
                      i === activePhase
                        ? "text-foreground/90"
                        : "text-foreground/40"
                    }`}
                  >
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileFallback() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900" />
      <div
        className="absolute inset-0 animate-floaty bg-radial-spotlight"
        style={{ filter: "blur(12px)" }}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="h-44 w-44 rotate-45 animate-floaty bg-gradient-platinum opacity-90"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)",
            filter: "drop-shadow(0 0 40px rgba(255,231,180,0.5))",
          }}
        />
      </div>
    </div>
  );
}
