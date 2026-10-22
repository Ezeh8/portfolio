"use client";

import { useRef, useState } from "react";
import { site } from "@/content/site";
import { StoryDialog } from "./StoryDialog";
import { Glyphs } from "./ui";

// "the whole story": a button under the About paragraphs that opens the longer story in
// the same full-screen overlay the Work and Experience cards use. "say hello" at the end
// closes it, then goes to the contact section.
export default function AboutStory() {
  const { headline, storyButton, story, stepsAfter, steps, hello } = site.about;
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  // set by "say hello", so closing the overlay goes on to the contact section
  const goContact = useRef(false);

  return (
    <>
      {/* the button sits at the right, under the paragraphs */}
      <div className="flex justify-end">
        <button
          ref={opener}
          type="button"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
          // the same look as the "See all →" buttons under Work and Experience
          className="group inline-flex h-9 cursor-pointer items-center rounded-full border-(length:--border-width) border-line px-4 font-mono text-xs uppercase tracking-[0.12em] transition-[scale,background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome-smooth)] hover:text-btn-text motion-safe:active:scale-95"
        >
          <Glyphs text={`${storyButton} →`} />
        </button>
      </div>

      {open && (
        <StoryDialog
          id="about-story"
          // the overlay's title is the About headline
          title={headline.text}
          keepCase
          chrome
          onClosed={() => {
            setOpen(false);
            opener.current?.focus({ preventScroll: goContact.current });
            if (goContact.current) {
              goContact.current = false;
              window.location.hash = hello.href;
            }
          }}
        >
          <p className="mt-6 text-[15px] italic leading-relaxed text-text-muted sm:text-[17px]">{story[0]}</p>

          <hr className="my-8 border-line" />

          <div className="flex flex-col gap-4 text-[17px] leading-relaxed text-btn-shadow">
            {/* the last paragraph before the steps leads into them, in bold italics */}
            {story.slice(1, stepsAfter).map((p, i, all) => (
              <p key={p.slice(0, 24)} className={i === all.length - 1 ? "font-bold italic" : undefined}>
                {p}
              </p>
            ))}
            <ul className="flex flex-col gap-2 text-btn-ink">
              {steps.map((s) => (
                <li key={s} className="flex gap-3">
                  {/* nudging right and back, unless reduced motion is asked for */}
                  <span
                    aria-hidden="true"
                    className="inline-block font-mono text-text-muted motion-safe:animate-[arrow-nudge_1.6s_ease-in-out_infinite]"
                  >
                    →
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            {story.slice(stepsAfter).map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <hr className="my-8 border-line" />

          {/* one line at every width: the text shrinks with the overlay's column when it
              would not fit at 17px */}
          <div className="@container">
            <p className="whitespace-nowrap text-[min(17px,calc(100cqw/28.6))] italic text-text-muted">
              {hello.before}
              {/* "~ say hello" in chrome, blinking softly unless reduced motion is asked for */}
              <span className="inline-block motion-safe:animate-[hello-blink_3s_ease-in-out_infinite]">
                {/* the smooth chrome: the ~ sits mid-line, right on the plain chrome's dark band,
                    where it read as grey */}
                <span className="chrome font-medium [background-image:var(--chrome-smooth)]">~ </span>
                <a
                  href={hello.href}
                  // the overlay closes on the click (data-story-close), then goes to contact
                  data-story-close
                  onClick={(e) => {
                    e.preventDefault();
                    goContact.current = true;
                  }}
                  className="chrome pr-[0.1em] font-medium underline decoration-text-muted decoration-2 underline-offset-4 transition-[text-decoration-color,text-underline-offset] duration-150 hover:decoration-btn-ink hover:underline-offset-[7px]"
                >
                  {hello.label}
                </a>
              </span>
            </p>
          </div>
        </StoryDialog>
      )}
    </>
  );
}
