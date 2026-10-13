// Pure helpers for the plane's flight, kept free of the DOM.

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// The plane never points steeper than this, up or down.
export const MAX_TILT = 35;

// How the plane should sit while flying from one point to the next: facing right (1) or
// mirrored to face left (-1), always upright, nose tilted at most MAX_TILT degrees.
// Positive tilt is nose down (screen y grows downwards). A (nearly) vertical move keeps
// the previous facing.
export function heading(dx: number, dy: number, previousFacing: 1 | -1 = 1) {
  const facing: 1 | -1 = Math.abs(dx) < 1 ? previousFacing : dx < 0 ? -1 : 1;
  const tilt = clamp((Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI, -MAX_TILT, MAX_TILT);
  return { facing, tilt };
}

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
