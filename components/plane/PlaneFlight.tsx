"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PaperPlane from "./PaperPlane";
import { buildFlight, placeStill, type Parts } from "./buildFlight";
import { choreography } from "./choreography";
import { startLenis } from "./lenis";
import { phoneChoreography } from "./phoneChoreography";
import type { Size } from "./types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function PlaneFlight() {
  const layer = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px)",
          phone: "(max-width: 1023px)",
          reduce: "(prefers-reduced-motion: reduce)",
          fine: "(pointer: fine)",
        },
        (context) => {
          const { desktop, phone, reduce, fine } = context.conditions as Record<string, boolean>;
          const stopLenis = fine && !reduce ? startLenis() : null;

          let built: gsap.Context | null = null;
          let stopDebug: (() => void) | null = null;
          let debugToken = 0;
          const build = () => {
            debugToken++;
            stopDebug?.();
            stopDebug = null;
            built?.revert();
            built = null;
            const parts = {
              layer: layer.current,
              plane: plane.current,
              body: body.current,
              shadow: shadow.current,
              trail: trail.current,
            };
            if (!parts.layer || !parts.plane || !parts.body || !parts.shadow || !parts.trail)
              return;
            const p = parts as Parts;
            p.trail.replaceChildren();
            const size: Size = {
              w: p.plane.offsetWidth,
              h: p.plane.offsetHeight,
              vw: window.innerWidth,
              vh: window.innerHeight,
            };
            built = gsap.context(() => {
              // x/y are the centres of the plane and its shadow
              gsap.set([p.plane, p.shadow], { xPercent: -50, yPercent: -50 });
              if (reduce) placeStill(p, desktop, size);
              else {
                // phones get their own hide-and-seek flight, desktop the original one
                const keys = phone ? phoneChoreography(size, p.plane) : choreography(desktop, size, p.plane);
                if (!keys) return;
                const flight = buildFlight(p, keys, size, phone);
                // Dev-only debug overlay. The NODE_ENV check is replaced at build time,
                // so production bundles drop this branch and the overlay module.
                if (
                  process.env.NODE_ENV === "development" &&
                  new URLSearchParams(window.location.search).get("plane") === "debug"
                ) {
                  const token = ++debugToken;
                  import("./PlaneDebug").then(({ attachPlaneDebug }) => {
                    if (token !== debugToken) return;
                    stopDebug = attachPlaneDebug({ keys, size, phone, ...flight });
                  });
                }
              }
              gsap.set([p.plane, p.shadow], { visibility: "visible" });
            });
            ScrollTrigger.refresh();
          };

          // Measured only once the web fonts have loaded, since they move the layout.
          let ready = false;
          (document.fonts?.ready ?? Promise.resolve()).then(() => {
            ready = true;
            build();
          });

          // Rebuild when the width changes (or, on desktop, the height) and, off phones,
          // when the page length changes. Phones ignore height-only resizes from the
          // address bar, and the page length too: the bar fires a resize as it slides,
          // which after a card opened or folded ("show less") would re-route the plane
          // mid-scroll; their final glide follows the h instead (buildFlight's `track`).
          const size = () =>
            [
              window.innerWidth,
              desktop ? window.innerHeight : 0,
              phone ? 0 : document.documentElement.scrollHeight,
            ].join("x");
          let last = size();
          let timer: number | undefined;
          const onResize = () => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
              if (!ready || size() === last) return;
              last = size();
              build();
            }, 150);
          };
          const observer = new ResizeObserver(onResize);
          observer.observe(document.body);
          window.addEventListener("resize", onResize);

          return () => {
            ready = false;
            window.clearTimeout(timer);
            observer.disconnect();
            window.removeEventListener("resize", onResize);
            debugToken++;
            stopDebug?.();
            built?.revert();
            trail.current?.replaceChildren();
            stopLenis?.();
          };
        },
      );
      return () => mm.revert();
    },
    { scope: layer },
  );

  // Fixed over the screen, under the sticky nav (z-50) and under the cards, banner and
  // flight log (z-index 2), but over plain text.
  return (
    <div
      ref={layer}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[1] h-screen overflow-hidden supports-[height:100dvh]:h-dvh"
    >
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        <g ref={trail} fill="var(--trail)" fillOpacity="0.25" />
      </svg>
      <div
        ref={shadow}
        className="invisible absolute top-0 left-0 h-[10px] w-[54px] rounded-full bg-[#111214] opacity-[0.16] blur-[6px] lg:h-4 lg:w-[90px]"
      />
      <div ref={plane} className="invisible absolute top-0 left-0 will-change-transform">
        <div ref={body}>
          {/* a gentle drift forward and back along the nose, on top of the flight
              (inside the turned and mirrored body, so it follows the nose) */}
          <div className="motion-safe:animate-[plane-float_2s_ease-in-out_infinite_alternate]">
            <PaperPlane />
          </div>
        </div>
      </div>
    </div>
  );
}
