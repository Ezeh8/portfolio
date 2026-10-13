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
      <defs>
        <linearGradient id={near} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2E4FA8" />
          <stop offset="1" stopColor="#1F3C8C" />
        </linearGradient>
        <linearGradient id={top} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4F6FC4" />
          <stop offset="1" stopColor="#2E4FA8" />
        </linearGradient>
      </defs>
      {/* near wing, underside fold, top wing, inner fold */}
      <polygon points="208,70 70,58 30,98" fill={`url(#${near})`} />
      <polygon points="208,70 70,58 92,114" fill="#14295F" />
      <polygon points="208,70 38,6 70,58" fill={`url(#${top})`} />
      <polygon points="208,70 56,33 70,58" fill="#3A5BB6" />
      {/* creases */}
      <line x1="208" y1="70" x2="56" y2="33" stroke="#8098D8" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="208" y1="70" x2="70" y2="58" stroke="#0F1F4A" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  );
}
