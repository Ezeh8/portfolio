import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { ShowLessLink } from "./BackLink";
import { Container } from "./ui";

const backLink =
  "font-mono text-xs uppercase tracking-[0.12em] text-text-muted transition-colors duration-150 hover:text-accent-text";

// The frame of the "See all" pages (/projects, /experience): a slim header with the
// wordmark and "back home", the page's section, then "show less" at the right, back to
// where the visitor came from (`page` is this page's path, `from` the homepage section).
export default function SubPage({ children, page, from }: { children: ReactNode; page: string; from: string }) {
  const { wordmark } = site.nav;
  return (
    <>
      <header className="sticky top-0 z-50 border-b-(length:--border-width) border-line bg-bg/95 backdrop-blur">
        <Container>
          <nav aria-label="Main" className="flex h-16 items-center justify-between gap-4">
            <Link href="/" aria-label={site.name} className="font-display text-2xl font-extrabold tracking-tight text-white">
              {wordmark.text}
              <span className="text-text-muted">{wordmark.dot}</span>
            </Link>
            <Link href="/" className={backLink}>
              ← back home
            </Link>
          </nav>
        </Container>
      </header>
      <main className="flex-1">
        {children}
        <Container>
          {/* the same pill button as "See all →" */}
          <p className="flex justify-end pb-12 font-mono text-xs sm:pb-16">
            <ShowLessLink
              page={page}
              fallback={from}
              className="group inline-flex h-9 items-center rounded-full border-(length:--border-width) border-line px-4 uppercase tracking-[0.12em] transition-[scale,background-color,color] duration-150 hover:bg-btn-bg hover:bg-[image:var(--chrome)] hover:text-btn-text motion-safe:active:scale-95"
            />
          </p>
        </Container>
      </main>
    </>
  );
}
