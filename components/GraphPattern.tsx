"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Topology } from "@/content/site";

gsap.registerPlugin(useGSAP);

// A small node-and-edge drawing on each project card's cover, one shape per project
// topology. The lines draw themselves in on mount, then the dots pulse gently. Drawn in
// the site's accent (monochrome), on a transparent background. Under reduced motion it
// stays still and fully drawn.
type Node = { x: number; y: number; dim?: boolean };
type Pattern = { nodes: Node[]; edges: [number, number][] };

// RADIAL: a centre node with 10 outer nodes at varied angles and radii (55-80px), all
// linked to the centre; 4 of them also link to their neighbour.
function radial(): Pattern {
  const angles = [-90, -52, -18, 14, 47, 84, 118, 151, 187, 226];
  const radii = [62, 76, 58, 80, 66, 55, 74, 60, 78, 68];
  const nodes: Node[] = [{ x: 160, y: 90 }];
  angles.forEach((a, i) => {
    const r = (a * Math.PI) / 180;
    nodes.push({ x: 160 + radii[i] * Math.cos(r), y: 90 + radii[i] * Math.sin(r) * 0.95 });
  });
  const edges: [number, number][] = angles.map((_, i) => [0, i + 1]);
  edges.push([1, 2], [4, 5], [6, 7], [9, 10]);
  return { nodes, edges };
}

// TREE: a root, two branches, four leaves.
function tree(): Pattern {
  return {
    nodes: [
      { x: 160, y: 24 },
      { x: 100, y: 72 },
      { x: 220, y: 72 },
      { x: 62, y: 126 },
      { x: 130, y: 126 },
      { x: 192, y: 126 },
      { x: 258, y: 126 },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
      [2, 6],
    ],
  };
}

// GRID: 4 columns x 3 rows inside 20px padding, linked to every horizontal and vertical
// neighbour; the gated nodes [col, row] = [1,1], [2,0], [3,2] are dimmed.
function grid(): Pattern {
  const cols = 4;
  const rows = 3;
  const gated = ["1,1", "2,0", "3,2"];
  const nodes: Node[] = [];
  const edges: [number, number][] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      nodes.push({
        x: 20 + (c * (320 - 40)) / (cols - 1),
        y: 20 + (r * (180 - 40)) / (rows - 1),
        dim: gated.includes(`${c},${r}`),
      });
      const i = r * cols + c;
      if (c > 0) edges.push([i - 1, i]);
      if (r > 0) edges.push([i - cols, i]);
    }
  return { nodes, edges };
}

// PIPELINE: 4 columns of 3 nodes; every node feeds every node in the next column.
function pipeline(): Pattern {
  const xs = [56, 120, 200, 264];
  const ys = [36, 90, 144];
  const nodes = xs.flatMap((x) => ys.map((y) => ({ x, y })));
  const edges: [number, number][] = [];
  for (let c = 0; c < xs.length - 1; c++)
    for (let a = 0; a < ys.length; a++)
      for (let b = 0; b < ys.length; b++) edges.push([c * 3 + a, (c + 1) * 3 + b]);
  return { nodes, edges };
}

const PATTERNS: Record<Topology, Pattern> = {
  radial: radial(),
  tree: tree(),
  grid: grid(),
  pipeline: pipeline(),
};

export default function GraphPattern({
  topology,
  className = "",
}: {
  topology: Topology;
  className?: string;
}) {
  const root = useRef<SVGSVGElement>(null);
  const { nodes, edges } = PATTERNS[topology];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = gsap.utils.toArray<SVGLineElement>("line", root.current);
        // gated (dimmed) nodes stay dim instead of pulsing
        const dots = gsap.utils.toArray<SVGCircleElement>("circle:not([data-dim])", root.current);
        gsap.set(lines, { strokeDasharray: 300, strokeDashoffset: 300 });
        gsap.set(dots, { transformOrigin: "50% 50%" });
        gsap.to(lines, {
          strokeDashoffset: 0,
          duration: 1.2,
          stagger: 0.06,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(dots, {
              scale: 1.4,
              opacity: 0.6,
              duration: 0.8,
              repeat: -1,
              yoyo: true,
              stagger: 0.15,
              ease: "sine.inOut",
            });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <svg
      ref={root}
      aria-hidden="true"
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid meet"
      className={`fill-accent-text stroke-accent-text ${className}`}
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          strokeWidth={1}
          opacity={0.2}
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={2.5}
          stroke="none"
          opacity={n.dim ? 0.25 : 1}
          data-dim={n.dim || undefined}
        />
      ))}
    </svg>
  );
}
