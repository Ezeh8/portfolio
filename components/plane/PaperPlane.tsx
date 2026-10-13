// Side-view paper plane drawn in code, nose pointing right. Purely decorative.
export default function PaperPlane({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 72 34"
      className={`block h-auto w-10 lg:w-[72px] ${className}`}
    >
      {/* body: top wing plus the keel folded underneath */}
      <path
        d="M2 4 L70 15 L20 21 L26 32 L13 20 Z"
        fill="var(--accent)"
        stroke="#111214"
        strokeWidth="2"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* centre fold */}
      <path
        d="M13 20 L70 15"
        fill="none"
        stroke="var(--card)"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
