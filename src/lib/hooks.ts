"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { motionValue, type MotionValue } from "framer-motion";

import { clamp } from "./utils";

type Mode = "pin" | "viewport";

/**
 * Tracks 0..1 scroll progress through a section.
 *
 *  mode="pin"  (default) — Framer Motion equivalent of
 *      `offset: ['start start', 'end end']`. Progress is 0 when the
 *      section's top reaches the viewport top, and 1 when the
 *      section's bottom reaches the viewport bottom. Used for
 *      sticky-pinned sections.
 *
 *  mode="viewport" — equivalent of
 *      `offset: ['start end', 'end start']`. Progress is 0 when the
 *      section's top is at the viewport bottom (just entering), and
 *      1 when the section's bottom is at the viewport top
 *      (just leaving).
 *
 * Implemented with a manual rAF loop reading scrollY +
 * el.getBoundingClientRect() so it stays in sync regardless of
 * which scroll engine drives scrollY (native, Lenis, etc.).
 */
export function useSectionProgress(
  ref: RefObject<HTMLElement>,
  mode: Mode = "pin",
): { progress: number; progressMV: MotionValue<number> } {
  const [progress, setProgress] = useState(0);
  const mvRef = useRef<MotionValue<number> | null>(null);
  if (mvRef.current === null) mvRef.current = motionValue(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let frame = 0;
    let last = -1;
    const mv = mvRef.current!;

    const tick = () => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        let p = 0;
        if (mode === "pin") {
          const total = rect.height - vh;
          const passed = -rect.top;
          p = total > 0 ? clamp(passed / total, 0, 1) : 0;
        } else {
          const total = vh + rect.height;
          const passed = vh - rect.top;
          p = total > 0 ? clamp(passed / total, 0, 1) : 0;
        }
        if (p !== last) {
          last = p;
          mv.set(p);
          // Quantize React state updates so we don't re-render every
          // frame. MotionValue still ticks smoothly for `useTransform`.
          setProgress((prev) => (Math.abs(prev - p) > 1 / 240 ? p : prev));
        }
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [ref, mode]);

  return { progress, progressMV: mvRef.current };
}
