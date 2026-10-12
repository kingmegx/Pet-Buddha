"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FUN_FACTS } from "@/lib/content";

// The landing page's fun fact. A new one fades in every ten seconds. Styles: ".fact" in globals.css.
export function FunFact() {
  const [at, setAt] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setAt((n) => (n + 1) % FUN_FACTS.length), 10000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="fact">
      <strong>Fun fact</strong>
      <p aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.span key={at} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
            {FUN_FACTS[at]}
          </motion.span>
        </AnimatePresence>
      </p>
    </div>
  );
}
