"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Banner marquee: every banner drifts on its own at a slow base speed and never stops.
// Scrolling pushes it faster in step with the scroll speed, and sets its direction: left
// while scrolling down, right while scrolling up. When the scroll stops the push fades
// back to the slow drift, in the last direction. The track holds two identical halves,
// so wrapping its x over half its width loops seamlessly. A banner off screen doesn't
// move. Under reduced motion the banners stand still.
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
          const banner = {
            track,
            x: 0,
            half: track.scrollWidth / 2,
            onScreen: false,
            setX: gsap.quickSetter(track, "x", "px") as (x: number) => void,
          };
          const trigger = ScrollTrigger.create({
            trigger: wrapper,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              banner.onScreen = self.isActive;
            },
          });
          banner.onScreen = trigger.isActive;
          return [Object.assign(banner, { trigger })];
        },
      );

      const measure = () => {
        banners.forEach((b) => {
          b.half = b.track.scrollWidth / 2;
        });
      };
      ScrollTrigger.addEventListener("refresh", measure);

      // Shared by every banner.
      let direction = -1; // -1 moves left
      let boost = 0;
      let target = 0;

      const scroll = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          direction = self.direction === 1 ? -1 : 1;
          target = Math.min(Math.abs(self.getVelocity()) * 0.25, MAX_BOOST);
        },
      });

      const tick = (_time: number, deltaTime: number) => {
        const dt = deltaTime / 1000;
        target *= 0.9;
        boost += (target - boost) * 0.1;
        const speed = BASE_SPEED + boost;
        banners.forEach((b) => {
          if (!b.onScreen || b.half <= 0) return;
          b.x = gsap.utils.wrap(-b.half, 0, b.x + direction * speed * dt);
          b.setX(b.x);
        });
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        ScrollTrigger.removeEventListener("refresh", measure);
        scroll.kill();
        banners.forEach((b) => {
          b.trigger.kill();
          gsap.set(b.track, { clearProps: "transform" });
        });
      };
    });
    return () => mm.revert();
  });

  return null;
}
