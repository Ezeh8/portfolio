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

export type Size = { w: number; h: number; vw: number; vh: number };
