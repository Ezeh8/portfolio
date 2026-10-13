"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  type Theme,
  readStoredTheme,
  storeTheme,
  syncThemeColor,
  systemTheme,
} from "./theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const currentTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

// Round light/dark switch. Both icons are always rendered; CSS shows the moon in light
// mode and the sun in dark mode, so the right one shows from the first paint.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  // null while server rendering and hydrating; the real theme right after
  const theme = useSyncExternalStore<Theme | null>(subscribe, currentTheme, () => null);
  const timer = useRef<number | undefined>(undefined);

  // With no saved choice, keep following the system setting.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readStoredTheme()) return;
      document.documentElement.setAttribute("data-theme", systemTheme());
      syncThemeColor();
    };
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      window.clearTimeout(timer.current);
    };
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    // colors fade only during a switch (see .theme-switching in globals.css)
    root.classList.add("theme-switching");
    root.setAttribute("data-theme", next);
    storeTheme(next);
    syncThemeColor();
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => root.classList.remove("theme-switching"), 250);
  };

  const label =
    theme === null
      ? "Switch color theme"
      : theme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-full border-(length:--border-width) border-line hover:bg-btn-bg hover:text-btn-text ${className}`}
    >
      {/* moon: shown in light mode */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 dark:hidden"
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
      {/* sun: shown in dark mode */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="hidden h-4 w-4 dark:block"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
