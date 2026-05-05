"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, AdaptiveDpr } from "@react-three/drei";
import DiamondMesh from "./DiamondMesh";
import RingMesh, { type RingMaterial } from "./RingMesh";

type Props = {
  material: RingMaterial;
  shape: "brilliant" | "emerald" | "marquise" | "pear";
};

export default function ProductViewer({ material }: Props) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 0.6, 4], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <hemisphereLight
          intensity={0.6}
          color="#fff1c5"
          groundColor="#0a0a0e"
        />
        <spotLight
          position={[3, 4, 3]}
          intensity={2.0}
          angle={0.5}
          penumbra={1}
        />
        <spotLight
          position={[-3, 2, -2]}
          intensity={0.8}
          angle={0.7}
          penumbra={1}
          color="#aab8d8"
        />

        <group rotation={[0.05, 0, 0]}>
          <RingMesh material={material} buildProgress={1} prongProgress={1} />
          <group position={[0, 0.55, 0]} scale={0.4}>
            <DiamondMesh />
          </group>
        </group>

        <OrbitControls
          enablePan={false}
          minDistance={2.5}
          maxDistance={6}
          autoRotate
          autoRotateSpeed={0.6}
        />
      </Suspense>
    </Canvas>
  );
}
