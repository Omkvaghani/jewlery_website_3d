"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SectionHeading from "@/components/ui/SectionHeading";

const ProductViewer = dynamic(
  () => import("@/components/three/ProductViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full w-full place-items-center text-foreground/40">
        Loading viewer…
      </div>
    ),
  },
);

type Product = {
  id: string;
  name: string;
  collection: string;
  price: string;
  swatch: "gold" | "platinum";
  shape: "brilliant" | "emerald" | "marquise" | "pear";
};

const PRODUCTS: Product[] = [
  {
    id: "lumina",
    name: "Lumina Solitaire",
    collection: "Eternel · 1.42ct",
    price: "$12,800",
    swatch: "platinum",
    shape: "brilliant",
  },
  {
    id: "sable",
    name: "Sable Halo",
    collection: "Aurora · 0.96ct",
    price: "$8,400",
    swatch: "gold",
    shape: "brilliant",
  },
  {
    id: "vesper",
    name: "Vesper Trinity",
    collection: "Nocturne · 1.10ct",
    price: "$15,600",
    swatch: "platinum",
    shape: "marquise",
  },
  {
    id: "celeste",
    name: "Celeste Pavé",
    collection: "Aurora · 0.78ct",
    price: "$6,950",
    swatch: "gold",
    shape: "pear",
  },
  {
    id: "noir",
    name: "Noir Emerald",
    collection: "Eternel · 2.04ct",
    price: "$22,400",
    swatch: "platinum",
    shape: "emerald",
  },
  {
    id: "auriel",
    name: "Auriel Crown",
    collection: "Nocturne · 1.30ct",
    price: "$17,900",
    swatch: "gold",
    shape: "brilliant",
  },
];

export default function Products() {
  const [open, setOpen] = useState<Product | null>(null);

  return (
    <section
      id="collection"
      className="relative bg-background py-28 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="The Collection"
            title="Six pieces, <em class='not-italic gold-text'>each a confession</em>."
            description="Every silhouette is hand-finished in our atelier and offered in a single, numbered edition."
          />
          <a
            href="#"
            className="text-[11px] uppercase tracking-widest2 text-foreground/60 hover:text-foreground"
            data-cursor="hover"
          >
            View Full Archive →
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onOpen={() => setOpen(p)} />
          ))}
        </div>
      </div>

      {/* Modal viewer */}
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
          onClick={() => setOpen(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative grid w-full max-w-5xl grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-white/10 bg-ink-800 md:grid-cols-2"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/15 text-foreground/70 transition-colors hover:border-gold-300 hover:text-foreground"
              data-cursor="hover"
            >
              ✕
            </button>
            <div className="aspect-square h-full bg-ink-900">
              <ProductViewer material={open.swatch} shape={open.shape} />
            </div>
            <div className="flex flex-col gap-5 p-8 md:p-12">
              <span className="eyebrow">{open.collection}</span>
              <h3 className="font-serif text-3xl md:text-4xl">{open.name}</h3>
              <p className="text-sm leading-relaxed text-foreground/70">
                Drag the stone to explore every facet. A single drop of obsidian
                light, set in {open.swatch === "gold" ? "18k yellow gold" : "950 platinum"} and
                polished by hand to a mirror finish.
              </p>
              <div className="hairline my-2" />
              <div className="flex items-end justify-between">
                <span className="font-serif text-2xl text-foreground">{open.price}</span>
                <span className="eyebrow">Edition 1 / 1</span>
              </div>
              <div className="mt-3 flex gap-3">
                <button
                  className="rounded-full bg-gradient-gold px-6 py-3 text-[11px] uppercase tracking-widest2 text-ink-900"
                  data-cursor="hover"
                >
                  Reserve a Viewing
                </button>
                <button
                  className="rounded-full border border-white/15 px-6 py-3 text-[11px] uppercase tracking-widest2 text-foreground/80 hover:border-gold-300"
                  data-cursor="hover"
                >
                  Save to Suite
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ProductCard({
  product,
  index,
  onOpen,
}: {
  product: Product;
  index: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const swatchClass =
    product.swatch === "gold"
      ? "from-[#fff1c0] via-[#e9b75c] to-[#7d5921]"
      : "from-[#ffffff] via-[#c7ccd5] to-[#7e8390]";

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onOpen}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/8 bg-ink-800/50 p-6 text-left preserve-3d will-change-transform"
      style={{
        transform:
          "perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
        transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
      data-cursor="hover"
    >
      {/* light reflection */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px 220px at var(--mx,50%) var(--my,50%), rgba(255,231,180,0.18), transparent 60%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* metallic visual block */}
      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2">
        <div
          className={`relative mx-auto aspect-square w-3/5 rounded-full bg-gradient-to-br ${swatchClass} shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]`}
        >
          <div className="absolute inset-[10%] rounded-full bg-ink-800" />
          <div className="absolute left-1/2 top-1/2 h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2">
            <FacetIcon shape={product.shape} />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex w-full flex-col justify-between">
        <div>
          <span className="eyebrow">{product.collection}</span>
          <h3 className="mt-2 font-serif text-2xl text-foreground md:text-[26px]">
            {product.name}
          </h3>
        </div>
        <div className="mt-auto flex w-full items-end justify-between">
          <span className="font-serif text-xl text-foreground/85">
            {product.price}
          </span>
          <span className="eyebrow text-foreground/60 transition-colors group-hover:text-gold-300">
            View 360° →
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function FacetIcon({ shape }: { shape: Product["shape"] }) {
  const fill = "white";
  const opacity = 0.95;
  switch (shape) {
    case "emerald":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
          <path
            d="M20 30 L30 15 L70 15 L80 30 L80 70 L70 85 L30 85 L20 70 Z"
            fill={fill}
            opacity={opacity}
          />
          <path d="M30 15 L80 70" stroke="rgba(0,0,0,0.2)" />
        </svg>
      );
    case "marquise":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
          <path
            d="M50 5 Q80 50 50 95 Q20 50 50 5 Z"
            fill={fill}
            opacity={opacity}
          />
        </svg>
      );
    case "pear":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
          <path
            d="M50 5 Q90 35 80 70 Q70 95 50 95 Q30 95 20 70 Q10 35 50 5 Z"
            fill={fill}
            opacity={opacity}
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
          <path
            d="M50 5 L90 40 L70 95 L30 95 L10 40 Z"
            fill={fill}
            opacity={opacity}
          />
          <path d="M10 40 L90 40" stroke="rgba(0,0,0,0.2)" />
        </svg>
      );
  }
}
