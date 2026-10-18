"use client";

import "lenis/dist/lenis.css";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { site } from "@/content/site";
import { PLANE_EVENT, type PlaneMoment } from "../SoundToggle";
import PaperPlane from "./PaperPlane";
import { clamp, heading, inOrder, isClear, nearestClear } from "./flightPath";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CARD_IDS = site.work.projects.map((p) => p.id);
// The Work pager hides cards (display: none); the flight only uses the ones on screen,
// in page order.
const shownCards = () =>
  CARD_IDS.map((id) => document.getElementById(id)).filter(
    (el): el is HTMLElement => !!el && el.getClientRects().length > 0,
  );

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

// The landed plane: nose left, at `scale`, the tip of its nose dug this many px into the
// top-right corner of the "h" of the closing headline's "touch".
const LANDING_SCALE = 0.45;
const NOSE_DEPTH = 1;
// The nose tip in the plane's SVG viewBox (see PaperPlane).
const NOSE = { x: 208, y: 70 };

// Where the tip of the nose sits relative to the plane's centre, in px, when drawn facing
// `facing` at `tilt` (nose down positive) and `scale`; the same rotation the timeline
// applies (rotation = facing * tilt).
function noseOffset(plane: HTMLElement, size: Size, facing: 1 | -1, tilt: number, scale: number) {
  const box = plane.querySelector("svg")?.viewBox.baseVal;
  const bw = box?.width || 220;
  const bh = box?.height || 135;
  const x = facing * ((NOSE.x / bw) * size.w - size.w / 2);
  const y = (NOSE.y / bh) * size.h - size.h / 2;
  const rad = (facing * tilt * Math.PI) / 180;
  return {
    x: (x * Math.cos(rad) - y * Math.sin(rad)) * scale,
    y: (x * Math.sin(rad) + y * Math.cos(rad)) * scale,
  };
}

// The top-right corner of the last letter of `word` (the "h" of "touch"), in document px.
// The letter's right edge and top come from the font's own glyph metrics, not its box.
function lastLetterCorner(word: HTMLElement) {
  const r = docRect(word);
  const text = word.firstChild;
  const length = text?.textContent?.length ?? 0;
  let left = r.right;
  let right = r.right;
  if (text && length) {
    const range = document.createRange();
    range.setStart(text, length - 1);
    range.setEnd(text, length);
    const box = docRect(range);
    left = box.left;
    right = box.right;
  }
  let top = r.top + r.height * 0.2;
  const ctx = document.createElement("canvas").getContext("2d");
  if (ctx) {
    const style = getComputedStyle(word);
    ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const letter = (word.textContent ?? "").slice(-1).toLowerCase();
    const m = ctx.measureText(letter);
    if (m.actualBoundingBoxRight) right = left + m.actualBoundingBoxRight;
    if (m.fontBoundingBoxAscent) top = r.top + m.fontBoundingBoxAscent - m.actualBoundingBoxAscent;
  }
  return { x: right, y: top, bottom: r.bottom };
}

// The landing spot (last keyframe), in screen % at the bottom of the scroll, and the tilt
// it lands at: the plane flies in from `from` (the previous keyframe) facing left, nose
// first along its straight final glide, until the tip of its nose touches the top-right
// corner of the "h" of "touch". The tilt is the glide's own angle, so the nose leads.
function headlineLanding(word: HTMLElement, plane: HTMLElement, size: Size, max: number, from: { x: number; y: number }) {
  const { vw, vh } = size;
  const corner = lastLetterCorner(word);
  const tip = { x: corner.x - NOSE_DEPTH, y: corner.y - max + NOSE_DEPTH };
  // the tilt and the centre depend on each other; a few rounds settle them
  let centre = { x: tip.x, y: tip.y };
  let tilt = 0;
  for (let i = 0; i < 4; i++) {
    tilt = heading(centre.x - (from.x / 100) * vw, centre.y - (from.y / 100) * vh, -1).tilt;
    const nose = noseOffset(plane, size, -1, tilt, LANDING_SCALE);
    centre = { x: tip.x - nose.x, y: tip.y - nose.y };
  }
  if (process.env.NODE_ENV !== "production") {
    // the plane's top edge (roughly) must clear the nav, the headline's bottom the screen
    if (centre.y - (size.h * LANDING_SCALE) / 2 < navBottom() || corner.bottom - max > vh)
      console.warn("[plane] the closing headline is not fully on screen, with room above it, at the bottom of the scroll");
  }
  return { x: (centre.x / vw) * 100, y: (centre.y / vh) * 100, tilt };
}

