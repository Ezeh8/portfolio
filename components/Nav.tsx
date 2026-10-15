"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import SoundToggle from "./SoundToggle";
import { Container } from "./ui";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { wordmark, links } = site.nav;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b-(length:--border-width) border-line bg-bg/95 backdrop-blur">
      <Container>
        <nav aria-label="Main" className="flex h-16 items-center justify-between gap-4">
          <a
            href="#hero"
            aria-label={site.name}
            className="chrome font-display text-2xl font-extrabold tracking-tight"
          >
            {wordmark.text}
            <span className="text-accent-text">{wordmark.dot}</span>
          </a>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-8 md:flex">
              <ul className="flex gap-6 font-mono text-xs uppercase tracking-[0.12em]">
                {links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-accent-text">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* one toggle for every layout, so there is only ever one sound engine */}
            <SoundToggle />

            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-full border-(length:--border-width) border-line px-4 font-mono text-xs uppercase tracking-[0.12em]"
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? "Close" : "Menu"}
              </button>
            </div>
          </div>
        </nav>
      </Container>

      <div id="mobile-menu" hidden={!open} className="border-t-(length:--border-width) border-line md:hidden">
        <Container>
          <ul className="flex flex-col py-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-3 font-mono text-sm uppercase tracking-[0.12em] active:text-accent-text"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </header>
  );
}
