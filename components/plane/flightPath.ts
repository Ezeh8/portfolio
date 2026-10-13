import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Pure geometry for the plane's flight, kept free of the DOM.
//
// A waypoint is a point on screen (viewport pixels, the plane's centre) and the scroll
// position `s` at which the plane should be there. The flight is one curved motion path
// through every waypoint; a custom ease maps scroll position to distance along that path,
// so the plane passes each waypoint exactly at its scroll position.

export type Waypoint = { x: number; y: number; s: number };
export type Bounds = { left: number; right: number; top: number; bottom: number };

// Smoothest first. A Catmull-Rom style curve can bulge past its points, so the first
// curviness whose curve stays within SLACK px of the bounds wins; 0 (straight lines
// between points inside a rectangle) always stays inside. The caller clamps the plane to
// the exact bounds, which absorbs the slack.
const CURVINESS = [1, 0.75, 0.5, 0.25, 0];
const SLACK = 30;

const bezierPoint = (seg: number[], i: number, t: number) => {
  const mt = 1 - t;
  const a = mt * mt * mt;
  const b = 3 * mt * mt * t;
  const c = 3 * mt * t * t;
  const d = t * t * t;
  return {
    x: a * seg[i] + b * seg[i + 2] + c * seg[i + 4] + d * seg[i + 6],
    y: a * seg[i + 1] + b * seg[i + 3] + c * seg[i + 5] + d * seg[i + 7],
  };
};

// arrayToRawPath gives one cubic per pair of neighbouring points:
// [x0, y0, then cp1x, cp1y, cp2x, cp2y, x, y for each segment].
function segmentLengths(seg: number[]) {
  const lengths: number[] = [];
  for (let i = 0; i + 7 < seg.length; i += 6) {
    let length = 0;
    let prev = bezierPoint(seg, i, 0);
    for (let k = 1; k <= 32; k++) {
      const p = bezierPoint(seg, i, k / 32);
      length += Math.hypot(p.x - prev.x, p.y - prev.y);
      prev = p;
    }
    lengths.push(length);
  }
  return lengths;
}

function insideBounds(seg: number[], b: Bounds) {
  for (let i = 0; i + 7 < seg.length; i += 6) {
    for (let k = 0; k <= 24; k++) {
      const p = bezierPoint(seg, i, k / 24);
      if (
        p.x < b.left - SLACK ||
        p.x > b.right + SLACK ||
        p.y < b.top - SLACK ||
        p.y > b.bottom + SLACK
      )
        return false;
    }
  }
  return true;
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// Waypoints whose scroll positions are closer than `gap` are pushed apart around their
// midpoint (two project cards in the same row would otherwise be reached at the same
// scroll position), then every position is kept inside [0, max] and in order.
export function spaceOut(positions: number[], gap: number, max: number) {
  const s = [...positions];
  for (let i = 1; i < s.length; i++) {
    const d = s[i] - s[i - 1];
    if (d < gap) {
      const push = (gap - d) / 2;
      s[i - 1] -= push;
      s[i] += push;
    }
  }
  for (let i = 0; i < s.length; i++) s[i] = clamp(s[i], 0, max);
  for (let i = 1; i < s.length; i++) s[i] = Math.max(s[i], s[i - 1] + 1);
  return s;
}

export function planFlight(points: Waypoint[], bounds: Bounds) {
  const xy = points.map(({ x, y }) => ({ x, y }));
  let curviness = 0;
  let seg = MotionPathPlugin.arrayToRawPath(xy, { curviness: 0 })[0];
  for (const c of CURVINESS) {
    const candidate = MotionPathPlugin.arrayToRawPath(xy, { curviness: c })[0];
    if (insideBounds(candidate, bounds)) {
      curviness = c;
      seg = candidate;
      break;
    }
  }

  const lengths = segmentLengths(seg);
  const total = lengths.reduce((a, b) => a + b, 0) || 1;
  const startAt = [0];
  for (const l of lengths) startAt.push(startAt[startAt.length - 1] + l);

  const S = points.map((p) => p.s);
  const duration = S[S.length - 1];

  // Tween time is scroll position. Inside each segment the plane eases in and out, so it
  // slows as it reaches each waypoint.
  const ease = (t: number) => {
    const s = t * duration;
    let j = 0;
    while (j < lengths.length - 1 && s > S[j + 1]) j++;
    const u = clamp((s - S[j]) / (S[j + 1] - S[j] || 1), 0, 1);
    const k = 0.5 - 0.5 * Math.cos(Math.PI * u);
    return (startAt[j] + k * lengths[j]) / total;
  };

  // GSAP starts a point-array motion path from the target's current position, so the
  // target is placed on the first waypoint and the path lists the rest.
  return { start: xy[0], path: xy.slice(1), curviness, duration, ease };
}
