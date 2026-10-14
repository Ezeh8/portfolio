"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Banner marquee: every banner always drifts left at a slow base speed. Scrolling down
// changes nothing. Scrolling up turns it right and moves it with the scroll, faster when
// scrolling faster; when the upward scroll stops it eases back to the left drift. The
// track holds two identical halves, so wrapping its x over half its width loops
// seamlessly. A banner off screen doesn't move. Under reduced motion the banners stand
// still.
const BASE_SPEED = 50; // px per second
const MAX_BOOST = 1500; // px per second

export default function BannerScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const banners = Array.from(document.querySelectorAll<HTMLElement>("[data-banner]")).flatMap(
        (wrapper) => {
          const track = wrapper.querySelector<HTMLElement>(".banner-track");
          if (!track) return [];
          return [
            {
              wrapper,
              track,
              x: 0,
              half: track.scrollWidth / 2,
              // assumed on screen until the observer says otherwise, so it drifts from the start
              onScreen: true,
              setX: gsap.quickSetter(track, "x", "px") as (x: number) => void,
            },
          ];
        },
      );

      // Off-screen banners don't move. The observer reports every banner's state as soon
      // as it starts watching, so nothing waits on a scroll to start drifting.
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const banner = banners.find((b) => b.wrapper === entry.target);
          if (banner) banner.onScreen = entry.isIntersecting;
        });
      });
      banners.forEach((b) => observer.observe(b.wrapper));

      const measure = () => {
        banners.forEach((b) => {
          b.half = b.track.scrollWidth / 2;
        });
      };
      ScrollTrigger.addEventListener("refresh", measure);

      // Shared by every banner.
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
            upBoost = Math.min(Math.abs(self.getVelocity()) * 0.25, MAX_BOOST);
          } else {
            upAt = 0; // scrolling down: back to the normal drift at once
          }
        },
      });

      const tick = (_time: number, deltaTime: number) => {
        const dt = deltaTime / 1000;
        const scrollingUp = performance.now() - upAt < 150;
        const goal = scrollingUp ? BASE_SPEED + upBoost : -BASE_SPEED;
        velocity += (goal - velocity) * 0.1; // smooth turn-around
        banners.forEach((b) => {
          if (!b.onScreen || b.half <= 0) return;
          b.x = gsap.utils.wrap(-b.half, 0, b.x + velocity * dt);
          b.setX(b.x);
        });
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        ScrollTrigger.removeEventListener("refresh", measure);
        scroll.kill();
        observer.disconnect();
        banners.forEach((b) => gsap.set(b.track, { clearProps: "transform" }));
      };
    });
    return () => mm.revert();
  });

  return null;
}
