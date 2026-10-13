"use client";

import "lenis/dist/lenis.css";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { site } from "@/content/site";
import PaperPlane from "./PaperPlane";
import { clamp, heading, inOrder, nearestClear } from "./flightPath";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CARD_IDS = site.work.projects.map((p) => p.id);
const TRAIL_COLOR = "#111214";

// Document coordinates of a box.
function docRect(el: Element | Range) {
  const r = el.getBoundingClientRect();
  const left = r.left + window.scrollX;
  const top = r.top + window.scrollY;
  return { left, top, right: left + r.width, bottom: top + r.height, height: r.height };
}

const $ = (selector: string) => document.querySelector(selector);
const navBottom = () => Math.max(0, $("header")?.getBoundingClientRect().bottom ?? 0);
const maxScroll = () => ScrollTrigger.maxScroll(window);

// A keyframe: at scroll position `s` the plane's centre is at x% of the screen width and
// y% of its height, at `scale`. `tilt` and `facing` override the heading the plane would
// otherwise take from its direction of travel on the leg that ends here; `slowTurn`
// turns it over the whole leg instead of the first third. The eases shape the leg.
type Key = {
  s: number;
  x: number;
  y: number;
  scale: number;
  tilt?: number;
  facing?: 1 | -1;
  slowTurn?: boolean;
  xEase?: string;
  yEase?: string;
};

type Size = { w: number; h: number; vw: number; vh: number };

// Text lines, cards and the banner, as document boxes: what a resting plane must avoid.
function obstacles(layer: HTMLElement) {
  const boxes: ReturnType<typeof docRect>[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim() || layer.contains(node)) continue;
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (!r.width || !r.height) continue;
      boxes.push({
        left: r.left + window.scrollX,
        top: r.top + window.scrollY,
        right: r.right + window.scrollX,
        bottom: r.bottom + window.scrollY,
        height: r.height,
      });
    }
  }
  document.querySelectorAll(".panel, [data-plane-cover]").forEach((el) => boxes.push(docRect(el)));
  return boxes;
}

// Moves a resting spot (in screen %) into the nearest empty space at scroll position s.
function clearSpot(
  name: string,
  spot: { x: number; y: number },
  s: number,
  scale: number,
  tilt: number,
  size: Size,
  layer: HTMLElement,
) {
  const { w, h, vw, vh } = size;
  const rad = (Math.abs(tilt) * Math.PI) / 180;
  const bw = (w * Math.cos(rad) + h * Math.sin(rad)) * scale + 12;
  const bh = (w * Math.sin(rad) + h * Math.cos(rad)) * scale + 12;
  const onScreen = obstacles(layer).map((o) => ({
    left: o.left,
    right: o.right,
    top: o.top - s,
    bottom: o.bottom - s,
  }));
  const area = { left: 0, right: vw, top: navBottom(), bottom: vh };
  const found = nearestClear(
    (spot.x / 100) * vw,
    (spot.y / 100) * vh,
    bw,
    bh,
    onScreen,
    area,
    Math.round(Math.min(vw, vh) * 0.4),
  );
  const result = { x: (found.x / vw) * 100, y: (found.y / vh) * 100 };
  if (found.moved && process.env.NODE_ENV !== "production") {
    console.info(
      `[plane] ${name} nudged from (${spot.x.toFixed(1)}, ${spot.y.toFixed(1)}) to (${result.x.toFixed(1)}, ${result.y.toFixed(1)}) to keep it off text`,
    );
  }
  return result;
}

// The hero resting spot, in screen % at scroll 0. Desktop: just above the flight log's
// top-right corner (the "follow the plane" note sits at its left). Phones: x 74, y 55.
function heroRest(desktop: boolean, size: Size, layer: HTMLElement) {
  const { w, h, vw, vh } = size;
  const log = $("#hero .panel");
  let spot = { x: 74, y: 55 };
  if (desktop && log) {
    const r = docRect(log);
    spot = { x: ((r.right - w / 2 - 4) / vw) * 100, y: ((r.top - h / 2 - 16) / vh) * 100 };
  }
  return clearSpot("hero rest", spot, 0, 1, -6, size, layer);
}

