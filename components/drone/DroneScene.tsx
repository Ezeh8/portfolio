"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BackSide, Mesh, type Group } from "three";
import Drone from "./Drone";

// Vertex totals for the drone's own geometry, and separately for the inverted-hull
// meshes drei's Outlines adds (those use a BackSide material).
function countVertices(root: Group) {
  let drone = 0;
  let outlines = 0;
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    const n = obj.geometry.attributes.position?.count ?? 0;
    const material = Array.isArray(obj.material) ? obj.material[0] : obj.material;
    if (material.side === BackSide) outlines += n;
    else drone += n;
  });
  return { drone, outlines };
}

export default function DroneScene({ scanning }: { scanning: boolean }) {
  const root = useRef<Group>(null);
  const [counts, setCounts] = useState<{ drone: number; outlines: number } | null>(null);

  useEffect(() => {
    // outlines are attached a frame after mount
    const id = setTimeout(() => root.current && setCounts(countVertices(root.current)), 500);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <Canvas flat dpr={[1, 2]} camera={{ position: [3.2, 2.2, 3.8], fov: 40 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 3]} intensity={2.2} />
        <directionalLight position={[-3, 2, -4]} intensity={0.6} />
        <group ref={root}>
          <Drone scanning={scanning} />
        </group>
        <OrbitControls makeDefault enablePan={false} minDistance={2.5} maxDistance={12} />
      </Canvas>
      {counts && (
        <p
          data-testid="vertex-count"
          className="pointer-events-none absolute top-4 left-4 font-mono text-xs text-text/60"
        >
          vertices: {counts.drone} (+{counts.outlines} outline)
        </p>
      )}
    </>
  );
}
