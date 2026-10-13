"use client";

import dynamic from "next/dynamic";

// Client-only and in its own bundle, so the plane (GSAP, Lenis) never holds up the
// page text.
const PlaneFlight = dynamic(() => import("./PlaneFlight"), { ssr: false });

export default function PlaneLayer() {
  return <PlaneFlight />;
}
