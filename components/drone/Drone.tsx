"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
import { useFrame } from "@react-three/fiber";
import { Outlines, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Built entirely from three.js primitives: no model files.

export type DronePalette = "graphite" | "paper";

const PALETTES: Record<DronePalette, { body: string; arm: string }> = {
  graphite: { body: "#4A4E57", arm: "#33363D" }, // body + canopy, arms + motor pods
  paper: { body: "#F4F5F7", arm: "#D9DBE0" },
};

const ROTOR = "#111214";
const ACCENT = "#1F3C8C"; // scanner ring, status lights, scan cone
const OUTLINE_COLOR = "#111214";

// drei's Outlines with screenspace={false} (its default, despite the name) offsets the
// hull in clip space, so `thickness` is in screen pixels and stays constant when
// zooming. 3px reads as bold as the site's 2px card borders.
const OUTLINE_PX = 3;

// Model units are scaled so the drone is about 2 units wide, rotor tip to rotor tip.
const SCALE = 0.66;

const ARM_REACH = 1.45; // centre of the drone to the centre of each motor pod
const ARM_ANGLES = [1, 3, 5, 7].map((k) => (k * Math.PI) / 4); // X layout

const RING_Y = -0.37;
const SCAN_CONE_LENGTH = 1.5 / SCALE; // 1.5 world units
const SCAN_PULSE_SECONDS = 1.2;

type Vec3 = [number, number, number];

export type DroneProps = {
  position?: Vec3;
  rotation?: Vec3;
  /** Scanner ring and status lights glow brighter, the ring pulses, and a scan cone shows. */
  scanning?: boolean;
  palette?: DronePalette;
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

// Three hard tone steps for the cartoon look. Nearest filtering and no mipmaps keep the
// steps from being blended into a smooth ramp.
function useToonGradient() {
  return useMemo(() => {
    const t = new THREE.DataTexture(new Uint8Array([45, 135, 255]), 3, 1, THREE.RedFormat);
    t.minFilter = THREE.NearestFilter;
    t.magFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    t.needsUpdate = true;
    return t;
  }, []);
}

function Outline() {
  return <Outlines thickness={OUTLINE_PX} screenspace={false} color={OUTLINE_COLOR} />;
}

export default function Drone({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scanning = false,
  palette = "graphite",
}: DroneProps) {
  const colors = PALETTES[palette];
  const reducedMotion = usePrefersReducedMotion();
  const gradientMap = useToonGradient();
  const hover = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const rotors = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const spin = reducedMotion ? 1.5 : 40; // rad/s
    rotors.current.forEach((rotor, i) => {
      // neighbouring rotors turn in opposite directions, as on a real quadcopter
      if (rotor) rotor.rotation.y += (i % 2 ? -1 : 1) * spin * delta;
    });

    if (ring.current) {
      const pulse =
        scanning && !reducedMotion
          ? 1 + 0.075 * (1 - Math.cos((t / SCAN_PULSE_SECONDS) * Math.PI * 2)) // 1.0 → 1.15
          : 1;
      ring.current.scale.setScalar(pulse);
    }

    const g = hover.current;
    if (!g) return;
    if (reducedMotion) {
      g.position.y = 0;
      g.rotation.set(0, 0, 0);
      return;
    }
    g.position.y = Math.sin(t * 1.6) * 0.08;
    g.rotation.x = Math.sin(t * 1.1) * 0.05;
    g.rotation.z = Math.cos(t * 0.9) * 0.04;
  });

  const glow = scanning ? 2.6 : 0.9; // readable against the dark body even at rest
  const toon = (color: string) => <meshToonMaterial color={color} gradientMap={gradientMap} />;
  const accent = (
    <meshToonMaterial
      color={ACCENT}
      emissive={ACCENT}
      emissiveIntensity={glow}
      gradientMap={gradientMap}
    />
  );

  return (
    <group position={position} rotation={rotation} scale={SCALE}>
      <group ref={hover}>
        {/* body */}
        <RoundedBox args={[1.4, 0.45, 1]} radius={0.14} smoothness={4}>
          {toon(colors.body)}
          <Outline />
        </RoundedBox>

        {/* canopy */}
        <mesh position={[0, 0.22, -0.05]} scale={[1, 0.55, 1.15]}>
          <sphereGeometry args={[0.36, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          {toon(colors.body)}
          <Outline />
        </mesh>

        {/* arms, motor pods and rotors */}
        {ARM_ANGLES.map((angle, i) => (
          <group key={angle} rotation={[0, angle, 0]}>
            <mesh position={[0.35 + (ARM_REACH - 0.35) / 2, 0, 0]}>
              <boxGeometry args={[ARM_REACH - 0.35, 0.12, 0.16]} />
              {toon(colors.arm)}
              <Outline />
            </mesh>
            <mesh position={[ARM_REACH, 0.03, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.28, 20]} />
              {toon(colors.arm)}
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
                {toon(ROTOR)}
                <Outline />
              </mesh>
              {[0, Math.PI / 2].map((bladeAngle) => (
                <mesh key={bladeAngle} rotation={[0.12, bladeAngle, 0]}>
                  <boxGeometry args={[0.95, 0.025, 0.1]} />
                  {toon(ROTOR)}
                  <Outline />
                </mesh>
              ))}
            </group>
          </group>
        ))}

        {/* scanner lens underneath */}
        <mesh position={[0, -0.29, 0]}>
          <cylinderGeometry args={[0.2, 0.22, 0.14, 24]} />
          {toon(colors.body)}
          <Outline />
        </mesh>
        <mesh ref={ring} position={[0, RING_Y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.04, 10, 32]} />
          {accent}
          <Outline />
        </mesh>

        {/* scan cone: straight down from the lens, widening; no outline */}
        {scanning && (
          <mesh position={[0, RING_Y - SCAN_CONE_LENGTH / 2, 0]} renderOrder={1}>
            <cylinderGeometry args={[0.2, 1.1, SCAN_CONE_LENGTH, 40, 1, true]} />
            <meshBasicMaterial
              color={ACCENT}
              transparent
              opacity={0.18}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

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
