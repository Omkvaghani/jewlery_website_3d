"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import DiamondMesh from "./DiamondMesh";
import RingMesh, { type RingMaterial } from "./RingMesh";

type Props = {
  material: RingMaterial;
  shape: "brilliant" | "emerald" | "marquise" | "pear";
};

export default function ProductViewer({ material }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.6, 4], fov: 38 }}
      gl={{ antialias: true }}
    >
      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.6} />
        <ambientLight intensity={0.2} />
        <spotLight
          position={[3, 4, 3]}
          intensity={2.2}
          angle={0.5}
          penumbra={1}
          castShadow
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

        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.6}
          blur={2.4}
          far={4}
          resolution={512}
          color="#000000"
        />

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
