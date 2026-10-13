"use client";

import "lenis/dist/lenis.css";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { site } from "@/content/site";
import PaperPlane from "./PaperPlane";
import { clamp, heading, spaceOut } from "./flightPath";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CARD_IDS = site.work.projects.map((p) => p.id);
const HERO_OPACITY = 0.35;

// Document coordinates of a box.
function docRect(el: Element | Range) {
  const r = el.getBoundingClientRect();
  const left = r.left + window.scrollX;
  const top = r.top + window.scrollY;
  return { left, top, right: left + r.width, bottom: top + r.height, cy: top + r.height / 2 };
}

// The box of an element's text, not its (often full-width) block.
function textRect(el: Element) {
  const range = document.createRange();
  range.selectNodeContents(el);
  return docRect(range);
}

const $ = (selector: string) => document.querySelector(selector);
const navBottom = () => Math.max(0, $("header")?.getBoundingClientRect().bottom ?? 0);
const maxScroll = () => ScrollTrigger.maxScroll(window);

type Bounds = { left: number; right: number; top: number; bottom: number };

// Where the plane's centre may go: clear of the sticky nav, and inset by the plane's
// half-diagonal so no tilt can push it off screen.
function screenBounds(plane: HTMLElement): Bounds {
  const half = Math.hypot(plane.offsetWidth, plane.offsetHeight) / 2 + 4;
  return {
    left: half,
    right: window.innerWidth - half,
    top: navBottom() + half,
    bottom: window.innerHeight - half,
  };
}

// The text-free spot the plane starts from (and rests at under reduced motion): just
// above the flight log's top-right corner, level with the "follow the plane" note, which
// sits at the panel's left.
function heroSpot(plane: HTMLElement) {
  const log = $("#hero .panel");
  if (!log) return null;
  const r = docRect(log);
  return { x: r.right - plane.offsetWidth / 2 - 4, y: r.top - plane.offsetHeight / 2 - 6 };
}

// A waypoint: where the plane's centre is on screen (x, y) when the page is scrolled to
// `s`. `level` holds the plane flat (used once it has landed and rides with the page).
type Point = { x: number; y: number; s: number; level?: boolean };

// Desktop waypoints, all measured from the live layout. None of them sits on text:
// they use the side margins, the empty padding between sections, the gaps around the
// project cards, and the empty space right of the Contact headline.
function desktopPoints(plane: HTMLElement) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const max = maxScroll();
  const bounds = screenBounds(plane);
  const w = plane.offsetWidth;
  const h = plane.offsetHeight;

  const start = heroSpot(plane);
  const about = $("#about");
  const work = $("#work");
  const experience = $("#experience");
  const toolkit = $("#toolkit");
  const contactHeadline = $("#contact h2");
  const cards = CARD_IDS.map((id) => document.getElementById(id));
  if (!start || !about || !work || !experience || !toolkit || !contactHeadline) return null;
  if (cards.some((c) => !c)) return null;

  // Content column edges (the Container inside a section, minus its 32px padding).
  const column = docRect(work.firstElementChild ?? work);
  const contentLeft = column.left + 32;
  const contentRight = column.right - 32;
  const columnMiddle = (contentLeft + contentRight) / 2;
  // Side margins wide enough to hold the plane clear of the content?
  const roomy = contentLeft >= w + 20;
  const sideX = roomy ? (contentRight + vw) / 2 : bounds.right;

  type Stop = { x: number; docY: number; s: number; level?: boolean };
  const stops: Stop[] = [{ x: start.x, docY: start.y, s: 0 }];

  // The empty padding where a section meets the next one, at the right margin.
  const gapAfter = (section: Element) => {
    const docY = docRect(section).bottom;
    return { x: sideX, docY, s: docY - vh * 0.5 };
  };
  stops.push(gapAfter(about));

  cards.forEach((card) => {
    const r = docRect(card!);
    const left = (r.left + r.right) / 2 < columnMiddle;
    // Just outside the card's outer edge near its top corner: beside it in the margin
    // when there's room, otherwise in the gap just above that corner.
    const x = roomy
      ? left
        ? r.left - w / 2 - 10
        : r.right + w / 2 + 10
      : left
        ? r.left + w / 2 - 8
        : r.right - w / 2 + 8;
    const docY = roomy ? r.top + 28 : r.top - h / 2 - 4;
    stops.push({ x, docY, s: docY - vh * 0.3 });
  });

  stops.push(gapAfter(experience), gapAfter(toolkit));

  // Touch down just after the headline's last letter, after a level approach. Land at the
  // bottom of the page if the headline is still on screen there; otherwise land with it
  // at 40% height and ride up with the page.
  const landing = textRect(contactHeadline);
  const landX = landing.right + 28 + w / 2;
  const landS = landing.cy - max >= bounds.top ? max : clamp(landing.cy - vh * 0.4, 0, max);
  stops.push(
    { x: landX + 160, docY: landing.cy, s: landS - vh * 0.2 },
    { x: landX, docY: landing.cy, s: landS },
  );
  if (landS < max) stops.push({ x: landX, docY: landing.cy, s: max, level: true });

  const s = spaceOut(
    stops.map((p) => p.s),
    vh * 0.2,
    max,
  );
  s[0] = 0;
  if (landS < max) s[s.length - 1] = max;

  const points: Point[] = stops.map((p, i) => ({
    x: clamp(p.x, bounds.left, bounds.right),
    y: clamp(p.docY - s[i], bounds.top, bounds.bottom),
    s: s[i],
    level: p.level,
  }));
  return { points, bounds, max, workAt: Math.max(1, docRect(work).top - vh / 2) };
}

