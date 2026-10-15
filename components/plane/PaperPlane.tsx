import { useId } from "react";

// Folded origami paper plane drawn in code, seen from the side, nose pointing right,
// finished in polished metal: each face is a chrome gradient with a bright highlight and
// a dark reflection band, the underside is gunmetal. Purely decorative. Gradient ids are
// unique per instance.
export default function PaperPlane({ className = "" }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const near = `${id}-near`;
  const top = `${id}-top`;
  const under = `${id}-under`;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 220 135"
      className={`block h-auto w-[74px] lg:w-[122px] ${className}`}
    >
      <defs>
        <linearGradient id={near} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F5F7" />
          <stop offset="0.38" stopColor="#B9BDC3" />
          <stop offset="0.5" stopColor="#5E636B" />
          <stop offset="0.62" stopColor="#D7DADE" />
          <stop offset="1" stopColor="#8B9098" />
        </linearGradient>
        <linearGradient id={top} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.4" stopColor="#D7DADE" />
          <stop offset="0.52" stopColor="#7D828A" />
          <stop offset="0.66" stopColor="#E4E6E9" />
          <stop offset="1" stopColor="#A9ADB4" />
        </linearGradient>
        <linearGradient id={under} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4A4E56" />
          <stop offset="1" stopColor="#1C1E22" />
        </linearGradient>
      </defs>
      {/* near wing, underside fold, top wing, inner fold */}
      <polygon points="208,70 70,58 30,98" fill={`url(#${near})`} />
      <polygon points="208,70 70,58 92,114" fill={`url(#${under})`} />
      <polygon points="208,70 38,6 70,58" fill={`url(#${top})`} />
      <polygon points="208,70 56,33 70,58" fill="#C9CCD1" />
      {/* creases */}
      <line x1="208" y1="70" x2="56" y2="33" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.9" />
      <line x1="208" y1="70" x2="70" y2="58" stroke="#0B0C0E" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  );
}
