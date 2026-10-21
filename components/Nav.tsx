"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import SoundToggle from "./SoundToggle";
import { Container } from "./ui";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { wordmark, links } = site.nav;

  // while the phone menu is open the page is hidden and held still (globals.css), so only
  // the menu shows, on glass over the orbs
  useEffect(() => {
    document.documentElement.toggleAttribute("data-menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b-(length:--border-width) border-line bg-bg/95 backdrop-blur">
        <Container>
          <nav aria-label="Main" className="flex h-16 items-center justify-between gap-4">
            <a
              href="#hero"
              aria-label={site.name}
              className="font-display text-2xl font-extrabold tracking-tight text-white"
            >
              {wordmark.text}
              <span className="text-text-muted">{wordmark.dot}</span>
            </a>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-8 md:flex">
                <ul className="flex gap-6 font-mono text-xs uppercase tracking-[0.12em]">
                  {links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="text-text-muted hover:text-accent-text">
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
      </header>

      {/* outside the header: its backdrop blur would trap a fixed child inside the header's box */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 bg-white/[0.045] pt-16 backdrop-blur-[14px] backdrop-saturate-[1.4] md:hidden"
      >
        <Container>
          <ul className="flex flex-col py-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-3 font-mono text-sm uppercase tracking-[0.12em] text-text-muted active:text-accent-text"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </>
  );
}
