"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Work and Experience cards hidden by their pagers are skipped; they fade in on their own
// when shown.
const PANELS =
  "#work li:not([hidden]) > article.panel, #experience li:not([hidden]) > article.panel, #toolkit li.panel";

// Cards fade in as they scroll into view while their contents rise into place. The panel
// itself is only faded, never moved: its CSS transform carries the toolkit tilt and the
// hover lift, and the plane measures the panels' positions. Under reduced motion every
// card shows immediately.
export default function CardReveal() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const panels = gsap.utils.toArray<HTMLElement>(PANELS);
      const children = panels.flatMap((p) => Array.from(p.children));
      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(children, { y: 16 });

      ScrollTrigger.batch(panels, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          const rising = batch.flatMap((p) => Array.from(p.children));
          gsap.to(batch, { autoAlpha: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" });
          gsap.to(rising, {
            y: 0,
            duration: 0.6,
            stagger: 0.04,
            ease: "power2.out",
            onComplete: () => gsap.set(rising, { clearProps: "transform" }),
          });
        },
      });

      return () => gsap.set([...panels, ...children], { clearProps: "opacity,visibility,transform" });
    });
    return () => mm.revert();
  });

  return null;
}
