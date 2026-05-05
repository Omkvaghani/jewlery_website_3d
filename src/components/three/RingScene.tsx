"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  PerformanceMonitor,
} from "@react-three/drei";
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

  // Diamond transforms
  const diamondScale = lerp(0.0, 1.0, Math.min(1, pEmerge * 1.1));
  // Diamond hovers high, descends during setting
  const diamondY = lerp(1.6, 0.45, pSetting);
  // Diamond rotation slows once set
  const diamondRotOffset = lerp(0.6, 0.05, pPolish);

  // Ring build progress (metal formation)
  const ringBuild = pMetal;
  // Prong rise during setting
  const prongRise = pSetting;

  // Camera-relative transforms applied to a wrapper group
  // Hand entrance — ring slides into view
  const handZ = lerp(-6, -0.4, pHand);
  const handOpacity = pHand > 0.05 ? Math.min(1, (pHand - 0.05) / 0.4) : 0;

  // Whole rig zooms forward slightly during hand phase to feel cinematic
  const rigZ = lerp(0, 1.4, pHand);

  // Light intensity boost on polish
  const keyIntensity = lerp(2.2, 4.0, pPolish);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Continuous gentle rotation on the diamond
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * (0.3 + diamondRotOffset);
    }
    // Subtle floating wobble on the diamond before setting
    groupRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group position={[0, 0, rigZ]}>
      <Environment preset="studio" environmentIntensity={0.55} />
      <ambientLight intensity={0.15} />

      {/* Cinematic key light */}
      <spotLight
        position={[3, 5, 4]}
        angle={0.5}
        penumbra={0.7}
        intensity={keyIntensity}
        color="#fff1c5"
        castShadow
      />
      {/* Cool rim light */}
      <spotLight
        position={[-4, 2, -3]}
        angle={0.7}
        penumbra={1}
        intensity={1.4}
        color="#9eb6ff"
      />

      <DiamondDust count={300} radius={5} />

      <group ref={groupRef}>
        {/* Diamond */}
        <group
          position={[0, diamondY, 0]}
          rotation={[0.1, progress * 6, 0.05]}
          scale={diamondScale}
        >
          <DiamondMesh />
        </group>

        {/* Ring */}
        <group ref={ringRef} position={[0, 0, 0]}>
          <RingMesh
            scale={1.0}
            buildProgress={ringBuild}
            prongProgress={prongRise}
            material="gold"
          />
        </group>
      </group>

      {/* Hand appears late */}
      {handOpacity > 0.01 ? (
        <HandSilhouette
          position={[0.6, -1.6, handZ]}
          rotation={[-0.4, -0.4, 0.2]}
          scale={0.55}
          opacity={handOpacity}
        />
      ) : null}

      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.55}
        blur={2.4}
        far={4}
        resolution={512}
        color="#000000"
      />
    </group>
  );
}

export default function RingScene({ progress }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.5, 5], fov: 35 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <PerformanceMonitor>
          <SceneInner progress={progress} />
        </PerformanceMonitor>
      </Suspense>
    </Canvas>
  );
}
