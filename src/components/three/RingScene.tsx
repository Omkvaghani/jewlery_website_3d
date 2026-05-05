"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";

import DiamondMesh from "./DiamondMesh";
import RingMesh from "./RingMesh";
import DiamondDust from "./DiamondDust";
import HandSilhouette from "./HandSilhouette";
import { phase, lerp } from "@/lib/utils";

type Props = {
  /** 0..1 scroll progress through the hero pin */
  progress: number;
};

/**
 * Phase mapping — drives the 5 narrative stages.
 *
 *  0.00 — 0.20  Diamond Emergence       (raw crystal floats in)
 *  0.20 — 0.40  Metal Formation         (gold flows around invisible ring)
 *  0.40 — 0.60  Diamond Setting         (diamond descends, prongs rise)
 *  0.60 — 0.78  Final Polish            (ring rotates, surface brightens)
 *  0.78 — 1.00  Human Connection        (hand appears, ring slides on)
 */

function SceneInner({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);

  const pEmerge = phase(progress, 0.0, 0.2);
  const pMetal = phase(progress, 0.2, 0.4);
  const pSetting = phase(progress, 0.4, 0.6);
  const pPolish = phase(progress, 0.6, 0.78);
  const pHand = phase(progress, 0.78, 1.0);

  const diamondScale = lerp(0.0, 1.0, Math.min(1, pEmerge * 1.1));
  const diamondY = lerp(1.6, 0.45, pSetting);
  const diamondRotOffset = lerp(0.6, 0.05, pPolish);

  const ringBuild = pMetal;
  const prongRise = pSetting;

  const handZ = lerp(-6, -0.4, pHand);
  const handOpacity = pHand > 0.05 ? Math.min(1, (pHand - 0.05) / 0.4) : 0;

  const rigZ = lerp(0, 1.4, pHand);
  const keyIntensity = lerp(1.6, 3.0, pPolish);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * (0.3 + diamondRotOffset);
    }
    groupRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group position={[0, 0, rigZ]}>
      {/* Lightweight 3-light setup. No HDR environment (saves ~3MB load + PMREM). */}
      <hemisphereLight intensity={0.45} color="#fff1c5" groundColor="#0a0a0e" />
      <spotLight
        position={[3, 5, 4]}
        angle={0.5}
        penumbra={0.7}
        intensity={keyIntensity}
        color="#fff1c5"
      />
      <spotLight
        position={[-4, 2, -3]}
        angle={0.7}
        penumbra={1}
        intensity={1.0}
        color="#9eb6ff"
      />

      <DiamondDust count={80} radius={4} />

      <group ref={groupRef}>
        <group
          position={[0, diamondY, 0]}
          rotation={[0.1, progress * 6, 0.05]}
          scale={diamondScale}
        >
          <DiamondMesh />
        </group>

        <group ref={ringRef} position={[0, 0, 0]}>
          <RingMesh
            scale={1.0}
            buildProgress={ringBuild}
            prongProgress={prongRise}
            material="gold"
          />
        </group>
      </group>

      {handOpacity > 0.01 ? (
        <HandSilhouette
          position={[0.6, -1.6, handZ]}
          rotation={[-0.4, -0.4, 0.2]}
          scale={0.55}
          opacity={handOpacity}
        />
      ) : null}
    </group>
  );
}

export default function RingScene({ progress }: Props) {
  // PerformanceMonitor lets us scale DPR down on weaker GPUs.
  const [dpr, setDpr] = useState<number>(1.25);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.5, 5], fov: 35 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: true,
      }}
    >
      <PerformanceMonitor
        onIncline={() => setDpr(Math.min(1.5, dpr + 0.1))}
        onDecline={() => setDpr(Math.max(0.75, dpr - 0.25))}
      />
      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />
      <Suspense fallback={null}>
        <SceneInner progress={progress} />
      </Suspense>
    </Canvas>
  );
}
