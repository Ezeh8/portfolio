"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { site } from "@/content/site";
import PaperPlane from "./PaperPlane";
import { type Bounds, type Waypoint, clamp, planFlight, spaceOut } from "./flightPath";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

const CARD_IDS = site.work.projects.map((p) => p.id);
const HERO_OPACITY = 0.35;

// Document coordinates of an element's box.
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

function setLit(readout: Element | null, lit: boolean) {
  if (!readout) return;
  if (lit) readout.setAttribute("data-lit", "");
  else readout.removeAttribute("data-lit");
}

const readoutOf = (id: string) =>
  document.getElementById(id)?.querySelector("[data-readout]") ?? null;
const setAllLit = (lit: boolean) => CARD_IDS.forEach((id) => setLit(readoutOf(id), lit));

// The screen area the plane's centre may use: clear of the sticky nav, and inset by the
// plane's half-diagonal so no rotation can push it off screen.
function screenBounds(plane: HTMLElement): Bounds {
  const half = Math.hypot(plane.offsetWidth, plane.offsetHeight) / 2 + 4;
  const navBottom = $("header")?.getBoundingClientRect().bottom ?? 0;
  return {
    left: half,
    right: window.innerWidth - half,
    top: Math.max(0, navBottom) + half,
    bottom: window.innerHeight - half,
  };
}

const maxScroll = () => ScrollTrigger.maxScroll(window);

// Draws the plane from a proxy that the motion path drives: position clamped to the
// screen, and flipped upright whenever it points left (autoRotate alone would fly it
// upside down).
function makeRenderer(plane: HTMLElement, body: HTMLElement, bounds: Bounds) {
  const setX = gsap.quickSetter(plane, "x", "px");
  const setY = gsap.quickSetter(plane, "y", "px");
  const setRotation = gsap.quickSetter(plane, "rotation", "deg");
  const setFlip = gsap.quickSetter(body, "scaleY");
  return (p: { x: number; y: number; rotation: number }) => {
    setX(clamp(p.x, bounds.left, bounds.right));
    setY(clamp(p.y, bounds.top, bounds.bottom));
    setRotation(p.rotation);
    const heading = ((((p.rotation + 180) % 360) + 360) % 360) - 180;
    setFlip(Math.abs(heading) > 90 ? -1 : 1);
  };
}

// Builds a scrubbed timeline whose time is the scroll position in pixels.
function flightTimeline(
  waypoints: Waypoint[],
  bounds: Bounds,
  plane: HTMLElement,
  body: HTMLElement,
  workAt: number,
  hold?: { from: number; to: number },
) {
  const max = maxScroll();
  const plan = planFlight(waypoints, bounds);
  const proxy = { ...plan.start, rotation: 0 };
  const render = makeRenderer(plane, body, bounds);

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { start: 0, end: max, scrub: true },
  });
  tl.to(
    proxy,
    {
      duration: plan.duration,
      ease: plan.ease,
      motionPath: { path: plan.path, curviness: plan.curviness, autoRotate: true },
      onUpdate: () => render(proxy),
    },
    0,
  );
  // After touchdown the plane rides up with the page until it meets the top of the
  // screen, so it stays beside the headline for the last stretch of scroll.
  if (hold && max > plan.duration) {
    tl.fromTo(
      proxy,
      { y: hold.from },
      {
        y: hold.to,
        duration: max - plan.duration,
        immediateRender: false,
        onUpdate: () => render(proxy),
      },
      plan.duration,
    );
  }
  tl.fromTo(
    plane,
    { opacity: HERO_OPACITY },
    { opacity: 1, duration: Math.max(1, workAt) },
    0,
  );
  tl.set({}, {}, max); // timeline length = page scroll length
  // Place the plane before the first scroll so it never flashes at the corner.
  tl.progress(0).progress(window.scrollY / Math.max(1, max));
  render(proxy);
  return tl;
}