// The whole flight, in screen units, timed against the sections' scroll positions.
function choreography(desktop: boolean, size: Size, layer: HTMLElement): Key[] | null {
  const { vw, vh } = size;
  const max = maxScroll();
  const hero = $("#hero");
  const about = $("#about");
  const experience = $("#experience");
  const quote = $("#quote");
  const contactLabel = $("#contact p");
  const cards = CARD_IDS.map((id) => document.getElementById(id));
  if (!hero || !about || !experience || !quote || !contactLabel || cards.some((c) => !c))
    return null;
  const [firstCard] = cards as HTMLElement[];

  // Scroll position at which the point `frac` of the way down `el` sits `screen` of the
  // way down the screen.
  const at = (el: Element, frac: number, screen: number) => {
    const r = docRect(el);
    return r.top + frac * r.height - screen * vh;
  };

  const rest = heroRest(desktop, size, layer);
  const restY = rest.y;

  // 3. behind the first project card, measured where that card is at that moment
  const behindS = at(firstCard, 0.5, 0.6);
  const first = docRect(firstCard);
  const behind = { x: (((first.left + first.right) / 2) / vw) * 100, y: 60 };

  // 4. the invoice leg ends behind a card covering (55, 52); time it so the next card
  // in that column (or the invoice card itself on one-column layouts) is centred there
  const cover =
    (cards.slice(2) as HTMLElement[]).find((c) => {
      const r = docRect(c);
      return r.left <= 0.55 * vw && r.right >= 0.55 * vw;
    }) ?? (cards[2] as HTMLElement);
  const invoiceS = Math.max(at(cover, 0.5, 0.52), behindS + vh * 0.5);
  const work = (f: number) => behindS + (invoiceS - behindS) * f;

  const landing = clearSpot(
    "contact landing",
    { x: 80, y: 62 },
    max,
    0.45,
    45,
    size,
    layer,
  );

  const keys: Key[] = [
    // 1. hero rest, then a slight drift up and right
    { s: 0, x: rest.x, y: restY, scale: 1, tilt: -6, facing: 1 },
    { s: at(hero, 1, 0.5), x: rest.x + 3, y: restY - 3, scale: 1, tilt: -8, facing: 1 },
    // 2. banner and about: near the right edge, easing slowly down, shrinking
    {
      s: at(about, 1, 0.5),
      x: 80,
      y: clamp(restY + 15, 45, 70),
      scale: 0.6,
      tilt: 14,
      facing: 1,
      slowTurn: true,
    },
    // 3. entering work: slip behind the first card
    { s: behindS, ...behind, scale: 0.45 },
    // 4. LLM Wiki: re-emerge on the right, steep dive, sweep left and out
    { s: work(0.14), x: 87, y: 26, scale: 0.65 },
    { s: work(0.26), x: 84, y: 52, scale: 0.65 },
    { s: work(0.44), x: -14, y: 75, scale: 0.6, yEase: "sine.out" },
    // Tool Access Controller: re-enter low on the left, climb to the upper right
    { s: work(0.47), x: -14, y: 84, scale: 0.5, tilt: 0, facing: 1 },
    { s: work(0.52), x: 10, y: 84, scale: 0.5 },
    { s: work(0.76), x: 90, y: 43, scale: 0.5 },
    // Invoice Exception Handler: right to left, slightly down, behind a card
    { s: invoiceS, x: 55, y: 52, scale: 0.45 },
    // Command Centre: re-appear at the left edge
    { s: invoiceS + vh * 0.3, x: 8, y: 68, scale: 0.35 },
    // 5. experience, toolkit, quote: parked at the left edge, nose up, drifting up
    { s: at(experience, 0, 0.5), x: 5, y: 68, scale: 0.35, tilt: -90, facing: 1 },
    { s: at(quote, 0.5, 0.5), x: 5, y: 52, scale: 0.15, tilt: -90, facing: 1, xEase: "none", yEase: "none" },
    // 6. contact: out of view to the upper left, in near the label, glide to land
    { s: at(quote, 0.5, 0.5) + vh * 0.1, x: -10, y: 18, scale: 0.4, tilt: 20, facing: 1 },
    { s: at(contactLabel, 0.5, 0.48), x: 20, y: 48, scale: 0.4 },
    {
      s: max,
      x: landing.x,
      y: landing.y,
      scale: 0.45,
      tilt: 45,
      facing: 1,
      slowTurn: true,
      xEase: "sine.out",
      yEase: "sine.inOut",
    },
  ];
  const s = inOrder(
    keys.map((k) => k.s),
    max,
  );
  return keys.map((k, i) => ({ ...k, s: s[i] }));
}

