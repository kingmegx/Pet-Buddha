"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

// The illustrated hand that replaces the mouse pointer. It points by default
// and opens into a patting palm over anything marked data-pat (the pets).
// Touch devices keep their normal behaviour.
export default function HandCursor() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 700, damping: 45, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 700, damping: 45, mass: 0.35 });
  const [enabled, setEnabled] = useState(false);
  const [pat, setPat] = useState(false);
  const [down, setDown] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-hand");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setSeen(true);
      setPat(!!(e.target as Element | null)?.closest?.("[data-pat]"));
    };
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      document.documentElement.classList.remove("has-hand");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div className="hand" style={{ x: sx, y: sy, opacity: seen ? 1 : 0 }} aria-hidden>
      <motion.svg
        width="110"
        height="140"
        viewBox="0 0 110 140"
        animate={{ scale: down ? 0.88 : 1, rotate: down ? -6 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        style={{ transformOrigin: "29px 8px" }}
      >
        <g transform="rotate(-28 29 8)" className={pat ? "hand-pat" : undefined}>
          <rect x="26" y="108" width="52" height="1400" rx="22" fill="#f7b2ac" />
          <ellipse cx="12" cy="92" rx="10" ry="22" transform="rotate(-22 12 92)" fill="#f7b2ac" />
          <rect x="12" y="60" width="76" height="68" rx="28" fill="#f7b2ac" />
          <rect x="18" y="4" width="22" height="80" rx="11" fill="#f7b2ac" />
          {pat ? (
            <>
              <rect x="40" y="0" width="19" height="84" rx="9.5" fill="#f7b2ac" />
              <rect x="59" y="6" width="18" height="80" rx="9" fill="#f7b2ac" />
              <rect x="76" y="20" width="15" height="68" rx="7.5" fill="#f7b2ac" />
              <path d="M40 30 v44 M59 30 v46 M76 36 v42" stroke="#211e1c" strokeWidth="1.6" strokeLinecap="round" />
            </>
          ) : (
            <>
              <rect x="40" y="54" width="17" height="36" rx="8.5" fill="#f7b2ac" />
              <rect x="57" y="58" width="17" height="34" rx="8.5" fill="#f7b2ac" />
              <rect x="73" y="64" width="15" height="30" rx="7.5" fill="#f7b2ac" />
              <path d="M40 62 v22 M57 64 v24 M73 68 v22" stroke="#211e1c" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M23 16 q6 -6 12 0" fill="none" stroke="#211e1c" strokeWidth="1.6" strokeLinecap="round" />
            </>
          )}
        </g>
      </motion.svg>
    </motion.div>
  );
}
