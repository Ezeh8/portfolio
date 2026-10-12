"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
import { useFrame } from "@react-three/fiber";
import { Outlines, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Built entirely from three.js primitives: no model files.

const COLORS = {
  body: "#2A2C31",
  arm: "#3A3D44",
  rotor: "#111214",
  accent: "#1F3C8C",
  outline: "#111214",
};

// drei Outlines with screenspace={false} (its default) measures thickness in screen
// pixels, so the outline stays the same width at any zoom.
const OUTLINE_PX = 3;

const ARM_REACH = 1.45; // centre of the drone to the centre of each motor pod
const ARM_ANGLES = [1, 3, 5, 7].map((k) => (k * Math.PI) / 4); // X layout

type Vec3 = [number, number, number];

export type DroneProps = {
  position?: Vec3;
  rotation?: Vec3;
  /** Scanner ring and status lights glow brighter. */
  scanning?: boolean;
};

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

// Three hard tone steps for the cartoon look.
function useToonGradient() {
  return useMemo(() => {
    const texture = new THREE.DataTexture(new Uint8Array([90, 170, 255]), 3, 1, THREE.RedFormat);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  }, []);
}

function Outline() {
  return <Outlines thickness={OUTLINE_PX} color={COLORS.outline} />;
}

export default function Drone({ position = [0, 0, 0], rotation = [0, 0, 0], scanning = false }: DroneProps) {
  const reducedMotion = usePrefersReducedMotion();
  const gradientMap = useToonGradient();
  const hover = useRef<THREE.Group>(null);
  const rotors = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }, delta) => {
    const spin = reducedMotion ? 1.5 : 40; // rad/s
    rotors.current.forEach((rotor, i) => {
      // neighbouring rotors turn in opposite directions, as on a real quadcopter
      if (rotor) rotor.rotation.y += (i % 2 ? -1 : 1) * spin * delta;
    });

    const g = hover.current;
    if (!g) return;
    if (reducedMotion) {
      g.position.y = 0;
      g.rotation.set(0, 0, 0);
      return;
    }
    const t = clock.elapsedTime;
    g.position.y = Math.sin(t * 1.6) * 0.08;
    g.rotation.x = Math.sin(t * 1.1) * 0.05;
    g.rotation.z = Math.cos(t * 0.9) * 0.04;
  });

  const glow = scanning ? 2.2 : 0.35;
  const toon = (color: string) => <meshToonMaterial color={color} gradientMap={gradientMap} />;
  const accent = (
    <meshToonMaterial
      color={COLORS.accent}
      emissive={COLORS.accent}
      emissiveIntensity={glow}
      gradientMap={gradientMap}
    />
  );

  return (
    <group position={position} rotation={rotation}>
      <group ref={hover}>
        {/* body */}
        <RoundedBox args={[1.4, 0.45, 1]} radius={0.14} smoothness={4}>
          {toon(COLORS.body)}
          <Outline />
        </RoundedBox>

        {/* canopy */}
        <mesh position={[0, 0.22, -0.05]} scale={[1, 0.55, 1.15]}>
          <sphereGeometry args={[0.36, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          {toon(COLORS.arm)}
          <Outline />
        </mesh>

        {/* arms, motor pods and rotors */}
        {ARM_ANGLES.map((angle, i) => (
          <group key={angle} rotation={[0, angle, 0]}>
            <mesh position={[0.35 + (ARM_REACH - 0.35) / 2, 0, 0]}>
              <boxGeometry args={[ARM_REACH - 0.35, 0.12, 0.16]} />
              {toon(COLORS.arm)}
              <Outline />
            </mesh>
            <mesh position={[ARM_REACH, 0.03, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.28, 20]} />
              {toon(COLORS.arm)}
              <Outline />
            </mesh>
            <group
              position={[ARM_REACH, 0.21, 0]}
              ref={(el) => {
                rotors.current[i] = el;
              }}
            >
              <mesh>
                <cylinderGeometry args={[0.06, 0.06, 0.06, 12]} />
                {toon(COLORS.rotor)}
                <Outline />
              </mesh>
              {[0, Math.PI / 2].map((bladeAngle) => (
                <mesh key={bladeAngle} rotation={[0.12, bladeAngle, 0]}>
                  <boxGeometry args={[0.95, 0.025, 0.1]} />
                  {toon(COLORS.rotor)}
                  <Outline />
                </mesh>
              ))}
            </group>
          </group>
        ))}

        {/* scanner lens underneath */}
        <mesh position={[0, -0.29, 0]}>
          <cylinderGeometry args={[0.2, 0.22, 0.14, 24]} />
          {toon(COLORS.body)}
          <Outline />
        </mesh>
        <mesh position={[0, -0.37, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.04, 10, 32]} />
          {accent}
          <Outline />
        </mesh>

        {/* status lights on the front (+z) */}
        {[-0.3, 0.3].map((x) => (
          <mesh key={x} position={[x, 0.04, 0.51]}>
            <sphereGeometry args={[0.055, 12, 8]} />
            {accent}
            <Outline />
          </mesh>
        ))}
      </group>
    </group>
  );
}