// Index of the leg whose dotted trail is drawn: the final glide into Contact.
const trailLeg = (keys: Key[]) => keys.length - 2;

type Parts = {
  layer: HTMLElement;
  plane: HTMLElement;
  body: HTMLElement;
  shadow: HTMLElement;
  trail: SVGGElement;
};

// One timeline scrubbed against the page scroll. Its time is the scroll position in
// pixels; each leg tweens a proxy from one keyframe to the next.
function buildFlight(parts: Parts, keys: Key[], size: Size) {
  const { plane, body, shadow, trail } = parts;
  const { w, h, vw, vh } = size;

  // Facing and tilt for each leg, from its direction of travel unless overridden.
  const legs = keys.slice(1).map((b, i) => ({ a: keys[i], b }));
  let facing: 1 | -1 = keys[0].facing ?? 1;
  const turns = legs.map(({ a, b }) => {
    const dir = heading(((b.x - a.x) / 100) * vw, ((b.y - a.y) / 100) * vh, facing);
    facing = b.facing ?? dir.facing;
    return { facing, tilt: b.tilt ?? dir.tilt };
  });

  const proxy = {
    x: keys[0].x,
    y: keys[0].y,
    scale: keys[0].scale,
    tilt: keys[0].tilt ?? 0,
    facing: keys[0].facing ?? 1,
  };

  // Trail dots along the last leg's real path, about every 9px (6px on phones).
  const t = trailLeg(keys);
  const { a: ta, b: tb } = legs[t];
  const ex = gsap.parseEase(tb.xEase ?? "sine.inOut");
  const ey = gsap.parseEase(tb.yEase ?? "sine.inOut");
  const path = Array.from({ length: 201 }, (_, i) => {
    const u = i / 200;
    return {
      u,
      x: ((ta.x + (tb.x - ta.x) * ex(u)) / 100) * vw,
      y: ((ta.y + (tb.y - ta.y) * ey(u)) / 100) * vh,
    };
  });
  const gap = w > 100 ? 9 : 6;
  const dots: { u: number; el: SVGCircleElement }[] = [];
  let run = gap;
  for (let i = 1; i < path.length; i++) {
    run += Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y);
    if (run < gap) continue;
    run = 0;
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", path[i].x.toFixed(1));
    dot.setAttribute("cy", path[i].y.toFixed(1));
    dot.setAttribute("r", w > 100 ? "1.6" : "1.2");
    dot.setAttribute("visibility", "hidden");
    trail.appendChild(dot);
    dots.push({ u: path[i].u, el: dot });
  }
  let shown = 0;

  const setX = gsap.quickSetter(plane, "x", "px");
  const setY = gsap.quickSetter(plane, "y", "px");
  const setScale = gsap.quickSetter(plane, "scale");
  const setRotation = gsap.quickSetter(plane, "rotation", "deg");
  const setFacing = gsap.quickSetter(body, "scaleX");
  const setShadowX = gsap.quickSetter(shadow, "x", "px");
  const setShadowY = gsap.quickSetter(shadow, "y", "px");
  const setShadowScale = gsap.quickSetter(shadow, "scale");

  const draw = () => {
    const px = (proxy.x / 100) * vw;
    const py = (proxy.y / 100) * vh;
    setX(px);
    setY(py);
    setScale(proxy.scale);
    setFacing(proxy.facing);
    setRotation(proxy.facing * proxy.tilt);
    // the shadow follows position and scale only
    setShadowX(px);
    setShadowY(py + h * 0.62 * proxy.scale);
    setShadowScale(proxy.scale);

    const u = clamp((tl.time() - ta.s) / (tb.s - ta.s || 1), 0, 1);
    let n = 0;
    while (n < dots.length && dots[n].u <= u) n++;
    for (let i = Math.min(n, shown); i < Math.max(n, shown); i++)
      dots[i].el.setAttribute("visibility", i < n ? "visible" : "hidden");
    shown = n;
  };

  const tl = gsap.timeline({
    onUpdate: draw,
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });
  let tilt = proxy.tilt;
  legs.forEach(({ a, b }, i) => {
    const d = b.s - a.s;
    const turn = turns[i];
    const from = { immediateRender: false };
    tl.fromTo(proxy, { x: a.x }, { x: b.x, duration: d, ease: b.xEase ?? "sine.inOut", ...from }, a.s)
      .fromTo(proxy, { y: a.y }, { y: b.y, duration: d, ease: b.yEase ?? "sine.inOut", ...from }, a.s)
      .fromTo(proxy, { scale: a.scale }, { scale: b.scale, duration: d, ease: "sine.inOut", ...from }, a.s)
      .set(proxy, { facing: turn.facing }, a.s)
      .fromTo(
        proxy,
        { tilt },
        { tilt: turn.tilt, duration: b.slowTurn ? d : d / 3, ease: "sine.inOut", ...from },
        a.s,
      );
    tilt = turn.tilt;
  });
  tl.set({}, {}, keys[keys.length - 1].s);

  tl.progress(clamp(window.scrollY / Math.max(1, maxScroll()), 0, 1));
  draw();
}

