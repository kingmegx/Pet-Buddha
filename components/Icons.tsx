import { WalkingBeagle } from "./Walkers";

// Small, still pictures for the "why a walk is not enough" comparison.
// One plain object each, so they read at a glance.

export function WalkIcon() {
  return (
    <span className="icon-walk">
      <WalkingBeagle />
    </span>
  );
}

export function BallIcon() {
  return (
    <svg viewBox="0 0 60 60" aria-hidden>
      <circle cx="30" cy="30" r="20" fill="#c6ec6a" />
      <path d="M14 18 C24 24 24 36 14 42 M46 18 C36 24 36 36 46 42" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// A nose down on the floor, following a trail of scent to a treat.
export function SniffIcon() {
  return (
    <svg viewBox="0 0 60 60" aria-hidden>
      <path d="M8 44 C16 38 22 46 30 40 C36 35 40 42 46 38" fill="none" stroke="#e5533a" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="1 5" />
      <circle cx="50" cy="40" r="4.5" fill="#a8552c" />
      <path d="M6 22 C6 14 22 12 26 20 L28 30 C22 36 10 34 6 28 Z" fill="#cf7d4a" />
      <ellipse cx="27" cy="30" rx="5" ry="4" fill="#111" />
      <circle cx="16" cy="21" r="1.8" fill="#111" />
    </svg>
  );
}

export function ChewIcon() {
  return (
    <svg viewBox="0 0 60 60" aria-hidden>
      <rect x="10" y="24" width="40" height="13" rx="6.5" fill="#f2cd8e" transform="rotate(-20 30 30)" />
      <path d="M18 31 v6 M25 28 v6" stroke="#d9a85c" strokeWidth="2" strokeLinecap="round" transform="rotate(-20 30 30)" />
    </svg>
  );
}
