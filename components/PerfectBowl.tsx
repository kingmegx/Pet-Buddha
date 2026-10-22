"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { PERFECT_BOWL } from "@/lib/plan";

// The perfect bowl, seen from above: a bowl split into what goes in it, by
// rough share. Hover or tap a part in the list and its slice lifts out while
// the rest fade. Drawn in the same flat, ink-outlined style as the stickers.

const INK = "#211e1c";
const R = 104; // radius of the food inside the rim
const C = 140; // centre

function slice(from: number, to: number, r: number) {
  // Angles in turns (0..1), starting at the top, going clockwise.
  const a0 = from * Math.PI * 2 - Math.PI / 2;
  const a1 = to * Math.PI * 2 - Math.PI / 2;
  const large = to - from > 0.5 ? 1 : 0;
  const x0 = C + r * Math.cos(a0);
  const y0 = C + r * Math.sin(a0);
  const x1 = C + r * Math.cos(a1);
  const y1 = C + r * Math.sin(a1);
  return `M ${C} ${C} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
}

export function PerfectBowl() {
  const [on, setOn] = useState<string | null>(null);
  let at = 0;
  const parts = PERFECT_BOWL.map((p) => {
    const from = at / 100;
    at += p.share;
    const to = at / 100;
    const mid = ((from + to) / 2) * Math.PI * 2 - Math.PI / 2;
    return { ...p, from, to, dx: Math.cos(mid) * 10, dy: Math.sin(mid) * 10 };
  });

  return (
    <div className="pb">
      <svg className="pb-art" viewBox="0 0 280 280" aria-hidden>
        {/* The bowl, from above. */}
        <circle cx={C} cy={C} r="132" fill="#fbe0d2" stroke={INK} strokeWidth="3" />
        <circle cx={C} cy={C} r={R + 6} fill="#fff" stroke={INK} strokeWidth="2" />
        {parts.map((p) => (
          <motion.path
            key={p.id}
            d={slice(p.from, p.to, R)}
            fill={p.color}
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
            initial={false}
            animate={{ x: on === p.id ? p.dx : 0, y: on === p.id ? p.dy : 0, opacity: on && on !== p.id ? 0.35 : 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          />
        ))}
        {/* A little texture: marbling on the meat, seeds on the greens. */}
        <g fill="none" stroke="#fbf6ef" strokeWidth="2" strokeLinecap="round" opacity="0.8" pointerEvents="none">
          <path d="M180 92c10 4 16 12 18 22M196 150c-6 8-16 12-26 12M170 190c4 6 4 12 0 18" />
        </g>
        <g fill={INK} pointerEvents="none" opacity={on && on !== "veg" ? 0.35 : 1}>
          <circle cx="64" cy="132" r="2.2" />
          <circle cx="74" cy="112" r="2.2" />
          <circle cx="60" cy="98" r="2.2" />
        </g>
      </svg>

      <ul className="pb-list">
        {parts.map((p) => (
          <li key={p.id}>
            <button
              className={on === p.id ? "is-on" : ""}
              onPointerEnter={() => setOn(p.id)}
              onPointerLeave={() => setOn(null)}
              onFocus={() => setOn(p.id)}
              onBlur={() => setOn(null)}
              onClick={() => setOn(on === p.id ? null : p.id)}
            >
              <span className="pb-dot" style={{ background: p.color }} />
              <span className="pb-name">
                <strong>{p.label}</strong>
                <span>{p.line}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
