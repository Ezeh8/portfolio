"use client";

import "lenis/dist/lenis.css";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { site } from "@/content/site";
import PaperPlane from "./PaperPlane";
import { clamp, heading, inOrder, isClear, nearestClear } from "./flightPath";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CARD_IDS = site.work.projects.map((p) => p.id);

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
export type Key = {
  /** Name of the leg that ends at this keyframe (shown by the debug overlay). */
  name: string;
  s: number;
  x: number;
  y: number;
  scale: number;
  tilt?: number;
  facing?: 1 | -1;
  slowTurn?: boolean;
  /** Cap on the travel-direction tilt for this leg, in degrees up or down (default 70). */
  maxTilt?: number;
  /** Bows the leg's path downward by this many % of the screen height at its middle. */
  sag?: number;
  xEase?: string;
  yEase?: string;
};

// A bank turn (facing flipping through scaleX 0) takes this share of a leg's scroll.
const BANK = 0.08;
const onScreen = (k: Key) => k.x >= 0 && k.x <= 100 && k.y >= 0 && k.y <= 100;

export type Size = { w: number; h: number; vw: number; vh: number };

// Overlap between the landed plane's lowest point and the top of the letters, in px.
const LANDING_OVERLAP = 4;
// The landed plane: nose left, tilted gently down.
const LANDING_TILT = 10;
const LANDING_SCALE = 0.45;

// How far the plane's lowest point sits below its centre, in px, when drawn facing
// `facing` at `tilt` and `scale`. Read from the plane's own SVG shapes.
function lowestPoint(plane: HTMLElement, size: Size, facing: 1 | -1, tilt: number, scale: number) {
  const svg = plane.querySelector("svg");
  const box = svg?.viewBox.baseVal;
  if (!svg || !box?.width || !box.height) return (size.h / 2) * scale;
  const rad = ((facing < 0 ? -1 : 1) * tilt * Math.PI) / 180;
  let lowest = -Infinity;
  svg.querySelectorAll("polygon").forEach((polygon) => {
    for (const point of Array.from(polygon.points)) {
      const x = facing * ((point.x / box.width) * size.w - size.w / 2);
      const y = (point.y / box.height) * size.h - size.h / 2;
      lowest = Math.max(lowest, (x * Math.sin(rad) + y * Math.cos(rad)) * scale);
    }
  });
  return Number.isFinite(lowest) ? lowest : (size.h / 2) * scale;
}

// The landing spot (last keyframe), in screen % at the bottom of the scroll: the plane
// sits on top of the highlighted word of the closing headline ("touch"), centred on it,
// its lowest point LANDING_OVERLAP px into the tops of the letters. The letters' top
// comes from the font's own glyph metrics, not the line box.
function headlineLanding(word: HTMLElement, plane: HTMLElement, size: Size, max: number) {
  const { vw, vh } = size;
  const r = docRect(word);
  const style = getComputedStyle(word);
  let glyphTop = r.top + r.height * 0.2;
  const ctx = document.createElement("canvas").getContext("2d");
  if (ctx) {
    ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const m = ctx.measureText((word.textContent ?? "").toLowerCase());
    if (m.fontBoundingBoxAscent) glyphTop = r.top + m.fontBoundingBoxAscent - m.actualBoundingBoxAscent;
  }
  const below = lowestPoint(plane, size, -1, LANDING_TILT, LANDING_SCALE);
  const x = (r.left + r.right) / 2;
  const y = glyphTop - max + LANDING_OVERLAP - below;
  if (process.env.NODE_ENV !== "production") {
    // the plane's top edge (roughly) must clear the nav, the headline's bottom the screen
    if (y - (size.h * LANDING_SCALE) / 2 < navBottom() || r.bottom - max > vh)
      console.warn("[plane] the closing headline is not fully on screen, with room above it, at the bottom of the scroll");
  }
  return { x: (x / vw) * 100, y: (y / vh) * 100 };
}

