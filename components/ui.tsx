import type { ReactNode } from "react";
import type { Headline as HeadlineCopy } from "@/content/site";

export function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-8">{children}</div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
      {children}
    </p>
  );
}

// h1 and section h2 headlines: heavy display type, lowercased in CSS only,
// with the `highlight` phrase drawn in the accent color with a squiggle underline.
export function Headline({
  as: Tag = "h2",
  copy,
  className = "",
}: {
  as?: "h1" | "h2";
  copy: HeadlineCopy;
  className?: string;
}) {
  const { text, highlight, keepCase } = copy;
  const at = text.indexOf(highlight);
  return (
    <Tag
      className={`font-display font-extrabold ${keepCase ? "" : "lowercase "}leading-[1.02] tracking-tight ${className}`}
    >
      {at === -1 ? (
        text
      ) : (
        <>
          {text.slice(0, at)}
          <span className="squiggle">{highlight}</span>
          {text.slice(at + highlight.length)}
        </>
      )}
    </Tag>
  );
}

// Small rotated handwritten note with a hand-drawn arrow.
export function HandNote({
  children,
  arrow = "down",
  className = "",
}: {
  children: ReactNode;
  arrow?: "down" | "left";
  className?: string;
}) {
  return (
    <p
      className={`inline-flex items-center gap-2 font-hand text-xl leading-tight text-note ${className}`}
    >
      {arrow === "left" && <HandArrow className="h-6 w-10 -scale-x-100" />}
      <span>{children}</span>
      {arrow === "down" && <HandArrow className="h-8 w-8 rotate-[70deg]" />}
    </p>
  );
}

export function HandArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      <path d="M3 20c9-11 22-15 38-9" />
      <path d="M33 5.5l8.5 5.5-7 6.5" />
    </svg>
  );
}

export function StatusDot({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-2 w-2 shrink-0 rounded-full bg-accent-text ${className}`}
    />
  );
}

// Mono header bar on top of a panel.
export function PanelBar({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 border-b-(length:--border-width) border-line px-4 py-2.5 font-mono text-xs${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}

export const isExternal = (href: string) => href.startsWith("http");

// Characters General Sans lacks: ₦ renders in the display font, → in the
// (self-hosted, full) mono font. The copy itself is unchanged.
export function Glyphs({ text }: { text: string }) {
  return text.split(/([₦→])/).map((part, i) =>
    part === "₦" ? (
      <span key={i} className="font-display">
        ₦
      </span>
    ) : part === "→" ? (
      <span
        key={i}
        className="inline-block font-mono transition-transform duration-150 motion-safe:group-hover:translate-x-1"
      >
        →
      </span>
    ) : (
      part
    ),
  );
}

// Links whose URL is still TODO (null) are dropped instead of rendered.
export const hasHref = <T extends { href: string | null }>(
  link: T,
): link is T & { href: string } => link.href !== null;

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const styles =
    variant === "primary"
      ? "border-btn-edge bg-btn-fill text-btn-ink hover:bg-btn-hover hover:border-btn-hover hover:text-btn-hover-ink [--offset:var(--btn-shadow)] hover:[--offset:var(--btn-hover-shadow)]"
      : "border-line bg-card text-text hover:bg-bg";
  return (
    <a
      href={href}
      {...(isExternal(href) && { target: "_blank", rel: "noopener noreferrer" })}
      className={`group inline-flex h-11 items-center justify-center rounded-full border-(length:--border-width) px-5 text-sm font-medium whitespace-nowrap shadow-[3px_3px_0_var(--offset,var(--shadow))] transition-[translate,box-shadow,background-color,border-color,color] duration-150 ease-out motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--offset,var(--shadow))] motion-safe:active:translate-x-0.5 motion-safe:active:translate-y-0.5 active:shadow-[1px_1px_0_var(--offset,var(--shadow))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text ${styles}`}
    >
      {/* wrapped so the flex container keeps the space before a trailing → */}
      <span>{typeof children === "string" ? <Glyphs text={children} /> : children}</span>
    </a>
  );
}
