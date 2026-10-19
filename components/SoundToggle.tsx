"use client";

import { useEffect, useRef, useState } from "react";

// Optional mission-control sound, always off on page load; a visitor turns it on.
// Synthesised with the Web Audio API (no audio files):
// - a low control-room hum underneath, the whole time it is on (fades in and out)
// - NASA "Quindar" radio beeps when the paper plane reports a moment (PLANE_EVENT):
//   - "side": the plane reaches the left or right side of the screen: one 2525 Hz beep
//   - "landing": the plane lands on "touch": the 2525 Hz beep, then the 2475 Hz one
// Turning the sound on plays one quiet beep, so the visitor knows it works.
export const PLANE_EVENT = "plane:touch";
export type PlaneMoment = "side" | "landing";

const LEVEL = 0.03; // beeps
const HUM_LEVEL = 0.04;
const FADE = 0.8; // seconds, hum in and out

// Two low sines through a lowpass, into a gain that starts silent. Returns that gain.
function startHum(ctx: AudioContext) {
  const gain = ctx.createGain();
  gain.gain.value = 0;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 180;
  filter.connect(gain).connect(ctx.destination);
  for (const f of [55, 110.4]) {
    const osc = ctx.createOscillator();
    osc.frequency.value = f;
    osc.connect(filter);
    osc.start();
  }
  return gain;
}

function beep(ctx: AudioContext, at: number, freq: number, level = LEVEL) {
  const osc = ctx.createOscillator();
  osc.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(level, at + 0.01);
  g.gain.setValueAtTime(level, at + 0.24);
  g.gain.linearRampToValueAtTime(0, at + 0.25);
  osc.connect(g).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + 0.26);
}

export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const ctx = useRef<AudioContext | null>(null);
  const hum = useRef<GainNode | null>(null);
  const onRef = useRef(false);

  useEffect(() => {
    const play = (e: Event) => {
      const c = ctx.current;
      if (!onRef.current || !c) return;
      const at = c.currentTime + 0.02;
      beep(c, at, 2525);
      if ((e as CustomEvent<PlaneMoment>).detail === "landing") beep(c, at + 0.4, 2475);
    };
    window.addEventListener(PLANE_EVENT, play);
    return () => {
      window.removeEventListener(PLANE_EVENT, play);
      void ctx.current?.close();
      ctx.current = null;
      hum.current = null;
    };
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    onRef.current = next;
    // created on the first click: browsers only allow audio after a user gesture
    if (next && !ctx.current) {
      ctx.current = new AudioContext();
      hum.current = startHum(ctx.current);
    }
    const c = ctx.current;
    const g = hum.current?.gain;
    if (!c || !g) return;
    const now = c.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    if (next) {
      void c.resume();
      g.linearRampToValueAtTime(HUM_LEVEL, now + FADE);
      beep(c, now + 0.02, 2525, LEVEL / 2);
    } else {
      g.linearRampToValueAtTime(0, now + FADE);
      // pause the audio once faded, unless it was turned back on meanwhile
      window.setTimeout(() => {
        if (ctx.current === c && !onRef.current) void c.suspend();
      }, FADE * 1000 + 50);
    }
  };

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label="Mission control sound"
      title={on ? "Sound on" : "Sound off"}
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border-(length:--border-width) border-line transition-[scale,background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome-smooth)] hover:text-btn-text motion-safe:active:scale-95 aria-pressed:bg-btn-bg aria-pressed:bg-[image:var(--chrome-smooth)] aria-pressed:text-btn-text"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        {on ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        ) : (
          <path d="m16 9 5 6m0-6-5 6" />
        )}
      </svg>
    </button>
  );
}