// The hero resting spot (leg 0), in screen % at scroll 0, measured from the "follow the
// plane" note on every layout: just below the note, overlapping its lower edge by 8px,
// centred under the tip of the note's arrow. The note draws on top (z-index 2).
// If that would cover the headline, the hero buttons or the flight log, the plane moves
// up under the note in 2px steps until it doesn't; failing that, to the nearest clear
// spot. Falls back to x 26, y 55 if the note is missing.
function heroRest(size: Size) {
  const { w, h, vw, vh } = size;
  const note = $("#hero .font-hand");
  const tip = note?.querySelector("svg path:last-of-type");
  if (!note || !tip) return { x: 26, y: 55 };

  // The arrow points down, so its tip is the lowest point of the arrowhead.
  const head = docRect(tip);
  const x = (head.left + head.right) / 2;
  const y = docRect(note).bottom - 8 + h / 2;

  // The plane's box at its resting tilt (-6°), with a little breathing room.
  const rad = (6 * Math.PI) / 180;
  const bw = w * Math.cos(rad) + h * Math.sin(rad) + 8;
  const bh = w * Math.sin(rad) + h * Math.cos(rad) + 8;
  const avoid: { left: number; top: number; right: number; bottom: number }[] = [];
  const h1 = $("#hero h1");
  if (h1) {
    const range = document.createRange();
    range.selectNodeContents(h1);
    for (const r of range.getClientRects())
      avoid.push({
        left: r.left + window.scrollX,
        top: r.top + window.scrollY,
        right: r.right + window.scrollX,
        bottom: r.bottom + window.scrollY,
      });
  }
  document.querySelectorAll("#hero a, #hero .panel").forEach((el) => avoid.push(docRect(el)));
  // At scroll 0: below the sticky nav. No bottom limit, so the plane stays under the note
  // even when the note sits low on a tall phone hero.
  const area = {
    left: 0,
    right: vw,
    top: ($("header") as HTMLElement | null)?.offsetHeight ?? 0,
    bottom: Infinity,
  };

  let spot = { x, y };
  let how = "";
  if (!isClear(x, y, bw, bh, avoid, area)) {
    // move up behind the note, at most until the plane's centre reaches the note's top
    const limit = docRect(note).top;
    let up = y;
    while (up > limit && !isClear(x, up, bw, bh, avoid, area)) up -= 2;
    if (isClear(x, up, bw, bh, avoid, area)) {
      spot = { x, y: up };
      how = `moved up ${Math.round(y - up)}px under the note`;
    } else {
      const found = nearestClear(x, y, bw, bh, avoid, area, Math.round(Math.min(vw, vh) * 0.4));
      spot = { x: found.x, y: found.y };
      how = `moved to the nearest clear spot (${Math.round(found.x - x)}, ${Math.round(found.y - y)})px`;
    }
  }
  const result = { x: (spot.x / vw) * 100, y: (spot.y / vh) * 100 };
  if (process.env.NODE_ENV !== "production") {
    console.info(
      `[plane] hero rest at (${result.x.toFixed(1)}, ${result.y.toFixed(1)})` +
        (how ? `: ${how} to keep clear of the headline, buttons and flight log` : ", under the note"),
    );
  }
  return result;
}

