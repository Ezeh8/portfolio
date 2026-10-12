"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { Container } from "./ui";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { links, cta } = site.nav;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-text/10 bg-bg/90 backdrop-blur">
      <Container>
        <nav aria-label="Main" className="flex h-16 items-center justify-between">
          <a href="#hero" className="font-display text-lg font-semibold">
            {site.name}
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <ul className="flex gap-6 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-accent-text">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={cta.href}
              className="inline-flex h-9 items-center rounded-full bg-text px-4 text-sm font-medium text-bg hover:bg-accent-text"
            >
              {cta.label}
            </a>
          </div>

          <button
            type="button"
            className="inline-flex h-10 items-center rounded-full border border-text/20 px-4 font-mono text-xs uppercase tracking-[0.12em] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </Container>

      <div id="mobile-menu" hidden={!open} className="border-t border-text/10 md:hidden">
        <Container>
          <ul className="flex flex-col py-4">
            {[...links, cta].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="block py-3 font-display text-2xl"
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
