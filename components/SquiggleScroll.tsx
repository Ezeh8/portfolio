"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Headline squiggles flow like the banners: every squiggle's wave always drifts gently
// left, from page load. Scrolling down changes nothing. Scrolling up turns the wave right
// and moves it with the scroll, faster when scrolling faster; when the upward scroll stops
// it eases back to the left flow. Only the horizontal background position is set, so each
// squiggle keeps its vertical offset. Under reduced motion the squiggles stay still.
const BASE_SPEED = 24; // px per second, gentle constant flow
const MAX_BOOST = 400; // px per second

export default function SquiggleScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const squiggles = gsap.utils.toArray<HTMLElement>(".squiggle");

      // Shared by every squiggle.
      let x = 0;
      let velocity = -BASE_SPEED; // signed px per second; negative moves left
      let upAt = 0; // time (performance.now()) of the last upward scroll update
      let upBoost = 0; // extra px per second while scrolling up

      const scroll = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (self.direction === -1) {
            // scrolling up
            upAt = performance.now();
            upBoost = Math.min(Math.abs(self.getVelocity()) * 0.1, MAX_BOOST);
          } else {
            upAt = 0; // scrolling down: back to the normal flow at once
          }
        },
      });

      const tick = (_time: number, deltaTime: number) => {
        const dt = deltaTime / 1000;
        const scrollingUp = performance.now() - upAt < 150;
        const goal = scrollingUp ? BASE_SPEED + upBoost : -BASE_SPEED;
        velocity += (goal - velocity) * 0.1; // smooth turn-around
        x += velocity * dt;
        squiggles.forEach((s) => {
          s.style.backgroundPositionX = `${x}px`;
        });
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        scroll.kill();
        squiggles.forEach((s) => s.style.removeProperty("background-position-x"));
      };
    });
    return () => mm.revert();
  });

  return null;
}