// The whole flight, in screen units, timed against the sections' scroll positions.
function choreography(desktop: boolean, size: Size, plane: HTMLElement): Key[] | null {
  const { vw, vh } = size;
  const max = maxScroll();
  const hero = $("#hero");
  const about = $("#about");
  const work = $("#work");
  const toolkit = $("#toolkit");
  const secondBanner = $("#second-banner");
  const touch = $("#contact .squiggle") as HTMLElement | null;
  const firstCard = document.getElementById(CARD_IDS[0]);
  if (!hero || !about || !work || !toolkit || !secondBanner || !touch || !firstCard) return null;

  // Scroll position at which the point `frac` of the way down `el` sits `screen` of the
  // way down the screen.
  const at = (el: Element, frac: number, screen: number) => {
    const r = docRect(el);
    return r.top + frac * r.height - screen * vh;
  };

  const rest = heroRest(size);
  const restY = rest.y;

  // 3. behind the first project card, measured where that card is at that moment
  const behindS = at(firstCard, 0.5, 0.6);
  const first = docRect(firstCard);
  const behind = { x: (((first.left + first.right) / 2) / vw) * 100, y: 60 };

  // 9. on top of "touch" in the closing headline, at the bottom of the scroll
  const landing = headlineLanding(touch, plane, size, max);

  // The whole path runs mirrored: the plane faces left for most of it.
  // Leg N runs from keyframe N-1 to keyframe N; keyframe 0 is the start. The numbers
  // match the debug overlay (?plane=debug in development).
  const keys: Key[] = [
    // 1. hero rest, then a slight drift up and left
    // keyframe 0: start
    { name: "hero rest", s: 0, x: rest.x, y: restY, scale: 1, tilt: -6, facing: -1 },
    // leg 1
    {
      name: "hero drift",
      s: at(hero, 1, 0.5),
      x: rest.x - 3,
      y: restY - 3,
      scale: 1,
      tilt: -8,
      facing: -1,
    },
    // 2. banner and about: near the left edge, easing slowly down, shrinking
    // leg 2
    {
      name: "banner and about",
      s: at(about, 1, 0.5),
      x: 20,
      y: clamp(restY + 15, 45, 70),
      scale: 0.6,
      tilt: 14,
      facing: -1,
      slowTurn: true,
    },
    // 3. entering work: slip behind the first card
    // leg 3
    { name: "behind first card", s: behindS, ...behind, scale: 0.45 },
    // 4. Work: one glide right with a gentle downward bow, behind the project cards
    // leg 4
    {
      name: "work glide right",
      s: at(work, 1, 0.5),
      x: 88,
      y: 58,
      scale: 0.5,
      maxTilt: 20,
      sag: 4,
    },
    // 5. Experience and Toolkit: one slow glide left, rising slightly, behind the cards
    // leg 5
    {
      name: "experience + toolkit glide left",
      s: at(toolkit, 1, 0.5),
      x: 12,
      y: 48,
      scale: 0.45,
      maxTilt: 20,
    },
    // 6. Second banner: one glide right, rising, behind the banner, into the off-screen
    // upper-right leg
    // leg 6
    {
      name: "second banner glide right",
      s: at(secondBanner, 0.5, 0.5),
      x: 85,
      y: 28,
      scale: 0.4,
      maxTilt: 20,
    },
    // 7. closing block: out of view to the upper right, back in from the upper right,
    // glide down-left onto the headline
    // leg 7
    {
      name: "off-screen upper right",
      s: at(secondBanner, 0.5, 0.5) + vh * 0.1,
      x: 110,
      y: 18,
      scale: 0.4,
      tilt: 20,
      facing: -1,
    },
    // leg 8: in from the upper right, on the way to the landing spot
    {
      name: "closing entry from upper right",
      s: at(touch, 0.5, 0.6),
      x: 80,
      y: Math.min(landing.y - 6, 48),
      scale: 0.4,
    },
    // leg 9: completes exactly at the bottom of the scroll
    {
      name: "landing on headline",
      s: max,
      x: landing.x,
      y: landing.y,
      scale: LANDING_SCALE,
      tilt: LANDING_TILT,
      facing: -1,
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

// Index of the leg whose dotted trail is drawn: the final glide onto the headline. It
// ends at the landing spot, under the plane.
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
    const cap = b.maxTilt ?? 70;
    return { facing, tilt: b.tilt ?? clamp(dir.tilt, -cap, cap) };
  });

  const proxy = {
    x: keys[0].x,
    y: keys[0].y,
    scale: keys[0].scale,
    tilt: keys[0].tilt ?? 0,
    facing: keys[0].facing ?? 1,
    bow: 0,
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
    const py = ((proxy.y + proxy.bow) / 100) * vh;
    setX(px);
    setY(py);
    setScale(proxy.scale);
    // facing runs through 0 during a bank turn; the tilt's sign follows the side the
    // nose is on, flipping at the thinnest point of the turn
    setFacing(proxy.facing);
    setRotation((proxy.facing < 0 ? -1 : 1) * proxy.tilt);
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
  let current = proxy.facing;
  legs.forEach(({ a, b }, i) => {
    const d = b.s - a.s;
    const turn = turns[i];
    const from = { immediateRender: false };
    tl.fromTo(proxy, { x: a.x }, { x: b.x, duration: d, ease: b.xEase ?? "sine.inOut", ...from }, a.s)
      .fromTo(proxy, { y: a.y }, { y: b.y, duration: d, ease: b.yEase ?? "sine.inOut", ...from }, a.s)
      .fromTo(proxy, { scale: a.scale }, { scale: b.scale, duration: d, ease: "sine.inOut", ...from }, a.s);
    if (b.sag) {
      // 0 at both ends, full sag mid-leg
      const bow = (u: number) => Math.sin(Math.PI * u);
      tl.fromTo(proxy, { bow: 0 }, { bow: b.sag, duration: d, ease: bow, ...from }, a.s);
    }
    // Facing changes bank through scaleX 0 over the start of the leg; off screen they
    // snap instead (at the leg's start, or its end if only the end is off screen).
    if (turn.facing !== current) {
      if (!onScreen(a)) tl.set(proxy, { facing: turn.facing }, a.s);
      else if (!onScreen(b)) tl.set(proxy, { facing: turn.facing }, b.s);
      else
        tl.fromTo(
          proxy,
          { facing: current },
          { facing: turn.facing, duration: d * BANK, ease: "sine.inOut", ...from },
          a.s,
        );
    }
    current = turn.facing;
    tl.fromTo(
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
  return { tl, proxy };
}

// Reduced motion: no flight and no trail. The plane rests at its hero spot and scrolls
// with the page like any other content.
function placeStill(parts: Parts, desktop: boolean, size: Size) {
  const { layer, plane, shadow } = parts;
  const rest = heroRest(size);
  const x = (rest.x / 100) * size.vw;
  const y = (rest.y / 100) * size.vh;
  gsap.set(layer, { position: "absolute", height: 0, overflow: "visible" });
  // facing left (mirrored), nose slightly up
  gsap.set(plane, { x, y, rotation: 6, scale: 1 });
  gsap.set(parts.body, { scaleX: -1 });
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
                const keys = choreography(desktop, size, p.plane);
                if (!keys) return;
                const flight = buildFlight(p, keys, size);
                // Dev-only debug overlay. The NODE_ENV check is replaced at build time,
                // so production bundles drop this branch and the overlay module.
                if (
                  process.env.NODE_ENV === "development" &&
                  new URLSearchParams(window.location.search).get("plane") === "debug"
                ) {
                  const token = ++debugToken;
                  import("./PlaneDebug").then(({ attachPlaneDebug }) => {
                    if (token !== debugToken) return;
                    stopDebug = attachPlaneDebug({ keys, size, ...flight });
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
          <PaperPlane />
        </div>
      </div>
    </div>
  );
}
