# Lumière

A cinematic, scroll-driven 3D luxury jewelry experience built with **Next.js
14**, **React Three Fiber**, **GSAP / Lenis**, and **Framer Motion**.

The experience is designed as **storytelling, not navigation** — every
section reveals a phase of a single diamond's journey from raw stone to a
ring on a human hand.

## Story Architecture

| Section            | Story Beat                                              |
| ------------------ | -------------------------------------------------------- |
| **Hero**           | 5-phase scroll-driven 3D ring formation                 |
| **About**          | Line-by-line philosophy reveal                          |
| **Collection**     | 3D-tilt product grid + 360° viewer modal                |
| **Craftsmanship**  | 6-stage parallax timeline (Origin → Perfection)         |
| **Featured**       | Atelier flagship with floating UI labels                |
| **Voices**         | 3D depth-shifted testimonial carousel                   |
| **Footer**         | Newsletter glow + minimal premium nav                   |

## Tech Stack

- **Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS**
- **Three.js** + `@react-three/fiber` + `@react-three/drei`
- **MeshTransmissionMaterial** for physically plausible diamond refraction
- **HDR studio environment** (Drei's `Environment` preset)
- **Lenis** smooth scroll engine + **GSAP ScrollTrigger**
- **Framer Motion** for choreography & scroll-linked transforms
- Custom **magnetic cursor**, magnetic buttons, glassmorphism, metallic
  gradient text

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Project Structure

```
src/
  app/                 # Next.js app router (layout, page, globals.css)
  components/
    sections/          # One file per page section
    three/             # Three.js / R3F components and scenes
    ui/                # Reusable interaction primitives
  lib/utils.ts         # Helpers (cn, lerp, phase, smoothstep, ...)
```

## Replacing Procedural Geometry With Real GLBs

The diamond, ring, and hand are procedurally generated so the project runs
without binary assets. To swap in production-grade models:

1. Place `.glb` files in `public/models/`
2. In `src/components/three/RingScene.tsx`, replace the procedural
   `<DiamondMesh />`, `<RingMesh />`, `<HandSilhouette />` with
   `useGLTF('/models/<name>.glb')` results from `@react-three/drei`.
3. Add `useGLTF.preload(...)` and `loading="eager"` for the hero asset.

## Performance

- Three.js scenes are loaded with `next/dynamic` and `ssr: false`
- DPR is clamped to `[1, 1.6]` and `[1, 1.5]` for the hero / product viewer
- `prefers-reduced-motion` short-circuits the smooth-scroll engine and
  animation durations
- Mobile (≤768px) replaces the heaviest hero scene with a CSS-only fallback

## Notes

- Scroll the hero section slowly — its sticky pin is 5 viewport heights tall
  and the ring formation is mapped piecewise across that range.
- The custom cursor is hidden on touch / coarse-pointer devices.
