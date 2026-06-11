/* The Zanzo mark: a frame and its afterimage. Two rounded frames, the echo
   trailing behind at lower opacity — the image that stays after the scroll. */

export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <rect
        x="2.5"
        y="7.5"
        width="22"
        height="22"
        rx="6"
        stroke="var(--color-copper-500)"
        strokeWidth="2"
        opacity="0.35"
      />
      <rect
        x="7.5"
        y="2.5"
        width="22"
        height="22"
        rx="6"
        stroke="var(--color-copper-400)"
        strokeWidth="2.5"
      />
      <circle cx="18.5" cy="13.5" r="3" fill="var(--color-copper-300)" />
    </svg>
  );
}

export function Logo({ size = 22, wordmark = true }: { size?: number; wordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      {wordmark && (
        <span className="font-display text-xl font-medium tracking-tight text-ink">zanzo</span>
      )}
    </span>
  );
}