// Phones: one short flight across the hero, from just off the left edge to a parking
// spot at the hero's right edge (above the flight log), finished by the time that spot
// is 45% down the screen. Positions here are document coordinates: once parked, the
// plane stays with the hero and scrolls away with it.
function phonePoints(plane: HTMLElement) {
  const park = heroSpot(plane);
  const h1 = $("#hero h1");
  if (!park || !h1) return null;
  const vh = window.innerHeight;
  const max = maxScroll();
  const end = clamp(park.y - vh * 0.45, 120, max);
  const points: Point[] = [
    { x: -plane.offsetWidth, y: docRect(h1).top, s: 0 },
    { x: park.x, y: park.y, s: end },
  ];
  return { points, max };
}

type Layout = { points: Point[]; max: number; workAt?: number; bounds?: Bounds };

// Draws the plane: position, facing (mirrored on right-to-left legs, never upside down)
// and a tilt of at most 35 degrees that eases in at the start of each leg.
function makeRenderer(plane: HTMLElement, body: HTMLElement) {
  const setX = gsap.quickSetter(plane, "x", "px");
  const setY = gsap.quickSetter(plane, "y", "px");
  const setRotation = gsap.quickSetter(plane, "rotation", "deg");
  const setFacing = gsap.quickSetter(body, "scaleX");
  return (x: number, y: number, points: Point[], time: number) => {
    let i = 0;
    while (i < points.length - 2 && time >= points[i + 1].s) i++;
    const legs = points.slice(0, i + 2);
    let facing: 1 | -1 = 1;
    let previousTilt = 0;
    let tilt = 0;
    for (let k = 0; k + 1 < legs.length; k++) {
      const a = legs[k];
      const b = legs[k + 1];
      const leg: { facing: 1 | -1; tilt: number } = b.level
        ? { facing, tilt: 0 }
        : heading(b.x - a.x, b.y - a.y, facing);
      previousTilt = tilt;
      facing = leg.facing;
      tilt = leg.tilt;
    }
    const a = points[i];
    const b = points[i + 1];
    const u = clamp((time - a.s) / (b.s - a.s || 1), 0, 1);
    const blend = clamp(u / 0.25, 0, 1);
    const t = previousTilt + (tilt - previousTilt) * (0.5 - 0.5 * Math.cos(Math.PI * blend));
    setX(x);
    setY(y);
    setFacing(facing);
    setRotation(facing * t);
  };
}

