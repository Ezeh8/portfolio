"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

// The "See all" pages remember that they were opened from the homepage, so "show less"
// can go straight back there with the browser's own back step, which returns to exactly
// the spot the visitor left (the scroll position included). Opened any other way (a
// shared link, a new tab), it goes to the homepage section instead. Storage can be
// unavailable (private windows), so every access is guarded.
const KEY = "opened-from-home";

export function SeeAllLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        try {
          sessionStorage.setItem(KEY, href);
        } catch {}
      }}
    >
      {children}
    </Link>
  );
}

export function ShowLessLink({ page, fallback, className }: { page: string; fallback: string; className: string }) {
  const router = useRouter();
  return (
    <a
      href={fallback}
      className={className}
      onClick={(e) => {
        let fromHome = false;
        try {
          fromHome = sessionStorage.getItem(KEY) === page;
          sessionStorage.removeItem(KEY);
        } catch {}
        if (!fromHome) return; // a plain link to the homepage section
        e.preventDefault();
        router.back();
      }}
    >
      show less
    </a>
  );
}
