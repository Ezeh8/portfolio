import { useId } from "react";

// Folded origami paper plane drawn in code, seen from the side, nose pointing right.
// Purely decorative. Gradient ids are unique per instance.
export default function PaperPlane({ className = "" }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const near = `${id}-near`;
  const top = `${id}-top`;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 220 135"
      className={`block h-auto w-[72px] lg:w-[120px] ${className}`}
    >
      {/* Colors are theme tokens (app/globals.css), set through `style` so they follow a
          theme switch without remounting. */}
      <defs>
        <linearGradient id={near} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "var(--plane-near-from)" }} />
          <stop offset="1" style={{ stopColor: "var(--plane-near-to)" }} />
        </linearGradient>
        <linearGradient id={top} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--plane-top-from)" }} />
          <stop offset="1" style={{ stopColor: "var(--plane-top-to)" }} />
        </linearGradient>
      </defs>
      {/* near wing, underside fold, top wing, inner fold */}
      <polygon points="208,70 70,58 30,98" style={{ fill: `url(#${near})` }} />
      <polygon points="208,70 70,58 92,114" style={{ fill: "var(--plane-underside)" }} />
      <polygon points="208,70 38,6 70,58" style={{ fill: `url(#${top})` }} />
      <polygon points="208,70 56,33 70,58" style={{ fill: "var(--plane-inner)" }} />
      {/* creases */}
      <line
        x1="208"
        y1="70"
        x2="56"
        y2="33"
        strokeWidth="1.2"
        strokeOpacity="0.7"
        style={{ stroke: "var(--plane-crease-light)" }}
      />
      <line
        x1="208"
        y1="70"
        x2="70"
        y2="58"
        strokeWidth="1"
        strokeOpacity="0.5"
        style={{ stroke: "var(--plane-crease-dark)" }}
      />
    </svg>
  );
}
