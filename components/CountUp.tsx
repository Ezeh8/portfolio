"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const format = new Intl.NumberFormat("en-US");

// Counts each experience marker number ([data-count]) up from 0 when it scrolls into view,
// then puts the original text back. The number's width is held while it counts so the
// line doesn't reflow. Under reduced motion the numbers stay as written.
export default function CountUp() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const spans = gsap.utils.toArray<HTMLElement>("[data-count]");
      const originals = spans.map((span) => span.textContent ?? "");
      const release = (span: HTMLElement, i: number) => {
        span.textContent = originals[i];
        span.style.removeProperty("display");
        span.style.removeProperty("width");
      };

      spans.forEach((span, i) => {
        const target = Number(span.dataset.count);
        if (!Number.isFinite(target)) return;
        span.style.display = "inline-block";
        span.style.width = `${span.getBoundingClientRect().width}px`;
        span.textContent = "0";
        const counter = { value: 0 };
        ScrollTrigger.create({
          trigger: span,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(counter, {
              value: target,
              duration: 2.4,
              ease: "power1.out",
              onUpdate: () => {
                span.textContent = format.format(Math.round(counter.value));
              },
              // a small pop as the number lands, then the original text goes back
              onComplete: () =>
                gsap.fromTo(
                  span,
                  { scale: 1 },
                  {
                    scale: 1.1,
                    duration: 0.12,
                    ease: "power1.out",
                    yoyo: true,
                    repeat: 1,
                    transformOrigin: "50% 60%",
                    onComplete: () => {
                      gsap.set(span, { clearProps: "transform" });
                      release(span, i);
                    },
                  },
                ),
            }),
        });
      });

      return () => spans.forEach(release);
    });
    return () => mm.revert();
  });

  return null;
}