// The hero resting spot (leg 0), in screen % at scroll 0, measured from the "follow the
// plane" note on every layout: just below the note, overlapping its lower edge by 8px,
// centred under the tip of the note's arrow. The note draws on top (z-index 2).
// If that would cover the headline, the hero buttons or the flight log, the plane moves
// up under the note in 2px steps until it doesn't; failing that, to the nearest clear
// spot. Falls back to x 26, y 55 if the note is missing. The final spot is then dropped
// by REST_DROP px so the plane sits a little lower, under the arrow.
const REST_DROP = 12;

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
  const result = { x: (spot.x / vw) * 100, y: ((spot.y + REST_DROP) / vh) * 100 };
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
  const banner = $("main [data-banner]");
  const work = $("#work");
  const toolkit = $("#toolkit");
  const secondBanner = $("#second-banner");
  const touch = $("#contact .highlight") as HTMLElement | null;
  const firstCard = shownCards()[0];
  if (!hero || !banner || !work || !toolkit || !secondBanner || !touch || !firstCard) return null;

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
    // 2. banner: near the left edge, easing slowly down, shrinking
    // leg 2
    {
      name: "banner",
      s: at(banner, 1, 0.5),
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
    // 6. Second banner: one glide right, rising, behind the banner, into the upper-right
    // leg. Desktop: flatter (tilt at most 8°) and shorter, timed by paceStretch() below;
    // phones keep the original legs 6-7 values, since their flight reuses legs 7-8.
    // leg 6
    {
      name: "second banner glide right",
      s: at(secondBanner, 0.5, 0.5),
      ...(desktop
        ? { x: 70, y: 32, maxTilt: 8, xEase: "sine.in", yEase: "sine.in" }
        : { x: 85, y: 28, maxTilt: 20 }),
      scale: 0.4,
    },
    // 7. closing block: toward the upper right (desktop: on screen; phones: out of view),
    // then one straight glide down-left, nose first, onto the headline
    // leg 7
    desktop
      ? {
          name: "toward upper right",
          s: at(secondBanner, 0.5, 0.5) + vh * 0.1,
          x: 86,
          y: 22,
          scale: 0.4,
          maxTilt: 8,
        }
      : {
          name: "off-screen upper right",
          s: at(secondBanner, 0.5, 0.5) + vh * 0.1,
          x: 110,
          y: 18,
          scale: 0.4,
          tilt: 20,
          facing: -1,
        },
  ];
  // leg 8: completes exactly at the bottom of the scroll, the nose tip on the "h" of
  // "touch"; both axes share one ease, so the glide is a straight line the nose follows
  const landing = headlineLanding(touch, plane, size, max, keys[keys.length - 1]);
  keys.push({
    name: "landing nose first on the h",
    s: max,
    x: landing.x,
    y: landing.y,
    scale: LANDING_SCALE,
    tilt: landing.tilt,
    facing: -1,
    xEase: "sine.out",
    yEase: "sine.out",
  });
  if (desktop) paceStretch(keys, size, max);
  const s = inOrder(
    keys.map((k) => k.s),
    max,
  );
  return keys.map((k, i) => ({ ...k, s: s[i] }));
}

// Desktop only: the stretch from leg 6 to the landing moves at the pace of legs 4 and 5.
// Only timing and easing change; no positions. The boundary between legs 5 and 6 moves
// earlier until the stretch's average speed (path length on screen / scroll) matches
// legs 4 and 5 together, but never so far that leg 5 becomes more than LEG5_LIMIT times
// faster than leg 4. The stretch's scroll is then shared by path length, so its legs all
// move at the same speed; the landing still ends at the bottom of the scroll.
const LEG5_LIMIT = 1.2;
const STRETCH_EASES = ["sine.in", "none", "sine.out"]; // legs 6, 7, 8

