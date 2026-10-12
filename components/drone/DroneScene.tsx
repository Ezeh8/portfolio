"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  BackSide,
  Box3,
  Mesh,
  MeshToonMaterial,
  NearestFilter,
  Vector3,
  type Group,
  type Material,
} from "three";
import Drone, { type DronePalette } from "./Drone";

export type DroneStats = {
  vertices: number;
  outlineVertices: number;
  size: string;
  toonMaterials: number;
  toonWithGradient: number;
};

function collectStats(root: Group): DroneStats {
  const stats = { vertices: 0, outlineVertices: 0, toonMaterials: 0, toonWithGradient: 0 };
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    const n = obj.geometry.attributes.position?.count ?? 0;
    const materials: Material[] = Array.isArray(obj.material) ? obj.material : [obj.material];
    // drei's Outlines adds inverted-hull meshes, which use a BackSide material
    if (materials[0].side === BackSide) stats.outlineVertices += n;
    else stats.vertices += n;
    for (const m of materials) {
      if (!(m instanceof MeshToonMaterial)) continue;
      stats.toonMaterials++;
      const g = m.gradientMap;
      if (g && g.minFilter === NearestFilter && g.magFilter === NearestFilter && !g.generateMipmaps)
        stats.toonWithGradient++;
    }
  });
  const size = new Box3().setFromObject(root).getSize(new Vector3());
  return { ...stats, size: [size.x, size.y, size.z].map((v) => v.toFixed(2)).join(" × ") };
}

// Reports stats from inside the canvas once the scene has actually rendered (Outlines
// attach their hull meshes after mount), and again whenever `version` changes.
function StatsProbe({
  target,
  version,
  onStats,
}: {
  target: React.RefObject<Group | null>;
  version: string;
  onStats: (s: DroneStats) => void;
}) {
  const last = useRef<{ version: string; frames: number }>({ version: "", frames: 0 });
  useFrame(() => {
    if (last.current.version !== version) last.current = { version, frames: 0 };
    if (++last.current.frames === 10 && target.current) onStats(collectStats(target.current));
  });
  return null;
}

const CAMERA_DIRECTION = new Vector3(0, 1.3, 4.2).normalize(); // in front (+Z), slightly above
const MIN_DISTANCE = 4.4;
const HALF_WIDTH_TO_FIT = 1.35; // drone half-width (~1) plus a margin

// Keeps the whole drone in view on narrow (portrait) screens by backing the camera off
// until the drone's width fits the horizontal field of view. Runs on resize only, so
// OrbitControls stay free in between.
function FitCamera() {
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / s.size.height);
  useEffect(() => {
    if (!("fov" in camera)) return;
    const halfV = ((camera.fov as number) * Math.PI) / 360;
    const fitWidth = HALF_WIDTH_TO_FIT / (Math.tan(halfV) * aspect);
    camera.position.copy(CAMERA_DIRECTION).multiplyScalar(Math.max(MIN_DISTANCE, fitWidth));
    camera.lookAt(0, 0, 0);
  }, [camera, aspect]);
  return null;
}

export default function DroneScene({
  scanning,
  palette,
  onStats,
}: {
  scanning: boolean;
  palette: DronePalette;
  onStats: (s: DroneStats) => void;
}) {
  const root = useRef<Group>(null);
  return (
    <Canvas
      flat
      dpr={[1, 2]}
      camera={{ position: [0, 1.3, 4.2], fov: 40 }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* low ambient + one key light above, left and in front, so all three toon bands show */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[-2.5, 4, 1.5]} intensity={2.4} />
      <group ref={root}>
        <Drone scanning={scanning} palette={palette} />
      </group>
      <FitCamera />
      <StatsProbe target={root} version={`${scanning}-${palette}`} onStats={onStats} />
      <OrbitControls makeDefault enablePan={false} minDistance={2.5} maxDistance={12} />
    </Canvas>
  );
}
