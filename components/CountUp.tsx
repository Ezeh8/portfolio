"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const format = new Intl.NumberFormat("en-US");

// Counts each experience marker number ([data-count]) up from 0 when it scrolls into view
// (its top within the upper 85% of the screen), then puts the original text back. The
// number's width is held while it counts so the line doesn't reflow. An IntersectionObserver
// starts each count, so a number on a card the Experience pager shows later counts up when
// it appears; the width is measured then, since a hidden card has none. Under reduced
// motion the numbers stay as written.
export default function CountUp() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const spans = gsap.utils.toArray<HTMLElement>("[data-count]");
      const originals = new Map(spans.map((span) => [span, span.textContent ?? ""]));
      const release = (span: HTMLElement) => {
        span.textContent = originals.get(span) ?? "";
        span.style.removeProperty("display");
        span.style.removeProperty("width");
      };

      const count = (span: HTMLElement) => {
        const target = Number(span.dataset.count);
        if (!Number.isFinite(target)) return;
        span.style.display = "inline-block";
        span.style.width = `${span.getBoundingClientRect().width}px`;
        span.textContent = "0";
        const counter = { value: 0 };
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
                  release(span);
                },
              },
            ),
        });
      };

      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            count(entry.target as HTMLElement);
          }),
        { rootMargin: "0px 0px -15% 0px" },
      );
      spans.forEach((span) => observer.observe(span));

      return () => {
        observer.disconnect();
        spans.forEach(release);
      };
    });
    return () => mm.revert();
  });

  return null;
}
