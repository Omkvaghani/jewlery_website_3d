"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";

export type RingMaterial = "gold" | "platinum";

type Props = {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  material?: RingMaterial;
  /** Clip the band: 0 = invisible, 1 = full ring. Used for "metal flowing in" effect. */
  buildProgress?: number;
  /** 0..1 prong rise — prongs grow upward to grip the diamond */
  prongProgress?: number;
};

const RingMesh = forwardRef<THREE.Group, Props>(function RingMesh(
  {
    scale = 1,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    material = "gold",
    buildProgress = 1,
    prongProgress = 1,
  },
  ref,
) {
  // Lower segment counts keep the band smooth-looking while ~halving
  // triangle count vs. (32 × 96).
  const torus = useMemo(
    () => new THREE.TorusGeometry(1, 0.18, 20, 64),
    [],
  );

  const matProps = useMemo(() => {
    if (material === "platinum") {
      return { color: new THREE.Color("#dde2ea"), metalness: 1, roughness: 0.18 };
    }
    return { color: new THREE.Color("#e9b75c"), metalness: 1, roughness: 0.22 };
  }, [material]);

  const buildClamp = Math.max(0, Math.min(1, buildProgress));
  const ringScale = 0.8 + buildClamp * 0.2;
  const ringOpacity = buildClamp;

  // 4 prongs evenly distributed on the top of the ring
  const prongs = [0, 1, 2, 3];

  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      scale={scale * ringScale}
    >
      <mesh
        geometry={torus}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={matProps.color}
          metalness={matProps.metalness}
          roughness={matProps.roughness}
          transparent
          opacity={ringOpacity}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* prong cluster on top */}
      <group position={[0, 0.92, 0]}>
        {prongs.map((i) => {
          const angle = (i / prongs.length) * Math.PI * 2;
          const r = 0.22;
          const x = Math.cos(angle) * r;
          const z = Math.sin(angle) * r;
          const h = 0.01 + 0.32 * prongProgress;
          return (
            <mesh
              key={i}
              position={[x, h / 2, z]}
              castShadow
            >
              <cylinderGeometry args={[0.03, 0.04, h, 16]} />
              <meshStandardMaterial
                color={matProps.color}
                metalness={matProps.metalness}
                roughness={matProps.roughness}
                transparent
                opacity={Math.min(1, prongProgress * 1.5)}
                envMapIntensity={1.4}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
});

export default RingMesh;