// One scrubbed timeline whose time is the scroll position in pixels (it runs to the
// bottom of the page, so in document mode the parked plane keeps following the hero). Each leg tweens a
// proxy between two waypoints with function-based values that read the latest layout, so
// invalidateOnRefresh re-measures them; the legs' timing is updated on every refresh.
function buildFlight(
  plane: HTMLElement,
  body: HTMLElement,
  measure: () => Layout | null,
  mode: "screen" | "document",
) {
  let layout = measure();
  if (!layout) return null;
  const legCount = layout.points.length - 1;
  const proxy = { x: layout.points[0].x, y: layout.points[0].y };
  const render = makeRenderer(plane, body);
  const draw = () => {
    if (!layout) return;
    const time = tl.time();
    let y = mode === "document" ? proxy.y - window.scrollY : proxy.y;
    if (layout.bounds) y = clamp(y, layout.bounds.top, layout.bounds.bottom);
    render(proxy.x, y, layout.points, time);
  };

  const tl = gsap.timeline({
    defaults: { ease: "sine.inOut" },
    onUpdate: draw,
    scrollTrigger: { start: 0, end: "max", scrub: true, invalidateOnRefresh: true },
  });
  const p = (i: number) => () => layout!.points[i];
  const legs = Array.from({ length: legCount }, (_, i) =>
    tl.fromTo(
      proxy,
      { x: () => p(i)().x, y: () => p(i)().y },
      {
        x: () => p(i + 1)().x,
        y: () => p(i + 1)().y,
        ease: layout!.points[i + 1].level ? "none" : "sine.inOut",
        immediateRender: false,
      },
    ).recent() as gsap.core.Tween,
  );
  const fade = layout.workAt
    ? (tl
        .fromTo(plane, { opacity: HERO_OPACITY }, { opacity: 1, ease: "none" }, 0)
        .recent() as gsap.core.Tween)
    : null;
  if (!fade) gsap.set(plane, { opacity: 1 });
  const end = tl.set({}, {}, 0).recent() as gsap.core.Tween;

  // Place every leg at its waypoint's scroll position.
  const retime = () => {
    if (!layout) return;
    const pts = layout.points;
    legs.forEach((leg, i) => {
      leg.startTime(pts[i].s);
      leg.duration(Math.max(1, pts[i + 1].s - pts[i].s));
    });
    fade?.startTime(0).duration(layout.workAt ?? 1);
    end.startTime(layout.max);
  };
  retime();

  // Re-measure before ScrollTrigger recalculates; the point count stays fixed so the
  // legs line up (a missing element keeps the previous layout).
  const onRefreshInit = () => {
    const next = measure();
    if (next && next.points.length === legCount + 1) layout = next;
    retime();
  };
  ScrollTrigger.addEventListener("refreshInit", onRefreshInit);

  tl.progress(clamp(window.scrollY / Math.max(1, layout.max), 0, 1));
  draw();
  return () => ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
}

// Reduced motion: no flight. The plane rests at the hero spot and scrolls with the page
// like any other content.
function placeStill(layer: HTMLElement, plane: HTMLElement) {
  const spot = heroSpot(plane);
  if (!spot) return false;
  gsap.set(layer, { position: "absolute", height: 0, overflow: "visible" });
  gsap.set(plane, { x: spot.x, y: spot.y, rotation: 0, opacity: HERO_OPACITY });
  return true;
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
          const cleanups: (() => void)[] = [];
          if (fine && !reduce) cleanups.push(startLenis());

          // Waypoints are measured only once the web fonts have loaded, since they move
          // the text the waypoints are placed around.
          let alive = true;
          const fonts = document.fonts?.ready ?? Promise.resolve();
          fonts.then(() => {
            if (!alive || !layer.current || !plane.current || !body.current) return;
            const l = layer.current;
            const p = plane.current;
            const b = body.current;
            const ctx = gsap.context(() => {
              gsap.set(p, { xPercent: -50, yPercent: -50 }); // x/y are the plane's centre
              const ready = reduce
                ? placeStill(l, p)
                : desktop
                  ? buildFlight(p, b, () => desktopPoints(p), "screen")
                  : buildFlight(p, b, () => phonePoints(p), "document");
              if (typeof ready === "function") cleanups.push(ready);
              if (ready) gsap.set(p, { visibility: "visible" });
            });
            cleanups.push(() => ctx.revert());
            ScrollTrigger.refresh();
          });

          // Re-measure on resize and whenever the page's height changes. Phones ignore
          // height-only resizes: the browser bar sliding in and out causes those.
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
              if (size() === last) return;
              last = size();
              ScrollTrigger.refresh();
            }, 150);
          };
          const observer = new ResizeObserver(onResize);
          observer.observe(document.body);
          window.addEventListener("resize", onResize);

          return () => {
            alive = false;
            window.clearTimeout(timer);
            observer.disconnect();
            window.removeEventListener("resize", onResize);
            cleanups.reverse().forEach((fn) => fn());
          };
        },
      );
      return () => mm.revert();
    },
    { scope: layer },
  );

  return (
    <div
      ref={layer}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-screen overflow-hidden supports-[height:100dvh]:h-dvh"
    >
      <div ref={plane} className="invisible absolute top-0 left-0 will-change-transform">
        <div ref={body}>
          <PaperPlane />
        </div>
      </div>
    </div>
  );
}
