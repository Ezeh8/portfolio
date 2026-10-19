"use client";

import { useEffect, useState } from "react";

// The hero's flight log, typed out as the page opens: each command is typed a letter at a
// time, its output follows quicker, then just a blinking cursor. Every
// line is laid out in full from the start (the untyped part invisible), so the panel keeps
// its size and nothing around it moves. Screen readers get the whole log at once; under
// reduced motion it shows in full straight away.
const START_MS = 500;
const COMMAND_MS = 55;
const OUTPUT_MS = 14;
const LINE_PAUSE_MS = 320;

const isCommand = (line: string) => line.startsWith("$ ");

export function TypedLog({ lines }: { lines: readonly string[] }) {
  // where each line starts in the run of typed letters
  const starts = lines.map((_, i) => lines.slice(0, i).reduce((sum, l) => sum + l.length, 0));
  const total = lines.reduce((sum, line) => sum + line.length, 0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    let count = 0;
    let id = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      id = window.setTimeout(() => setTyped(total), 0);
      return () => window.clearTimeout(id);
    }
    const step = () => {
      if (count >= total) return;
      count += 1;
      setTyped(count);
      // which line the next letter is in, and whether this one just finished a line
      let start = 0;
      let line = lines[0];
      for (const l of lines) {
        line = l;
        if (count < start + l.length) break;
        start += l.length;
      }
      const lineDone = count === start + line.length || count === start;
      id = window.setTimeout(step, lineDone ? LINE_PAUSE_MS : isCommand(line) ? COMMAND_MS : OUTPUT_MS);
    };
    id = window.setTimeout(step, START_MS);
    return () => window.clearTimeout(id);
  }, [lines, total]);

  const done = typed >= total;
  const cursor = (
    // no net width, so it never pushes the text along as it moves
    <span
      aria-hidden="true"
      className="-mr-[0.6em] inline-block h-[1.15em] w-[0.6em] translate-y-[0.2em] bg-white animate-[caret-blink_1s_steps(1)_infinite]"
    />
  );

  return (
    <>
      <p className="sr-only">{lines.filter(Boolean).join(". ")}</p>
      <div aria-hidden="true" className="space-y-1">
        {lines.map((line, i) => {
          const offset = starts[i];
          const shown = Math.min(Math.max(typed - offset, 0), line.length);
          const active = !done && typed >= offset && typed < offset + line.length;
          if (!line) return <p key={i} className="h-2" />;
          return (
            <p key={i} className={isCommand(line) ? "text-white" : "text-text-muted"}>
              {/* a command's "$" in grey */}
              {isCommand(line) && shown > 0 ? (
                <>
                  <span className="text-text-muted">$</span>
                  {line.slice(1, shown)}
                </>
              ) : (
                line.slice(0, shown)
              )}
              {active && cursor}
              <span className="invisible">{line.slice(shown)}</span>
            </p>
          );
        })}
        <p className={done ? "" : "invisible"}>{cursor}</p>
      </div>
    </>
  );
}
