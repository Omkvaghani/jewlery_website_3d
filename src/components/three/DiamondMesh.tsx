"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";

/**
 * Procedural brilliant-cut diamond geometry built from a low-poly cone (crown)
 * stacked atop an inverted cone (pavilion). Replace by loading a GLB asset
 * for higher fidelity.
 */
function buildDiamondGeometry(): THREE.BufferGeometry {
  const crown = new THREE.ConeGeometry(1, 0.45, 16, 1);
  // Move crown so its base sits at y=0
  crown.translate(0, 0.225, 0);

  const pavilion = new THREE.ConeGeometry(1, 1.1, 16, 1);
  pavilion.rotateX(Math.PI);
  // Pavilion below the girdle
  pavilion.translate(0, -0.55, 0);

  const girdle = new THREE.CylinderGeometry(1, 1, 0.04, 16, 1, false);
  // Girdle band
  girdle.translate(0, 0, 0);

  // Merge: BufferGeometryUtils available via three-stdlib / drei isn't strictly
  // needed here — we just use a Group-like merge by concatenating attributes.
  const geometries: THREE.BufferGeometry[] = [crown, girdle, pavilion];
  const merged = mergeGeometries(geometries);
  merged.computeVertexNormals();
  merged.center();
  return merged;
}

function mergeGeometries(
  geometries: THREE.BufferGeometry[],
): THREE.BufferGeometry {
  const merged = new THREE.BufferGeometry();
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];

  for (const g of geometries) {
    const pos = g.getAttribute("position");
    const nor = g.getAttribute("normal");
    const uv = g.getAttribute("uv");
    for (let i = 0; i < pos.count; i++) {
      positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
      if (nor) normals.push(nor.getX(i), nor.getY(i), nor.getZ(i));
      if (uv) uvs.push(uv.getX(i), uv.getY(i));
    }
  }
  merged.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  if (normals.length) {
    merged.setAttribute(
      "normal",
      new THREE.Float32BufferAttribute(normals, 3),
    );
  }
  if (uvs.length) {
    merged.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  }
  return merged;
}

type Props = {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
};

export default function DiamondMesh({
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: Props) {
  const geom = useMemo(() => buildDiamondGeometry(), []);

  return (
    <mesh
      geometry={geom}
      scale={scale}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <MeshTransmissionMaterial
        backside
        samples={8}
        thickness={0.45}
        roughness={0.02}
        transmission={1}
        ior={2.4}
        chromaticAberration={0.08}
        anisotropy={0.3}
        distortion={0.1}
        distortionScale={0.4}
        temporalDistortion={0.05}
        attenuationDistance={0.6}
        attenuationColor="#ffffff"
        color="#ffffff"
      />
    </mesh>
  );
}
