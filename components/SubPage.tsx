import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { Container } from "./ui";

const backLink =
  "font-mono text-xs uppercase tracking-[0.12em] text-text-muted transition-colors duration-150 hover:text-accent-text";

// The frame of the "See all" pages (/projects, /experience): a slim header with the
// wordmark and "back home", the page's section, then "say hello" back to Contact.
export default function SubPage({ children }: { children: ReactNode }) {
  const { wordmark } = site.nav;
  return (
    <>
      <header className="sticky top-0 z-50 border-b-(length:--border-width) border-line bg-bg/95 backdrop-blur">
        <Container>
          <nav aria-label="Main" className="flex h-16 items-center justify-between gap-4">
            <Link href="/" aria-label={site.name} className="font-display text-2xl font-extrabold tracking-tight text-white">
              {wordmark.text}
              <span className="text-accent-text">{wordmark.dot}</span>
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
          <p className="pb-20 sm:pb-28">
            <Link href="/#contact" className={backLink}>
              ← say hello
            </Link>
          </p>
        </Container>
      </main>
    </>
  );
}
