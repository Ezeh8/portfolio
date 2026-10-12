"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BackSide, Box3, Mesh, Vector3, type Group } from "three";
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
  const size = new Box3().setFromObject(root).getSize(new Vector3());
  return { drone, outlines, size: [size.x, size.y, size.z].map((n) => n.toFixed(2)).join(" × ") };
}

export default function DroneScene({ scanning }: { scanning: boolean }) {
  const root = useRef<Group>(null);
  const [counts, setCounts] = useState<ReturnType<typeof countVertices> | null>(null);

  useEffect(() => {
    // outlines are attached a frame after mount
    const id = setTimeout(() => root.current && setCounts(countVertices(root.current)), 500);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      {/* camera in front of the drone (+Z), slightly above */}
      <Canvas flat dpr={[1, 2]} camera={{ position: [0, 1.3, 4.2], fov: 40 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} />
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
          vertices: {counts.drone} (+{counts.outlines} outline) · size {counts.size}
        </p>
      )}
    </>
  );
}
