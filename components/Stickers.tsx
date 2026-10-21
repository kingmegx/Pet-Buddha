// Line-art stickers in the truus style: a simple drawing in one dark line on
// a soft coloured blob. Not all dogs: bones, paws, balls, hearts, sniffing
// noses, leaves and sparkles. Drawn on a 64x64 grid.

export type StickerKind = "bone" | "paw" | "ball" | "heart" | "leaf" | "sparkle" | "bowl" | "nose";

const ART: Record<StickerKind, React.ReactNode> = {
  bone: <path d="M18 26a6 6 0 1 1 8-8l12 12a6 6 0 1 1 8 8 6 6 0 1 1-8 8L26 34a6 6 0 1 1-8-8Z" />,
  paw: (
    <>
      <path d="M32 50c-8 0-14-4-14-10s7-12 14-12 14 6 14 12-6 10-14 10Z" />
      <ellipse cx="20" cy="24" rx="4.5" ry="6" />
      <ellipse cx="29" cy="17" rx="4.5" ry="6" />
      <ellipse cx="39" cy="17" rx="4.5" ry="6" />
      <ellipse cx="47" cy="25" rx="4.5" ry="6" />
    </>
  ),
  ball: (
    <>
      <circle cx="32" cy="32" r="16" />
      <path d="M18 24c8 2 12 8 10 22M46 40c-8-2-12-8-10-22" />
    </>
  ),
  heart: <path d="M32 48S14 37 14 25a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 12-18 23-18 23Z" />,
  leaf: (
    <>
      <path d="M16 48C16 28 28 16 48 16c0 20-12 32-32 32Z" />
      <path d="M16 48 36 28" />
    </>
  ),
  sparkle: (
    <>
      <path d="M32 14c2 10 6 14 16 16-10 2-14 6-16 16-2-10-6-14-16-16 10-2 14-6 16-16Z" />
      <path d="M48 46l2 4M14 18l3 3" />
    </>
  ),
  bowl: (
    <>
      <path d="M14 34h36c0 9-8 14-18 14S14 43 14 34Z" />
      <path d="M22 34c0-4 4-8 6-6M30 34c0-5 3-9 6-7M38 34c0-3 2-6 5-5" />
    </>
  ),
  nose: (
    <>
      <path d="M22 30c0-6 20-6 20 0 0 6-6 10-10 10s-10-4-10-10Z" />
      <path d="M32 40v6M26 50c3 0 6-2 6-4 0 2 3 4 6 4" />
      <path d="M12 20c3-2 6-2 8 0M44 20c2-2 5-2 8 0" />
    </>
  ),
};

// A rounded, slightly lopsided blob behind the drawing.
const BLOB = "M33 4c13 0 25 8 27 21 2 12-3 23-12 30-9 6-22 7-32 1C6 50 2 38 5 26 8 13 19 4 33 4Z";

export function Sticker({ kind, tone = "#e6f5c9", ink = "#7c2d4a", className = "" }: { kind: StickerKind; tone?: string; ink?: string; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`line-sticker ${className}`} aria-hidden>
      <path d={BLOB} fill={tone} />
      <g fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {ART[kind]}
      </g>
    </svg>
  );
}
