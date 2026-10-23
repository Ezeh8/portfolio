import { $, docRect, navBottom } from "./dom";
import { heading, isClear, nearestClear } from "./flightPath";
import type { Size } from "./types";

// The landed plane: nose left, at `scale`, the tip of its nose dug this many px into the
// top-right corner of the "h" of the closing headline's "touch".
export const LANDING_SCALE = 0.45;
export const NOSE_DEPTH = 1;
// Desktop: the nose comes in this much closer, along the same angle.
export const DESKTOP_NOSE_DEPTH = 12;
// Phones: the same, as a share of the headline's font size (desktop's 12px on its 96px
// headline), so the landed plane sits on the smaller h just as it does on desktop.
export const PHONE_NOSE_DEPTH_EM = DESKTOP_NOSE_DEPTH / 96;
// Phones: the final glide onto the h starts this far across (screen %) and comes down at
// this angle, nearly level, like desktop's.
export const PHONE_GLIDE_X = 90;
export const PHONE_GLIDE_ANGLE = 10;
// Phones: the landed nose this many px further back from the h than that share puts it.
export const PHONE_NOSE_BACK = 3;
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
// `scale`: the plane's size there, for where its nose is (phones fly at full size).
export function headlineLanding(
  word: HTMLElement,
  plane: HTMLElement,
  size: Size,
  max: number,
  from: { x: number; y: number },
  scale = LANDING_SCALE,
  depth = NOSE_DEPTH,
) {
  const { vw, vh } = size;
  const corner = lastLetterCorner(word);
  const tip = { x: corner.x - depth, y: corner.y - max + depth };
  // the tilt and the centre depend on each other; a few rounds settle them
  let centre = { x: tip.x, y: tip.y };
  let tilt = 0;
  for (let i = 0; i < 4; i++) {
    tilt = heading(centre.x - (from.x / 100) * vw, centre.y - (from.y / 100) * vh, -1).tilt;
    const nose = noseOffset(plane, size, -1, tilt, scale);
    centre = { x: tip.x - nose.x, y: tip.y - nose.y };
  }
  if (process.env.NODE_ENV !== "production") {
    // the plane's top edge (roughly) must clear the nav, the headline's bottom the screen
    if (centre.y - (size.h * scale) / 2 < navBottom() || corner.bottom - max > vh)
      console.warn("[plane] the closing headline is not fully on screen, with room above it, at the bottom of the scroll");
  }
  return { x: (centre.x / vw) * 100, y: (centre.y / vh) * 100, tilt };
}

// The hero resting spot (leg 0), in screen % at scroll 0, measured from the "follow the
// plane" note on every layout: on the note's line, just after its last word, with the
// plane's nose (it faces left) REST_GAP px from the text, so the note reads as pointing
// at it.
// Only if it doesn't fit across the screen there (and would cover the headline, the hero
// buttons or the flight log) does the plane move up in 2px steps until it doesn't;
// failing that, to the nearest clear spot. Falls back
// to x 26, y 55 if the note is missing.
const REST_GAP = 5;

export function heroRest(size: Size, plane: HTMLElement) {
  const { w, h, vw, vh } = size;
  const name = $("#hero [data-hero-name]") as HTMLElement | null;
  if (name && window.matchMedia("(max-width: 1023px)").matches) return nameRest(name, plane, size);
  const note = $("#hero .font-hand");
  if (!note) return { x: 26, y: 55, tilt: -6 };

  // The plane's box at its resting tilt (-6°), with a little breathing room.
  const rad = (6 * Math.PI) / 180;
  const bw = w * Math.cos(rad) + h * Math.sin(rad) + 8;
  const bh = w * Math.sin(rad) + h * Math.cos(rad) + 8;

  // the nose (at the resting tilt and facing left) REST_GAP px after the last word, level
  // with the middle of the text
  const words = docRect(note);
  const nose = noseOffset(plane, size, -1, -6, 1);
  const x = words.right + REST_GAP - nose.x;
  const y = words.top + words.height / 2 - nose.y;

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
  // At scroll 0: below the sticky nav. No bottom limit, so the plane stays by the note
  // even when the note sits low on a tall phone hero.
  const area = {
    left: 0,
    right: vw,
    top: ($("header") as HTMLElement | null)?.offsetHeight ?? 0,
    bottom: Infinity,
  };

  let spot = { x, y };
  let how = "";
  // right after the words whenever it fits across the screen, even where its box dips
  // behind the top of the flight log (the plane flies behind the cards)
  const fits = x - bw / 2 >= area.left && x + bw / 2 <= area.right && y - bh / 2 >= area.top;
  if (!fits && !isClear(x, y, bw, bh, avoid, area)) {
    // move up, at most until the plane clears the top of the note
    const limit = words.top - bh / 2;
    let up = y;
    while (up > limit && !isClear(x, up, bw, bh, avoid, area)) up -= 2;
    if (isClear(x, up, bw, bh, avoid, area)) {
      spot = { x, y: up };
      how = `moved up ${Math.round(y - up)}px`;
    } else {
      const found = nearestClear(x, y, bw, bh, avoid, area, Math.round(Math.min(vw, vh) * 0.4));
      spot = { x: found.x, y: found.y };
      how = `moved to the nearest clear spot (${Math.round(found.x - x)}, ${Math.round(found.y - y)})px`;
    }
  }
  const result = { x: (spot.x / vw) * 100, y: (spot.y / vh) * 100, tilt: -6 };
  if (process.env.NODE_ENV !== "production") {
    console.info(
      `[plane] hero rest at (${result.x.toFixed(1)}, ${result.y.toFixed(1)})` +
        (how ? `: ${how} to keep clear of the headline, buttons and flight log` : ", after the note"),
    );
  }
  return result;
}

// Phones and tablets: the hero resting spot is right beside the final "a" of "Ezeh
// Ikenna", the plane facing left and angled NAME_TILT° nose down, the tip of its nose
// NAME_GAP px clear of the letter's right edge, a little below its top (NAME_DROP of the font
// size), pointing at it. Kept that low so the plane stays clear of the line above the
// name. Measured from the letter itself (the font's glyph metrics), so it holds at every
// width.
const NAME_TILT = 12;
const NAME_GAP = 9;
const NAME_DROP = 0.12;

function nameRest(name: HTMLElement, plane: HTMLElement, size: Size) {
  const { vw, vh } = size;
  const corner = lastLetterCorner(name);
  const fontSize = parseFloat(getComputedStyle(name).fontSize) || 38;
  const nose = noseOffset(plane, size, -1, NAME_TILT, 1);
  const x = corner.x + NAME_GAP - nose.x;
  const y = corner.y + fontSize * NAME_DROP - nose.y;
  if (process.env.NODE_ENV !== "production")
    console.info(`[plane] hero rest at the name's "a" (${((x / vw) * 100).toFixed(1)}, ${((y / vh) * 100).toFixed(1)})`);
  return { x: (x / vw) * 100, y: (y / vh) * 100, tilt: NAME_TILT };
}
