"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "motion/react";

// The normal mouse pointer, with one exception: moving onto a pet (anything
// marked data-pat) swaps the pointer for an illustrated hand that pats the pet
// three times, then hands back the normal pointer. Leaving the pet and coming
// back pats again. Things marked data-say show a small note by the pointer.
// Touch devices keep their normal behaviour.
const PATS = 3;
const PAT_MS = 260; // one movement down or up; a pat is two of them

export default function HandCursor() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const [enabled, setEnabled] = useState(false);
  const [patting, setPatting] = useState(false);
  const [say, setSay] = useState("");
  // Keep the last words on the note while it shrinks away.
  const lastSaid = useRef("");
  if (say) lastSaid.current = say;
  // The pet currently under the pointer, so a pat only starts on arrival.
  const over = useRef<Element | null>(null);
  const timer = useRef(0);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    const root = document.documentElement;
    const stop = () => {
      window.clearTimeout(timer.current);
      setPatting(false);
      root.classList.remove("is-patting");
    };
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      setSay(target?.closest?.("[data-say]")?.getAttribute("data-say") ?? "");
      const pet = target?.closest?.("[data-pat]") ?? null;
      if (pet === over.current) return;
      over.current = pet;
      stop();
      if (!pet) return;
      setPatting(true);
      root.classList.add("is-patting");
      timer.current = window.setTimeout(stop, PATS * 2 * PAT_MS + 120);
    };
    window.addEventListener("pointermove", move);
    return () => {
      stop();
      window.removeEventListener("pointermove", move);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div className="hand" style={{ x, y }} aria-hidden>
      <motion.span className="hand-say" initial={false} animate={{ scale: say ? 1 : 0, opacity: say ? 1 : 0 }} transition={{ type: "spring", stiffness: 420, damping: 26 }}>
        {lastSaid.current}
      </motion.span>
      {patting && (
        // Drawn like the system's hand pointer: the same size, a white hand
        // with a thin black outline, open to pat.
        <svg className="hand-icon" width="24" height="26" viewBox="0 0 24 26" style={{ "--pat": `${PAT_MS}ms`, "--pats": PATS * 2 } as React.CSSProperties}>
          <path
            d="M8.2 12.4V4.2a1.6 1.6 0 0 1 3.2 0v6.6V2.9a1.6 1.6 0 0 1 3.2 0v7.9V3.9a1.6 1.6 0 0 1 3.2 0v7.4V6.4a1.6 1.6 0 0 1 3.2 0v9.4c0 5-3.3 8.7-8 8.7h-.9c-2.8 0-4.6-1.2-6.2-3.5L1.6 15.6a1.7 1.7 0 0 1 2.6-2.1l4 3.2Z"
            fill="#fff"
            stroke="#111"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </motion.div>
  );
}
