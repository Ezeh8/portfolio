"use client";

import { useRef, useState } from "react";
import { site } from "@/content/site";
import { StoryDialog } from "./StoryDialog";
import { buttonClass, Glyphs } from "./ui";

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
          className={buttonClass()}
        >
          <span>
            <Glyphs text={`${storyButton} →`} />
          </span>
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
          <p className="mt-6 text-lg leading-relaxed text-btn-ink sm:text-xl">{story[0]}</p>

          <hr className="my-8 border-line" />

          <div className="flex flex-col gap-4 leading-relaxed text-btn-shadow">
            {story.slice(1, stepsAfter).map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <ul className="flex flex-col gap-2 text-btn-ink">
              {steps.map((s) => (
                <li key={s} className="flex gap-3">
                  <span aria-hidden="true" className="font-mono text-accent-text">
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

          <p className="text-btn-ink">
            {hello.before}
            <a
              href={hello.href}
              // the overlay closes on the click (data-story-close), then goes to contact
              data-story-close
              onClick={(e) => {
                e.preventDefault();
                goContact.current = true;
              }}
              className="font-medium underline decoration-2 underline-offset-4 transition-[color,text-underline-offset] duration-150 hover:text-accent-text hover:underline-offset-[7px]"
            >
              {hello.label}
            </a>
          </p>
        </StoryDialog>
      )}
    </>
  );
}
