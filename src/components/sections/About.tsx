"use client";

import { motion } from "framer-motion";

const lines = [
  "We do not make jewelry.",
  "We capture moments — slow, deliberate, irreplaceable —",
  "and bind them into stone and metal,",
  "so that one day you may hold an entire feeling",
  "in the palm of your hand.",
];

export default function About() {
  return (
    <section
      className="relative overflow-hidden bg-background py-32 md:py-48"
      aria-labelledby="about-heading"
    >
      {/* Soft blurred background suggestion */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          background:
            "radial-gradient(40% 50% at 20% 30%, rgba(233,183,92,0.25), transparent 70%), radial-gradient(40% 50% at 80% 70%, rgba(126,131,144,0.2), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="mx-auto max-w-5xl px-6">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow"
        >
          The Atelier
        </motion.span>

        <h2 id="about-heading" className="sr-only">
          Our Philosophy
        </h2>

        <div className="mt-8 space-y-3 font-serif text-3xl leading-[1.15] text-balance md:text-5xl lg:text-6xl">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 1.0,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={i === lines.length - 1 ? "italic gold-text" : ""}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="hairline mt-16"
        />

        <div className="mt-10 grid gap-10 text-foreground/70 md:grid-cols-3">
          <Stat label="Years of Craft" value="42" />
          <Stat label="Master Artisans" value="14" />
          <Stat label="Pieces Per Year" value="280" />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col gap-2"
    >
      <span className="font-serif text-5xl text-foreground gold-text">{value}</span>
      <span className="eyebrow">{label}</span>
    </motion.div>
  );
}
