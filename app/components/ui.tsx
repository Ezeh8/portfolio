import type { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-8">{children}</div>
  );
}

export function SectionLabel({
  children,
  as: Tag = "h2",
}: {
  children: ReactNode;
  as?: "h2" | "p";
}) {
  return (
    <Tag className="font-mono text-xs uppercase tracking-[0.12em] text-text/60">
      {children}
    </Tag>
  );
}

export const isExternal = (href: string) => href.startsWith("http");

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
      ? "bg-text text-bg hover:bg-accent-text"
      : "border border-text/20 text-text hover:border-text";
  return (
    <a
      href={href}
      {...(isExternal(href) && { target: "_blank", rel: "noopener noreferrer" })}
      className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium ${styles}`}
    >
      {children}
    </a>
  );
}
