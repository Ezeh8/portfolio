import {
  NOSE_DEPTH,
  PHONE_GLIDE_ANGLE,
  PHONE_GLIDE_X,
  PHONE_NOSE_BACK,
  PHONE_NOSE_DEPTH_EM,
  headlineLanding,
} from "./anchors";
import { choreography, pathLength } from "./choreography";
import { $, CARD_IDS, docRect, maxScroll, shownCards } from "./dom";
import { inOrder } from "./flightPath";
import type { Key, Size } from "./types";

// Phones (under 1024px): "hide and seek". It starts pointing at the "a" of the name, then
// dives straight down the right side of the hero, nose first, and ends with one straight
// glide from the right side onto the "h" of "touch"; in between, the
// plane holds near 55% of the screen height and hides behind the cards, showing itself
// only as the gaps between them scroll through its height.
const PHONE_Y = 55;
// the least nose-down angle anywhere on the phone flight
const PHONE_DOWN = 25;
// x of the hero dive down the right side
const DIVE_X = 86;
const PHONE_TILT = 20;

export function phoneChoreography(size: Size, plane: HTMLElement): Key[] | null {
  const shared = choreography(false, size, plane);
  if (!shared) return null;
  const { h, vw, vh } = size;
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
    // 8. Toolkit: over to the left side as the section passes, then across to the right
    // side as it ends, ready for the glide down onto the "h"
    {
      name: "phone: toolkit, left side",
      s: when(toolkit && (toolkit.top + toolkit.bottom) / 2, 50),
      x: 12,
      y: 52,
      scale: 0.5,
      ...tilt,
    },
    {
      name: "phone: toolkit end, right side",
      s: when(secondBanner && (secondBanner.top + secondBanner.bottom) / 2, 45),
      x: 86,
      y: 40,
      scale: 0.5,
      ...tilt,
    },
  ];

  // The hero: from the rest at the name's "a", over to the right side, then one straight
  // dive down it, nose first, ending behind the first banner; the side-to-side legs
  // follow.
  const hero = box($("#hero"));
  const rest = shared[0];
  // it ends behind the first banner, as the banner's middle reaches it
  const dive: Key = {
    name: "phone: hero, straight down the right side, behind the banner",
    s: when(banner && (banner.top + banner.bottom) / 2, 60),
    x: DIVE_X,
    y: 60,
    scale: 0.85,
    tilt: 80,
    facing: -1,
    xEase: "sine.out",
    yEase: "sine.in",
  };
  // a short drop first, to the right edge, so the dive itself runs straight down
  const toSide: Key = {
    name: "phone: hero, over to the right side",
    s: when(hero && hero.top + (hero.bottom - hero.top) * 0.25, 20),
    x: DIVE_X,
    y: rest.y + 6,
    scale: 0.95,
    tilt: 70,
    facing: -1,
  };

  // Any keyframe with a missing anchor reuses the previous keyframe.
  // then the first ping: straight across to the left as the About heading passes the
  // plane's height
  const aboutHeading = box($("#about h2"));
  const ping: Key = {
    name: "phone: about, first ping left across the heading",
    s: when(aboutHeading && (aboutHeading.top + aboutHeading.bottom) / 2, 50),
    x: 12,
    y: 50,
    scale: 0.7,
    ...tilt,
  };
  const diving = Number.isFinite(dive.s) && Number.isFinite(toSide.s);
  const start = [rest, ...(diving ? [toSide, dive] : [shared[1]])];
  // the dive replaces the first side leg (over to the right edge behind the banner)
  if (diving) middle.shift();
  if (Number.isFinite(ping.s)) middle.unshift(ping);
  // 9. the landing: one straight glide from the right side, nose first, onto the "h"
  // (no off-screen leg on phones)
  const touch = $("#contact .highlight") as HTMLElement | null;
  const last = shared[shared.length - 1];
  const from = middle[middle.length - 1];
  const depth = touch ? (parseFloat(getComputedStyle(touch).fontSize) || 44) * PHONE_NOSE_DEPTH_EM - PHONE_NOSE_BACK : NOSE_DEPTH;
  const max = maxScroll();
  // as on desktop: one shallow glide in from the right, a little above the h, coming down
  // PHONE_GLIDE_ANGLE° onto it, its tilt the glide's own angle, so the nose leads all the
  // way in (the start is set from the landing, which depends on it; a few rounds settle it)
  from.x = PHONE_GLIDE_X;
  let landing: ReturnType<typeof headlineLanding> | null = null;
  if (touch && Number.isFinite(from.s))
    for (let i = 0; i < 3; i++) {
      landing = headlineLanding(touch, plane, size, max, from, 1, depth);
      const run = ((from.x - landing.x) / 100) * vw;
      from.y = Math.max(8, landing.y - ((run * Math.tan((PHONE_GLIDE_ANGLE * Math.PI) / 180)) / vh) * 100);
    }
  const end = landing ? [{ ...last, x: landing.x, y: landing.y, tilt: landing.tilt }] : shared.slice(-2);
  // and paced as on desktop: the last two legs share their scroll by path length, so
  // they move at one speed, speeding up into the turn and slowing onto the h
  const before = middle[middle.length - 2];
  if (landing && before && Number.isFinite(before.s)) {
    from.xEase = from.yEase = "sine.in";
    end[0].xEase = end[0].yEase = "sine.out";
    const l1 = pathLength(before, from, size);
    const l2 = pathLength(from, end[0], size);
    if (l1 + l2 > 0 && max > before.s) from.s = before.s + (l1 / (l1 + l2)) * (max - before.s);
  }
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
  // Flying down the page, the nose points down the whole way (at least PHONE_DOWN°), also
  // on legs that move up the screen; the rest at the name keeps its own angle.
  for (const key of keys.slice(1)) key.tilt = Math.max(key.tilt ?? 0, PHONE_DOWN);
  keys.push(...end);
  const s = inOrder(
    keys.map((k) => k.s),
    maxScroll(),
  );
  return keys.map((k, i) => ({ ...k, s: s[i] }));
}
