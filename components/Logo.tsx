// The Pet Buddha logo: a small flat mark (a dog's head, eyes closed in
// meditation, with a dot on the forehead) beside the name in the brand's
// hand-drawn face. One colour, sized like a logo, not an illustration.
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden>
      <ellipse cx="9" cy="20" rx="5" ry="10" transform="rotate(14 9 20)" fill="#111" />
      <ellipse cx="31" cy="20" rx="5" ry="10" transform="rotate(-14 31 20)" fill="#111" />
      <path d="M20 6 C29 6 33 12 33 20 C33 29 27 34 20 34 C13 34 7 29 7 20 C7 12 11 6 20 6 Z" fill="#111" />
      <path d="M13 19.5 q2.5 2.2 5 0 M22 19.5 q2.5 2.2 5 0" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="20" cy="26" rx="3.2" ry="2.3" fill="#fff" />
      <circle cx="20" cy="12.6" r="1.7" fill="#e5533a" />
    </svg>
  );
}

export function Logo() {
  return (
    // The mark is set aside for now: just the name.
    <span className="logo-lockup">
      <span>Pet Buddha</span>
    </span>
  );
}
