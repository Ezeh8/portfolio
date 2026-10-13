// Pure helpers for the plane's flight, kept free of the DOM.

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// Steepest nose-down (dives) and nose-up angle that travel direction alone can produce.
export const MAX_TILT = 70;

// How the plane sits while flying a leg of (dx, dy) screen pixels: facing right (1) or
// mirrored to face left (-1), always upright, nose tilted at most MAX_TILT degrees.
// Positive tilt is nose down (screen y grows downwards). A (nearly) vertical leg keeps
// the previous facing.
export function heading(dx: number, dy: number, previousFacing: 1 | -1 = 1) {
  const facing: 1 | -1 = Math.abs(dx) < 1 ? previousFacing : dx < 0 ? -1 : 1;
  const tilt = clamp((Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI, -MAX_TILT, MAX_TILT);
  return { facing, tilt };
}

// Keyframe scroll positions in order, inside [0, max], at least 1px apart, with the
// last one pinned to `max`.
export function inOrder(positions: number[], max: number) {
  const s = positions.map((v) => clamp(v, 0, max));
  for (let i = 1; i < s.length; i++) s[i] = Math.max(s[i], s[i - 1] + 1);
  s[s.length - 1] = max;
  for (let i = s.length - 2; i >= 0; i--) s[i] = Math.min(s[i], s[i + 1] - 1);
  return s;
}

type Box = { left: number; top: number; right: number; bottom: number };

// Nearest spot to (x, y) where a w×h box (centred on the spot) overlaps none of the
// obstacles and stays inside `area`. Searches outwards in 8px steps up to `radius`.
export function nearestClear(
  x: number,
  y: number,
  w: number,
  h: number,
  obstacles: Box[],
  area: Box,
  radius: number,
) {
  const clear = (cx: number, cy: number) =>
    cx - w / 2 >= area.left &&
    cx + w / 2 <= area.right &&
    cy - h / 2 >= area.top &&
    cy + h / 2 <= area.bottom &&
    obstacles.every(
      (o) =>
        cx + w / 2 <= o.left ||
        cx - w / 2 >= o.right ||
        cy + h / 2 <= o.top ||
        cy - h / 2 >= o.bottom,
    );
  if (clear(x, y)) return { x, y, moved: false };
  const offsets: [number, number][] = [];
  for (let dx = -radius; dx <= radius; dx += 8)
    for (let dy = -radius; dy <= radius; dy += 8) offsets.push([dx, dy]);
  offsets.sort((a, b) => a[0] ** 2 + a[1] ** 2 - (b[0] ** 2 + b[1] ** 2));
  for (const [dx, dy] of offsets) if (clear(x + dx, y + dy)) return { x: x + dx, y: y + dy, moved: true };
  return { x, y, moved: false };
}
