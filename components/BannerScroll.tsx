"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Moves each banner's track with the page scroll: left while scrolling down, right while
// scrolling up, still when the scroll stops. Under reduced motion the banners stay still.
export default function BannerScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      document.querySelectorAll<HTMLElement>("[data-banner]").forEach((wrapper) => {
        const track = wrapper.querySelector(".banner-track");
        if (!track) return;
        gsap.fromTo(
          track,
          { x: 0 },
          {
            x: () => -window.innerHeight * 0.8,
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.3,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    });
    return () => mm.revert();
  });

  return null;
}
