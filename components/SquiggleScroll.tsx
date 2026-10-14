"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Moves every headline squiggle's wave sideways with the page scroll: left while scrolling
// down, right while scrolling up, still when the scroll stops. Under reduced motion the
// squiggles stay still.
export default function SquiggleScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const squiggles = gsap.utils.toArray<HTMLElement>(".squiggle");
      // only the horizontal position is set, so each squiggle keeps its vertical offset
      const set = (y: number) =>
        squiggles.forEach((s) => {
          s.style.backgroundPositionX = `${-y * 0.25}px`;
        });
      set(window.scrollY);

      const scroll = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => set(self.scroll()),
      });

      return () => {
        scroll.kill();
        squiggles.forEach((s) => s.style.removeProperty("background-position-x"));
      };
    });
    return () => mm.revert();
  });

  return null;
}
