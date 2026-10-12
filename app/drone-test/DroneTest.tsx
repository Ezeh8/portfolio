"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// three.js only runs in the browser.
const DroneScene = dynamic(() => import("@/components/drone/DroneScene"), { ssr: false });

export default function DroneTest() {
  const [scanning, setScanning] = useState(false);
  return (
    <div className="fixed inset-0 bg-bg">
      <DroneScene scanning={scanning} />
      <button
        type="button"
        aria-pressed={scanning}
        onClick={() => setScanning((s) => !s)}
        className={`absolute bottom-6 left-1/2 inline-flex h-10 -translate-x-1/2 items-center rounded-full border-2 border-ink px-5 font-mono text-xs uppercase tracking-[0.12em] ${
          scanning ? "bg-ink text-bg" : "bg-card text-text"
        }`}
      >
        scan
      </button>
    </div>
  );
}
