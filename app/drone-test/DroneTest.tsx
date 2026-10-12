"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { DronePalette } from "@/components/drone/Drone";
import type { DroneStats } from "@/components/drone/DroneScene";

// three.js only runs in the browser.
const DroneScene = dynamic(() => import("@/components/drone/DroneScene"), { ssr: false });

const toggle =
  "inline-flex h-10 items-center rounded-full border-2 border-ink px-5 font-mono text-xs uppercase tracking-[0.12em]";

export default function DroneTest() {
  const [scanning, setScanning] = useState(false);
  const [palette, setPalette] = useState<DronePalette>("graphite");
  const [stats, setStats] = useState<DroneStats | null>(null);

  return (
    // Full-screen stage: 100vh, upgraded to 100dvh where supported so phone browser
    // toolbars don't hide part of the canvas. (CSS modules aren't usable here: the
    // project's Turbopack rule treats every .css file as plain global CSS.)
    <div className="fixed inset-0 h-screen w-full bg-bg supports-[height:100dvh]:h-dvh">
      <DroneScene scanning={scanning} palette={palette} onStats={setStats} />

      <p
        data-testid="vertex-count"
        className="pointer-events-none absolute top-4 left-4 right-4 font-mono text-xs leading-relaxed text-text/60"
      >
        {stats ? (
          <>
            vertices: {stats.vertices} (+{stats.outlineVertices} outline) · size {stats.size}
            <br />
            toon materials with gradient map: {stats.toonWithGradient}/{stats.toonMaterials}
          </>
        ) : (
          "measuring…"
        )}
      </p>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
        <button
          type="button"
          aria-pressed={scanning}
          onClick={() => setScanning((s) => !s)}
          className={`${toggle} ${scanning ? "bg-ink text-bg" : "bg-card text-text"}`}
        >
          scan
        </button>
        <button
          type="button"
          aria-pressed={palette === "paper"}
          onClick={() => setPalette((p) => (p === "graphite" ? "paper" : "graphite"))}
          className={`${toggle} ${palette === "paper" ? "bg-ink text-bg" : "bg-card text-text"}`}
        >
          palette
        </button>
      </div>
    </div>
  );
}
