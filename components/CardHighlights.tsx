"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Lights a project card's readout (data-lit) once the card's centre crosses the middle
// of the screen, and turns it off again when scrolling back above that point. Under
// reduced motion every readout stays lit.
export default function CardHighlights() {
  useGSAP(() => {
    const readouts = site.work.projects.flatMap((p) => {
      const card = document.getElementById(p.id);
      const readout = card?.querySelector("[data-readout]");
      return card && readout ? [{ card, readout }] : [];
    });
    const lit = (el: Element, on: boolean) =>
      on ? el.setAttribute("data-lit", "") : el.removeAttribute("data-lit");

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: reduce)", () => {
      readouts.forEach(({ readout }) => lit(readout, true));
      return () => readouts.forEach(({ readout }) => lit(readout, false));
    });
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      readouts.forEach(({ card, readout }) =>
        ScrollTrigger.create({
          trigger: card,
          start: "center center",
          end: "max",
          onEnter: () => lit(readout, true),
          onLeaveBack: () => lit(readout, false),
        }),
      );
      return () => readouts.forEach(({ readout }) => lit(readout, false));
    });
    return () => mm.revert();
  });
  return null;
}
