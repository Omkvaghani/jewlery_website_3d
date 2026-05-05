"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

const ITEMS: Testimonial[] = [
  {
    quote:
      "I have worn many beautiful things. Only Lumière taught me that a piece of jewelry can listen.",
    author: "Anaïs M.",
    role: "Patron · Paris",
  },
  {
    quote:
      "We came in for a wedding band and left with a story. They asked the right questions; the ring answered them.",
    author: "David & Yuki K.",
    role: "Tokyo · 2023",
  },
  {
    quote:
      "The detail is almost violent in its precision. Yet you wear it and it disappears into you.",
    author: "Sofia R.",
    role: "Vogue Italia",
  },
  {
    quote:
      "A house that does not chase trends. They simply make the future quietly, one stone at a time.",
    author: "Henrik V.",
    role: "Editor · LXR Journal",
  },
  {
    quote:
      "After three generations of family jewelers, we found someone we trusted with the heirlooms. Émile.",
    author: "The Castellani Family",
    role: "Milan",
  },
];

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState(0);

  // Auto-scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const interval = window.setInterval(() => {
      el.scrollBy({ left: 1, behavior: "auto" });
      // Loop gently when near the end
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
        el.scrollTo({ left: 0, behavior: "auto" });
      }
    }, 32);
    return () => window.clearInterval(interval);
  }, []);

  // Track center for depth shift
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      setCenter(el.scrollLeft + el.clientWidth / 2);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Drag to scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    const onDown = (e: PointerEvent) => {
      isDown = true;
      el.setPointerCapture(e.pointerId);
      startX = e.clientX;
      scrollLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      el.scrollLeft = scrollLeft - (e.clientX - startX);
    };
    const onUp = () => {
      isDown = false;
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <section
      id="voices"
      className="relative overflow-hidden bg-background py-28 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Voices"
          title="Spoken in soft <em class='not-italic gold-text'>rooms</em>."
          description="A small archive of those who have lived with our work."
          align="center"
        />
      </div>

      <div ref={containerRef} className="relative mt-16">
        <div
          ref={trackRef}
          className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto px-[20vw] py-12 perspective-1200"
          style={{ scrollBehavior: "auto" }}
          data-cursor="hover"
        >
          {[...ITEMS, ...ITEMS].map((t, i) => (
            <Card
              key={`${t.author}-${i}`}
              testimonial={t}
              index={i}
              centerPx={center}
              containerRef={trackRef}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({
  testimonial,
  centerPx,
  containerRef,
}: {
  testimonial: Testimonial;
  index: number;
  centerPx: number;
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({
    rotateY: 0,
    z: 0,
    opacity: 0.5,
  });

  useEffect(() => {
    const el = cardRef.current;
    const c = containerRef.current;
    if (!el || !c) return;
    const cardCenter = el.offsetLeft + el.offsetWidth / 2;
    const distance = cardCenter - centerPx;
    const ratio = Math.max(-1, Math.min(1, distance / (c.clientWidth * 0.5)));
    setTransform({
      rotateY: -ratio * 22,
      z: -Math.abs(ratio) * 220,
      opacity: 1 - Math.abs(ratio) * 0.35,
    });
  }, [centerPx, containerRef]);

  return (
    <motion.div
      ref={cardRef}
      className="relative w-[78vw] max-w-[420px] shrink-0 snap-center rounded-2xl glass p-8 md:w-[420px] md:p-10"
      style={{
        transform: `translateZ(${transform.z}px) rotateY(${transform.rotateY}deg)`,
        opacity: transform.opacity,
        transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.4s",
        transformStyle: "preserve-3d",
      }}
    >
      <span aria-hidden className="block font-serif text-5xl leading-none text-gold-300/70">
        “
      </span>
      <p className="mt-2 font-serif text-xl leading-snug text-foreground md:text-2xl">
        {testimonial.quote}
      </p>
      <div className="hairline my-6" />
      <div className="flex items-baseline justify-between">
        <span className="font-serif text-base text-foreground">
          {testimonial.author}
        </span>
        <span className="eyebrow">{testimonial.role}</span>
      </div>
    </motion.div>
  );
}
