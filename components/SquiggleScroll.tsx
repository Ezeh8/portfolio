"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Headline squiggles flow like the banners: every squiggle's wave always drifts gently
// left, from page load. Scrolling down changes nothing. Scrolling up turns the wave right
// and moves it with the scroll, faster when scrolling faster; when the upward scroll stops
// it eases back to the left flow. Under reduced motion the squiggles stay still.
//
// Every squiggle follows one shared value: this sets --squiggle-shift on the page root and
// each .squiggle reads it in its CSS background position. So all squiggles always move in
// exactly the same pattern, including any headline drawn after this started. The shift is
// in em, i.e. in wave lengths (one wave is 0.5em), so a bigger headline's wider wave moves
// the same number of waves per second as a smaller one's.
const REF = 56; // px: the section headline size the speeds below were tuned at
const BASE_SPEED = 24; // px per second at REF, gentle constant flow
const MAX_BOOST = 400; // px per second at REF
const WAVE = 0.5; // em, one wave of the squiggle (its background-size width)

export default function SquiggleScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const root = document.documentElement;

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
        // wrapped to one wave, so the number stays small; the pattern repeats every wave
        x = gsap.utils.wrap(0, WAVE, x + (velocity * dt) / REF);
        root.style.setProperty("--squiggle-shift", `${x.toFixed(4)}em`);
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        scroll.kill();
        root.style.removeProperty("--squiggle-shift");
      };
    });
    return () => mm.revert();
  });

  return null;
}
