import { Fragment } from "react";
import { site } from "@/content/site";

// Copies per half of the track; enough to cover very wide screens.
const COPIES = 8;

function Star() {
  // ✦ is in none of the site's fonts, so it is drawn as an SVG instead.
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="mx-4 inline-block h-3 w-3 fill-current">
      <path d="M8 0c.6 4.6 2.4 6.9 8 8-5.6 1.1-7.4 3.4-8 8-.6-4.6-2.4-6.9-8-8 5.6-1.1 7.4-3.4 8-8z" />
    </svg>
  );
}

function Phrase({ hidden }: { hidden?: boolean }) {
  const parts = site.banner.phrase.split("✦").map((p) => p.trim()).filter(Boolean);
  return (
    <span aria-hidden={hidden || undefined} className="inline-flex shrink-0 items-center">
      {parts.map((part) => (
        <Fragment key={part}>
          <span>{part}</span>
          <Star />
        </Fragment>
      ))}
    </span>
  );
}

// `decorative` hides the whole banner from assistive tech, for a copy that repeats
// another banner on the page.
export default function Banner({ id, decorative = false }: { id?: string; decorative?: boolean }) {
  return (
    // The wrapper clips the oversized, tilted band; its vertical padding leaves room
    // for the tilt so the band's corners are never cut off at the top or bottom.
    <div
      id={id}
      aria-hidden={decorative || undefined}
      className="relative z-[2] overflow-hidden py-[max(2rem,3vw)]"
    >
      <div className="-mx-[10vw] -rotate-2 bg-banner-bg py-4 text-banner-text">
        <div className="banner-track flex w-max font-mono text-sm uppercase tracking-[0.18em] sm:text-base">
          {Array.from({ length: COPIES * 2 }, (_, i) => (
            <Phrase key={i} hidden={i > 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
