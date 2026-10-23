import gsap from "gsap";
import { PLANE_EVENT, type PlaneMoment } from "../SoundToggle";
import { heroRest } from "./anchors";
import { $, docRect, maxScroll } from "./dom";
import { clamp, heading } from "./flightPath";
import type { Key, Size } from "./types";

// A bank turn (facing flipping through scaleX 0) takes this share of a leg's scroll.
const BANK = 0.08;
const onScreen = (k: Key) => k.x >= 0 && k.x <= 100 && k.y >= 0 && k.y <= 100;

// Index of the leg whose dotted trail is drawn: the final glide onto the headline. It
// ends at the landing spot, under the plane.
const trailLeg = (keys: Key[]) => keys.length - 2;

export type Parts = {
  layer: HTMLElement;
  plane: HTMLElement;
  body: HTMLElement;
  shadow: HTMLElement;
  trail: SVGGElement;
};

// One timeline scrubbed against the page scroll. Its time is the scroll position in
// pixels; each leg tweens a proxy from one keyframe to the next.
// The plane flies at full size the whole way, on every layout; the keyframes' `scale`
// only shapes the shadow's offset. (It isn't applied: GSAP's quickSetter
// expands "scale" to an attribute named "scaleX,scaleY", which Safari rejects, so the
// flight never built on iPhones.)
// `track` (phones): along the final glide, follow where the "h" really is at the bottom
// of the scroll, in case the page or the screen changed since the flight was measured
// (the mobile toolbar, cards opened), so the nose still stops right at its corner.
export function buildFlight(parts: Parts, keys: Key[], size: Size, track = false) {
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
  const setRotation = gsap.quickSetter(plane, "rotation", "deg");
  const setFacing = gsap.quickSetter(body, "scaleX");
  const setShadowX = gsap.quickSetter(shadow, "x", "px");
  const setShadowY = gsap.quickSetter(shadow, "y", "px");
  // The "h" as measured for the flight: its box, and the bottom of the scroll then.
  const word = track ? ($("#contact .highlight") as HTMLElement | null) : null;
  const word0 = word ? docRect(word) : null;
  const max0 = maxScroll();
  const landEase = gsap.parseEase(tb.yEase ?? "sine.inOut");

  const draw = () => {
    let px = (proxy.x / 100) * vw;
    let py = ((proxy.y + proxy.bow) / 100) * vh;
    // on the final glide, shift toward where the "h" will really sit at the bottom
    if (word && word0 && tl.time() > ta.s) {
      const r = docRect(word);
      const k = landEase(clamp((tl.time() - ta.s) / (tb.s - ta.s || 1), 0, 1));
      px += (r.left - word0.left) * k;
      py += (r.top - word0.top - (maxScroll() - max0)) * k;
    }
    setX(px);
    setY(py);
    // facing runs through 0 during a bank turn; the tilt's sign follows the side the
    // nose is on, flipping at the thinnest point of the turn
    setFacing(proxy.facing);
    setRotation((proxy.facing < 0 ? -1 : 1) * proxy.tilt);
    // the shadow follows position and scale only
    setShadowX(px);
    setShadowY(py + h * 0.62 * proxy.scale);

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
export function placeStill(parts: Parts, desktop: boolean, size: Size) {
  const { layer, plane, shadow } = parts;
  const rest = heroRest(size, plane);
  const x = (rest.x / 100) * size.vw;
  const y = (rest.y / 100) * size.vh;
  gsap.set(layer, { position: "absolute", height: 0, overflow: "visible" });
  // facing left (mirrored), at the rest's tilt (desktop: nose slightly up)
  gsap.set(plane, { x, y, rotation: -rest.tilt, scale: 1 });
  gsap.set(parts.body, { scaleX: -1 });
  gsap.set(shadow, { x, y: y + size.h * 0.62, scale: 1 });
}
