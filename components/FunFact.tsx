"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FUN_FACTS } from "@/lib/content";

// The landing's "did you know?" section body: one big fact at a time. A new
// fact comes in every ten seconds (a thin line fills as the next one
// approaches), and the arrow shows the next one straight away. Styles: ".fact".
export function FunFact() {
  const [at, setAt] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setAt((n) => (n + 1) % FUN_FACTS.length), 10000);
    return () => window.clearTimeout(timer);
  }, [at]);

  return (
    <div className="fact">
      <p aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.span key={at} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {FUN_FACTS[at]}
          </motion.span>
        </AnimatePresence>
      </p>
      <div className="fact-foot">
        <span className="fact-count">
          {String(at + 1).padStart(2, "0")} / {String(FUN_FACTS.length).padStart(2, "0")}
        </span>
        <i key={at} className="fact-timer" aria-hidden />
        <button className="fact-next" onClick={() => setAt((n) => (n + 1) % FUN_FACTS.length)} aria-label="Next fact">
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden>
            <path d="M4 10h12M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