// Reduced motion: no flight and no trail. The plane rests at its hero spot and scrolls
// with the page like any other content.
function placeStill(parts: Parts, desktop: boolean, size: Size) {
  const { layer, plane, shadow } = parts;
  const rest = heroRest(desktop, size, layer);
  const x = (rest.x / 100) * size.vw;
  const y = (rest.y / 100) * size.vh;
  gsap.set(layer, { position: "absolute", height: 0, overflow: "visible" });
  gsap.set(plane, { x, y, rotation: -6, scale: 1 });
  gsap.set(shadow, { x, y: y + size.h * 0.62, scale: 1 });
}

// Smooth scrolling for mice and trackpads, driven from GSAP's ticker so ScrollTrigger and
// Lenis share one clock. In-page links scroll through Lenis and stop with the target's
// top just below the sticky nav.
function startLenis() {
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    const link = (e.target as Element | null)?.closest?.('a[href^="#"]');
    const id = link?.getAttribute("href")?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    // Lenis already subtracts the target's scroll-margin-top; add whatever the nav
    // covers beyond it.
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const nav = $("header")?.getBoundingClientRect().height ?? 0;
    lenis.scrollTo(target, { offset: -Math.max(0, nav - margin) });
    history.pushState(null, "", `#${id}`);
  };
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33); // GSAP's default
    lenis.destroy();
  };
}

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
          reduce: "(prefers-reduced-motion: reduce)",
          fine: "(pointer: fine)",
        },
        (context) => {
          const { desktop, reduce, fine } = context.conditions as Record<string, boolean>;
          const stopLenis = fine && !reduce ? startLenis() : null;

          let built: gsap.Context | null = null;
          const build = () => {
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
                const keys = choreography(desktop, size, p.layer);
                if (!keys) return;
                buildFlight(p, keys, size);
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

          // Rebuild when the width changes (or, on desktop, the height) and when the page
          // length changes. Phones ignore height-only resizes from the address bar.
          const size = () =>
            [
              window.innerWidth,
              desktop ? window.innerHeight : 0,
              document.documentElement.scrollHeight,
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
        <g ref={trail} fill={TRAIL_COLOR} fillOpacity="0.25" />
      </svg>
      <div
        ref={shadow}
        className="invisible absolute top-0 left-0 h-[10px] w-[54px] rounded-full bg-[#111214] opacity-[0.16] blur-[6px] lg:h-4 lg:w-[90px]"
      />
      <div ref={plane} className="invisible absolute top-0 left-0 will-change-transform">
        <div ref={body}>
          <PaperPlane />
        </div>
      </div>
    </div>
  );
}
