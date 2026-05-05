"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#story", label: "The Story" },
  { href: "#collection", label: "Collection" },
  { href: "#craft", label: "Craftsmanship" },
  { href: "#featured", label: "Atelier" },
  { href: "#voices", label: "Voices" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "py-3 backdrop-blur-md"
          : "py-6 backdrop-blur-0",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-6 transition-colors duration-500",
          scrolled
            ? "border-b border-white/5 bg-background/40"
            : "border-b border-transparent",
        )}
      >
        <a
          href="#top"
          className="font-serif text-xl tracking-[0.2em] text-foreground"
          data-cursor="hover"
        >
          LUMI<span className="text-gold-300">È</span>RE
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[11px] uppercase tracking-widest2 text-foreground/70 transition-colors hover:text-foreground"
              data-cursor="hover"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#footer"
          className="hidden rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-widest2 text-foreground/80 transition-colors hover:border-gold-300 hover:text-foreground md:inline-flex"
          data-cursor="hover"
        >
          Book a Visit
        </a>
      </div>
    </header>
  );
}