// On-screen length of the leg ending at keyframe b, along its eased (and bowed) path.
function pathLength(a: Key, b: Key, size: Size) {
  const ex = gsap.parseEase(b.xEase ?? "sine.inOut");
  const ey = gsap.parseEase(b.yEase ?? "sine.inOut");
  const point = (u: number) => ({
    x: ((a.x + (b.x - a.x) * ex(u)) / 100) * size.vw,
    y: ((a.y + (b.y - a.y) * ey(u) + (b.sag ?? 0) * Math.sin(Math.PI * u)) / 100) * size.vh,
  });
  let length = 0;
  let prev = point(0);
  for (let i = 1; i <= 200; i++) {
    const next = point(i / 200);
    length += Math.hypot(next.x - prev.x, next.y - prev.y);
    prev = next;
  }
  return length;
}

function paceStretch(keys: Key[], size: Size, max: number) {
  const stretch = keys.slice(6);
  if (keys.length !== 9 || stretch.length !== STRETCH_EASES.length) return;
  const report = (label: string) =>
    keys.slice(4).map((k, i) => {
      const scroll = k.s - keys[i + 3].s;
      const path = pathLength(keys[i + 3], k, size);
      return { leg: i + 4, name: k.name, label, scroll: Math.round(scroll), path: Math.round(path), speed: +(path / scroll).toFixed(2) };
    });
  const before = process.env.NODE_ENV !== "production" ? report("before") : [];

  stretch.forEach((k, i) => {
    k.xEase = STRETCH_EASES[i];
    k.yEase = STRETCH_EASES[i];
  });
  const [s3, s4, s5] = [keys[3].s, keys[4].s, keys[5].s];
  const l4 = pathLength(keys[3], keys[4], size);
  const l5 = pathLength(keys[4], keys[5], size);
  const lengths = stretch.map((k, i) => pathLength(keys[i + 5], k, size));
  const total = lengths.reduce((sum, l) => sum + l, 0);
  if (!(s4 > s3) || !(total > 0)) return;

  // same average speed: total / (max - B) = (l4 + l5) / (B - s3)
  const target = (total * s3 + (l4 + l5) * max) / (total + l4 + l5);
  // leg 5 at most LEG5_LIMIT times leg 4's speed: l5 / (B - s4) <= LEG5_LIMIT * l4 / (s4 - s3)
  const limit = s4 + l5 / ((LEG5_LIMIT * l4) / (s4 - s3));
  const boundary = Math.min(s5, Math.max(target, limit));
  keys[5].s = boundary;
  let s = boundary;
  stretch.forEach((k, i) => {
    s += (lengths[i] / total) * (max - boundary);
    k.s = s;
  });
  stretch[stretch.length - 1].s = max;

  if (process.env.NODE_ENV !== "production") {
    const after = report("after");
    console.table([...before, ...after]);
    const pace = (rows: typeof after, from: number, to: number) => {
      const r = rows.filter((row) => row.leg >= from && row.leg <= to);
      return r.reduce((sum, row) => sum + row.path, 0) / r.reduce((sum, row) => sum + row.scroll, 0);
    };
    const ratio = pace(after, 6, 8) / pace(after, 4, 5);
    const message = `[plane] desktop pace: legs 6-8 ${ratio.toFixed(2)}x the speed of legs 4-5 (was ${(pace(before, 6, 8) / pace(before, 4, 5)).toFixed(2)}x)`;
    if (ratio > 1.15) console.warn(`${message}; leg 5's limit leaves a gap`);
    else console.info(message);
  }
}

// Phones (under 1024px): "hide and seek". Legs 0-1 and the last two legs (off screen
// upper right, then the nose-first landing) are the same as choreography()'s; in between, the
// plane holds near 55% of the screen height and hides behind the cards, showing itself
// only as the gaps between them scroll through its height.
const PHONE_Y = 55;
const PHONE_TILT = 20;

