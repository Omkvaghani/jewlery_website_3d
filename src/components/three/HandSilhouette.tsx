"use client";

import * as THREE from "three";
import { useMemo } from "react";

/**
 * Stylized hand silhouette built from rounded boxes. Not photoreal — but reads
 * as "hand with extended ring finger" at a glance and provides a resting target
 * for the ring slide-on animation. Replace with a sculpted GLB for production.
 */
export default function HandSilhouette({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  opacity = 1,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  opacity?: number;
}) {
  const palmGeom = useMemo(
    () => new THREE.BoxGeometry(2.4, 2.6, 0.7),
    [],
  );
  const fingerGeom = useMemo(
    () => new THREE.CapsuleGeometry(0.32, 1.6, 8, 16),
    [],
  );
  const ringFingerGeom = useMemo(
    () => new THREE.CapsuleGeometry(0.34, 2.4, 8, 16),
    [],
  );
  const thumbGeom = useMemo(
    () => new THREE.CapsuleGeometry(0.32, 1.2, 8, 16),
    [],
  );

  const skinColor = "#e6c1a6";

  const matProps = {
    color: skinColor,
    roughness: 0.7,
    metalness: 0.05,
    transparent: opacity < 1,
    opacity,
  };

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* palm */}
      <mesh geometry={palmGeom} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* index */}
      <mesh
        geometry={fingerGeom}
        position={[-0.7, 1.95, 0]}
        rotation={[0, 0, 0.05]}
        castShadow
      >
        <meshStandardMaterial {...matProps} />
      </mesh>
      {/* middle */}
      <mesh
        geometry={fingerGeom}
        position={[-0.18, 2.15, 0]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <meshStandardMaterial {...matProps} />
      </mesh>
      {/* ring finger — extended slightly forward and is the target */}
      <mesh
        geometry={ringFingerGeom}
        position={[0.45, 2.4, 0]}
        rotation={[0, 0, -0.04]}
        castShadow
      >
        <meshStandardMaterial {...matProps} />
      </mesh>
      {/* pinky */}
      <mesh
        geometry={fingerGeom}
        position={[1.0, 1.85, 0]}
        rotation={[0, 0, -0.12]}
        castShadow
      >
        <meshStandardMaterial {...matProps} />
      </mesh>
      {/* thumb */}
      <mesh
        geometry={thumbGeom}
        position={[-1.15, 0.6, 0]}
        rotation={[0, 0, 1.0]}
        castShadow
      >
        <meshStandardMaterial {...matProps} />
      </mesh>
    </group>
  );
}
