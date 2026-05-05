"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";

const NAV = [
  {
    title: "Maison",
    links: ["The Atelier", "Craftsmanship", "Heritage", "Sustainability"],
  },
  {
    title: "Collections",
    links: ["Eternel", "Aurora", "Nocturne", "Bespoke"],
  },
  {
    title: "Service",
    links: ["Book a Visit", "Resize & Repair", "Concierge", "Contact"],
  },
];

const SOCIAL = ["Instagram", "Pinterest", "YouTube"];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setTimeout(() => {
      setEmail("");
      setSent(false);
    }, 2400);
  };

  return (
    <footer
      id="footer"
      className="relative overflow-hidden bg-ink-900 pb-12 pt-28"
    >
      {/* Soft parallax glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{
          background:
            "radial-gradient(60% 60% at 20% 0%, rgba(233,183,92,0.15), transparent 60%), radial-gradient(60% 80% at 80% 100%, rgba(126,131,144,0.18), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <span className="font-serif text-3xl tracking-[0.18em] text-foreground">
              LUMI<span className="text-gold-300">È</span>RE
            </span>
            <p className="mt-6 max-w-md text-base leading-relaxed text-foreground/70">
              Receive our quiet dispatch — three letters a year. New pieces, the
              hands behind them, and the stories we are slow enough to keep.
            </p>

            <form
              onSubmit={submit}
              className="relative mt-8 flex max-w-md items-center"
            >
              <div className="relative w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@quietness.com"
                  className="peer w-full rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 pr-36 text-sm text-foreground placeholder:text-foreground/40 focus:border-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-300/30"
                  data-cursor="hover"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 peer-focus:opacity-100"
                  style={{
                    boxShadow:
                      "0 0 0 1px rgba(233,183,92,0.3), 0 0 30px rgba(233,183,92,0.25)",
                  }}
                />
              </div>
              <MagneticButton
                type="submit"
                variant="gold"
                strength={0.25}
                className="absolute right-1 top-1/2 -translate-y-1/2 px-5 py-2 text-[10px]"
              >
                {sent ? "Thank you" : "Subscribe"}
              </MagneticButton>
            </form>

            <div className="mt-10 flex gap-5">
              {SOCIAL.map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-[11px] uppercase tracking-widest2 text-foreground/55 transition-colors hover:text-foreground"
                  data-cursor="hover"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {NAV.map((col, idx) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="md:col-span-2"
            >
              <h3 className="eyebrow">{col.title}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                      data-cursor="hover"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <div className="md:col-span-1 md:text-right">
            <span className="eyebrow">Atelier</span>
            <p className="mt-5 text-sm leading-relaxed text-foreground/60">
              7 Rue de la Paix
              <br />
              Paris, 75002
            </p>
          </div>
        </div>

        <div className="hairline mt-20" />

        <div className="mt-6 flex flex-col items-start justify-between gap-3 text-[11px] uppercase tracking-widest2 text-foreground/45 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Lumière Atelier</span>
          <span>Crafted with patience</span>
          <div className="flex gap-5">
            <a href="#" data-cursor="hover" className="hover:text-foreground/80">
              Privacy
            </a>
            <a href="#" data-cursor="hover" className="hover:text-foreground/80">
              Terms
            </a>
            <a href="#" data-cursor="hover" className="hover:text-foreground/80">
              Imprint
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
