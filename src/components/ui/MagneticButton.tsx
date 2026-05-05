"use client";

import {
  forwardRef,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "gold" | "ghost" | "platinum";
  strength?: number;
};

const MagneticButton = forwardRef<HTMLButtonElement, Props>(function MagneticButton(
  { children, className, variant = "gold", strength = 0.35, ...rest },
  forwardedRef,
) {
  const innerRef = useRef<HTMLButtonElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = innerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    const inner = el.querySelector<HTMLSpanElement>("[data-magnetic-inner]");
    if (inner) {
      inner.style.transform = `translate3d(${x * strength * 0.4}px, ${y * strength * 0.4}px, 0)`;
    }
  };

  const onLeave = () => {
    const el = innerRef.current;
    if (!el) return;
    el.style.transform = "translate3d(0,0,0)";
    const inner = el.querySelector<HTMLSpanElement>("[data-magnetic-inner]");
    if (inner) inner.style.transform = "translate3d(0,0,0)";
  };

  const variantClass =
    variant === "gold"
      ? "bg-gradient-gold text-ink-900 border-transparent shadow-glow"
      : variant === "platinum"
        ? "bg-gradient-platinum text-ink-900 border-transparent"
        : "bg-transparent text-foreground border-white/20 hover:border-gold-300";

  return (
    <button
      {...rest}
      ref={(node) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full border px-7 py-3 text-[12px] uppercase tracking-widest2 transition-[background,box-shadow,border-color] duration-300",
        "will-change-transform",
        variantClass,
        className,
      )}
      data-cursor="hover"
    >
      <span data-magnetic-inner className="block transition-transform duration-200">
        {children}
      </span>
    </button>
  );
});

export default MagneticButton;