function phoneChoreography(size: Size, plane: HTMLElement): Key[] | null {
  const shared = choreography(false, size, plane);
  if (!shared) return null;
  const { h, vh } = size;
  const pct = (px: number) => (px / vh) * 100;
  const warn = (msg: string) => {
    if (process.env.NODE_ENV !== "production") console.warn(`[plane] phone: ${msg}`);
  };

  const box = (el: Element | null | undefined) => (el ? docRect(el) : null);
  const banner = box($("main .banner-track")?.closest(".overflow-hidden"));
  const work = box($("#work"));
  const experience = box($("#experience"));
  const toolkit = box($("#toolkit"));
  const secondBanner = box($("#second-banner"));
  const shown = shownCards();
  const cards = CARD_IDS.map((_, i) => box(shown[i]));
  // only the role cards on screen (the Experience pager hides the rest)
  const roles = Array.from(document.querySelectorAll("#experience ol > li"))
    .filter((el) => el.getClientRects().length > 0)
    .map(box);

  // Scroll position at which the document y `docY` sits `screen` % down the screen.
  const when = (docY: number | null | undefined, screen = PHONE_Y) =>
    docY == null ? NaN : docY - (screen / 100) * vh;
  // Half the scroll it takes a gap to pass the plane at `scale` (gap plus plane height).
  const half = (gap: number, scale: number) => (gap + h * scale) / 2 + 4;
  // The vertical gap between two cards, or null when they are not stacked (side by side).
  const gap = (a: ReturnType<typeof box>, b: ReturnType<typeof box>) =>
    a && b && b.top > a.bottom ? { top: a.bottom, bottom: b.top, size: b.top - a.bottom } : null;

  const g12 = gap(cards[0], cards[1]);
  const g23 = gap(cards[1], cards[2]);
  const g34 = gap(cards[2], cards[3]);
  const e12 = gap(roles[0], roles[1]);
  const mid = (g: ReturnType<typeof gap>) => (g ? (g.top + g.bottom) / 2 : undefined);
  const peekRide = 40; // px the plane rides with card 3's lower edge, half out
  const tilt = { maxTilt: PHONE_TILT };

  const middle: Key[] = [
    // 1. Banner: over to the right edge behind the first banner
    {
      name: "phone: right edge, behind first banner",
      s: when(banner && (banner.top + banner.bottom) / 2, 40),
      x: 86,
      y: 40,
      scale: 0.85,
      ...tilt,
    },
    // 2. Work: down and left, behind the first project card
    {
      name: "phone: behind project card 1",
      s: when(cards[0] && cards[0].top + (h * 0.6) / 2 + 8),
      x: 45,
      y: PHONE_Y,
      scale: 0.6,
      ...tilt,
    },
    // 3. gap 1-2: in place at the left edge, then a short hop right as the gap passes
    {
      name: "phone: hidden, to the left edge",
      s: when(g12 && mid(g12)! - half(g12.size, 0.6)),
      x: 10,
      y: PHONE_Y,
      scale: 0.6,
      ...tilt,
    },
    {
      name: "phone: gap 1-2, short hop right",
      s: when(g12 && mid(g12)! + half(g12.size, 0.6)),
      x: 40,
      y: PHONE_Y - 1,
      scale: 0.6,
      ...tilt,
    },
    // 4. gap 2-3: from the right edge, a longer glide left, sinking slightly
    {
      name: "phone: behind card 2, to the right edge",
      s: when(g23 && mid(g23)! - half(g23.size, 0.6)),
      x: 90,
      y: PHONE_Y + 1,
      scale: 0.6,
      ...tilt,
    },
    {
      name: "phone: gap 2-3, long glide left",
      s: when(g23 && mid(g23)! + half(g23.size, 0.6) * 1.5),
      x: 30,
      y: PHONE_Y + 3,
      scale: 0.6,
      ...tilt,
    },
    // 5. gap 3-4, a peek: waits at x 70 behind card 3, nose down; as card 3's lower edge
    // reaches its middle it rides along with that edge (front half out), then drops
    // back so card 4 slides over it. It never crosses the gap.
    {
      name: "phone: behind card 3, to the peek spot",
      s: when(cards[2] && cards[2].bottom - (h * 0.6) / 2 - 4),
      x: 70,
      y: PHONE_Y,
      scale: 0.6,
      tilt: PHONE_TILT,
      ...tilt,
    },
    {
      name: "phone: peek, front half out",
      s: when(g34 && g34.top),
      x: 70,
      y: PHONE_Y,
      scale: 0.6,
      tilt: PHONE_TILT,
      ...tilt,
    },
    {
      name: "phone: peek, hold",
      s: when(g34 && g34.top) + peekRide,
      x: 70,
      y: PHONE_Y - pct(peekRide),
      scale: 0.6,
      tilt: PHONE_TILT,
      yEase: "none",
      ...tilt,
    },
    {
      name: "phone: peek, pull back behind card 4",
      s: when(g34 && g34.top) + peekRide + (g34 ? half(g34.size, 0.6) : 0),
      x: 70,
      y: PHONE_Y - pct(peekRide) + pct(g34 ? half(g34.size, 0.6) : 0),
      scale: 0.6,
      tilt: PHONE_TILT,
      ...tilt,
    },
    // 6. below card 4: in place at x 30, then a gentle climb to the right edge
    {
      name: "phone: behind card 4, to x 30",
      s: when(cards[3] && cards[3].bottom - (h * 0.6) / 2 - 4),
      x: 30,
      y: PHONE_Y,
      scale: 0.6,
      ...tilt,
    },
    { name: "phone: below card 4, climb right", s: when(work?.bottom, 35), x: 88, y: 48, scale: 0.55, ...tilt },
    // 7. Experience: behind card 1, out in gap 1-2 at the left, drift right, behind card
    // 2 to the right edge, then a slow drift through the rest of the section
    {
      name: "phone: behind experience card 1, to the left",
      s: when(e12 && mid(e12)! - half(e12.size, 0.5)),
      x: 15,
      y: PHONE_Y,
      scale: 0.5,
      ...tilt,
    },
    {
      name: "phone: experience gap 1-2, drift right",
      s: when(e12 && mid(e12)! + half(e12.size, 0.5)),
      x: 45,
      y: PHONE_Y,
      scale: 0.5,
      ...tilt,
    },
    {
      name: "phone: behind experience card 2, to the right edge",
      s: when(roles[1] && roles[1].bottom - (h * 0.5) / 2 - 4),
      x: 88,
      y: PHONE_Y,
      scale: 0.5,
      ...tilt,
    },
    {
      name: "phone: rest of experience, slow drift",
      s: when(experience?.bottom, 50),
      x: 82,
      y: 50,
      scale: 0.5,
      ...tilt,
    },
    // 8. Toolkit: one gentle move to the left edge, sinking slightly
    { name: "phone: toolkit, to the left edge", s: when(toolkit?.bottom, 50), x: 12, y: 54, scale: 0.5, ...tilt },
    // 9. second banner: left to right, rising, behind the banner, into the off-screen leg
    {
      name: "phone: second banner, rising right",
      s: when(secondBanner && (secondBanner.top + secondBanner.bottom) / 2, 50),
      x: 85,
      y: 28,
      scale: 0.4,
      ...tilt,
    },
  ];

  // Any keyframe with a missing anchor reuses the previous keyframe.
  const start = shared.slice(0, 2);
  const end = shared.slice(-2);
  const keys = [...start];
  for (const key of middle) {
    const prev = keys[keys.length - 1];
    const values = [key.s, key.x, key.y, key.scale];
    if (values.every(Number.isFinite)) keys.push(key);
    else {
      warn(`"${key.name}" has a missing anchor; reusing the previous keyframe`);
      keys.push({ ...key, s: prev.s, x: prev.x, y: prev.y, scale: prev.scale });
    }
  }
  keys.push(...end);
  const s = inOrder(
    keys.map((k) => k.s),
    maxScroll(),
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

  // Moments the sound toggle can beep on: each keyframe where the plane is on screen at a
  // side (within 20% of the left or right edge), and the landing on the headline.
  const last = keys.length - 1;
  const moments = keys.flatMap((k, i): { s: number; kind: PlaneMoment }[] =>
    i === last
      ? [{ s: k.s, kind: "landing" }]
      : i > 0 && k.x >= 0 && k.x <= 100 && (k.x <= 20 || k.x >= 80)
        ? [{ s: k.s, kind: "side" }]
        : [],
  );
  let before = NaN; // timeline time at the previous draw

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

    // A side counts when the plane passes its keyframe in either direction; the landing
    // only when arriving (scrolling down).
    const now = tl.time();
    if (Number.isFinite(before))
      for (const m of moments) {
        const down = before < m.s && now >= m.s;
        const up = before >= m.s && now < m.s;
        if (down || (up && m.kind === "side"))
          window.dispatchEvent(new CustomEvent<PlaneMoment>(PLANE_EVENT, { detail: m.kind }));
      }
    before = now;
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
  const lenis = new Lenis({ lerp: 0.15 });
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
                const keys = phone
                  ? phoneChoreography(size, p.plane)
                  : choreography(desktop, size, p.plane);
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
