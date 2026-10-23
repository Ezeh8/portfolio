import gsap from "gsap";
import { DESKTOP_NOSE_DEPTH, LANDING_SCALE, NOSE_DEPTH, headlineLanding, heroRest } from "./anchors";
import { $, docRect, maxScroll, shownCards } from "./dom";
import { clamp, inOrder } from "./flightPath";
import type { Key, Size } from "./types";

// The whole flight, in screen units, timed against the sections' scroll positions.
export function choreography(desktop: boolean, size: Size, plane: HTMLElement): Key[] | null {
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

  const rest = heroRest(size, plane);
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
    { name: "hero rest", s: 0, x: rest.x, y: restY, scale: 1, tilt: rest.tilt, facing: -1 },
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
  // the plane is full size there on every layout, so its nose is placed at full size,
  // the same spot over the h as on phones
  const landing = headlineLanding(
    touch,
    plane,
    size,
    max,
    keys[keys.length - 1],
    1,
    desktop ? DESKTOP_NOSE_DEPTH : NOSE_DEPTH,
  );
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
export function pathLength(a: Key, b: Key, size: Size) {
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