function flyDesktop(plane: HTMLElement, body: HTMLElement): boolean {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const max = maxScroll();
  const bounds = screenBounds(plane);

  const h1 = $("#hero h1");
  const flightLog = $("#hero .panel");
  const about = $("#about");
  const experience = $("#experience");
  const toolkit = $("#toolkit");
  const contactHeadline = $("#contact h2");
  const work = $("#work");
  const cards = CARD_IDS.map((id) => document.getElementById(id));
  if (!h1 || !flightLog || !about || !experience || !toolkit || !contactHeadline || !work)
    return false;
  if (cards.some((c) => !c)) return false;

  // The side margin: halfway between the content's right edge and the screen edge.
  const contentRight = docRect(about.querySelector("div") ?? about).right - 32;
  const sideX = Math.min((contentRight + vw) / 2, bounds.right);
  const centreAt = (el: Element) => docRect(el).cy - vh / 2;

  type Stop = { x: number; docY?: number; screenY?: number; s: number; card?: string };
  const hero = docRect(h1);
  const log = docRect(flightLog);
  const landing = textRect(contactHeadline);
  const landingY = landing.cy;
  const landingX = landing.right + 28 + plane.offsetWidth / 2;
  const landingS = clamp(landingY - vh * 0.4, 0, max);

  const stops: Stop[] = [
    // beside the headline, in the gap before the flight log
    { x: (hero.right + log.left) / 2, docY: hero.cy, s: 0 },
    { x: sideX, screenY: vh * 0.45, s: centreAt(about) },
    ...cards.map((card, i) => {
      const r = docRect(card!);
      const readout = card!.querySelector("[data-readout]");
      return {
        // the card's outer edge, level with its readout line
        x: r.left + (r.right - r.left) / 2 < vw / 2 ? r.left : r.right,
        docY: readout ? docRect(readout).top : r.cy,
        s: centreAt(card!),
        card: CARD_IDS[i],
      };
    }),
    { x: sideX, screenY: vh * 0.4, s: centreAt(experience) },
    { x: sideX, screenY: vh * 0.6, s: centreAt(toolkit) },
    // level approach, then touchdown just after the headline's last letter
    { x: landingX + 160, docY: landingY, s: landingS - vh * 0.25 },
    { x: landingX, docY: landingY, s: landingS },
  ];

  const s = spaceOut(
    stops.map((p) => p.s),
    vh * 0.3,
    max,
  );
  s[0] = 0;
  const waypoints: Waypoint[] = stops.map((p, i) => ({
    x: clamp(p.x, bounds.left, bounds.right),
    y: clamp(p.screenY ?? (p.docY ?? 0) - s[i], bounds.top, bounds.bottom),
    s: s[i],
  }));

  const workAt = docRect(work).top - vh / 2;
  const touchdown = waypoints[waypoints.length - 1];
  flightTimeline(waypoints, bounds, plane, body, workAt, {
    from: touchdown.y,
    to: Math.max(bounds.top, touchdown.y - (max - touchdown.s)),
  });

  // Card highlight from the moment the plane reaches the card; off again when scrolling
  // back above that point.
  stops.forEach((stop, i) => {
    if (!stop.card) return;
    const readout = readoutOf(stop.card);
    ScrollTrigger.create({
      start: s[i],
      end: "max",
      onEnter: () => setLit(readout, true),
      onLeaveBack: () => setLit(readout, false),
    });
  });
  return true;
}

function flyPhone(plane: HTMLElement, body: HTMLElement): boolean {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const max = maxScroll();
  const work = $("#work");
  if (!work) return false;

  // A gentle S down the right 15% of the screen across the whole page. The plane's
  // centre keeps half its rotated size inside that strip.
  const half = Math.max(plane.offsetWidth, plane.offsetHeight) / 2;
  const screen = screenBounds(plane);
  const bounds: Bounds = {
    left: vw * 0.85 + half * 0.6,
    right: vw - half * 0.6,
    top: screen.top,
    bottom: screen.bottom,
  };
  const left = bounds.left;
  const right = bounds.right;
  const y0 = bounds.top + 20;
  const y1 = bounds.bottom - 20;
  const xs = [right, left, right, left];
  const waypoints: Waypoint[] = xs.map((x, i) => ({
    x,
    y: y0 + ((y1 - y0) * i) / (xs.length - 1),
    s: (max * i) / (xs.length - 1),
  }));

  flightTimeline(waypoints, bounds, plane, body, docRect(work).top - vh / 2);

  // No plane over the cards here, so each readout lights as it reaches mid-screen.
  CARD_IDS.forEach((id) => {
    const readout = readoutOf(id);
    if (!readout) return;
    ScrollTrigger.create({
      trigger: readout,
      start: "top center",
      onEnter: () => setLit(readout, true),
      onLeaveBack: () => setLit(readout, false),
    });
  });
  return true;
}

// Reduced motion: no flight. The plane rests beside the hero headline (it scrolls with
// the page like any other content) and every readout shows its highlighted state.
function placeStill(layer: HTMLElement, plane: HTMLElement, desktop: boolean): boolean {
  setAllLit(true);
  const h1 = $("#hero h1");
  const flightLog = $("#hero .panel");
  if (!h1) return false;
  const hero = docRect(h1);
  const x =
    desktop && flightLog
      ? (hero.right + docRect(flightLog).left) / 2
      : window.innerWidth - plane.offsetWidth / 2 - 8;
  gsap.set(layer, { position: "absolute", height: 0, overflow: "visible" });
  // phones: just above the headline's top-right corner, clear of its text
  const y = desktop ? hero.cy : hero.top - plane.offsetHeight / 2 - 8;
  gsap.set(plane, { x, y, rotation: 0, opacity: HERO_OPACITY });
  return true;
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

          if (fine && !reduce) {
            const lenis = new Lenis({ lerp: 0.1 });
            lenis.on("scroll", ScrollTrigger.update);
            const tick = (time: number) => lenis.raf(time * 1000);
            gsap.ticker.add(tick);
            gsap.ticker.lagSmoothing(0);
            cleanups.push(() => {
              gsap.ticker.remove(tick);
              gsap.ticker.lagSmoothing(500, 33); // GSAP's default
              lenis.destroy();
            });
          }

          // Waypoints come from the page's real layout, so the flight is rebuilt whenever
          // that layout changes size (window resize, fonts loading, anything else).
          let built: gsap.Context | null = null;
          const build = () => {
            built?.revert();
            built = gsap.context(() => {
              if (!layer.current || !plane.current || !body.current) return;
              if (!reduce) setAllLit(false);
              // the plane's x/y are its centre
              gsap.set(plane.current, { xPercent: -50, yPercent: -50 });
              const ready = reduce
                ? placeStill(layer.current, plane.current, desktop)
                : desktop
                  ? flyDesktop(plane.current, body.current)
                  : flyPhone(plane.current, body.current);
              if (ready) gsap.set(plane.current, { visibility: "visible" });
            });
            ScrollTrigger.refresh();
          };

          // Phones only rebuild on width or page-length changes: their screen height
          // changes every time the browser bar slides in or out.
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
              build();
            }, 150);
          };
          const observer = new ResizeObserver(onResize);
          observer.observe(document.body);
          window.addEventListener("resize", onResize);
          document.fonts?.ready.then(() => {
            last = size();
            build();
          });
          build();

          return () => {
            window.clearTimeout(timer);
            observer.disconnect();
            window.removeEventListener("resize", onResize);
            built?.revert();
            built = null;
            cleanups.forEach((fn) => fn());
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
      <div
        ref={plane}
        className="invisible absolute top-0 left-0 will-change-transform"
      >
        <div ref={body}>
          <PaperPlane />
        </div>
      </div>
    </div>
  );
}
