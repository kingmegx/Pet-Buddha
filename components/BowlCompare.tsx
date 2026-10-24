"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Bowl, ProblemId } from "@/lib/content";
import { COMPARE } from "@/lib/plan";
import { Sticker, type StickerKind } from "./Stickers";

// The opening of the Food tab: the bowl they feed now beside a fresh one,
// drawn in the same line-art style as the stickers, then one difference per
// row. Tap a row to see why it matters. Rows that touch a problem the owner
// ticked are marked for their dog.

type Fill = "kibble" | "home" | "fresh";

const INK = "#211e1c";

function BowlArt({ fill }: { fill: Fill }) {
  return (
    <svg viewBox="0 0 160 110" className="bc-bowl" aria-hidden>
      {/* What's in it, peeking over the rim. */}
      {fill === "kibble" && (
        <g stroke={INK} strokeWidth="2">
          {[
            [44, 40], [60, 34], [76, 30], [92, 31], [108, 36], [120, 43],
            [52, 50], [68, 44], [84, 42], [100, 44], [114, 52], [36, 50],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="8" fill={i % 3 ? "#b5763a" : "#c98b4a"} />
          ))}
        </g>
      )}
      {fill === "home" && (
        <g stroke={INK} strokeWidth="2">
          <path d="M34 50c8-18 30-22 46-20 18-4 40 2 46 20Z" fill="#fbf6ef" />
          <path d="M84 46c4-12 22-14 32-8 6 4 6 10 2 12Z" fill="#f2c14e" />
          {[[48, 40], [58, 36], [66, 42], [74, 35], [54, 46]].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="4" ry="2" fill="#fff" transform={`rotate(${i * 35} ${x} ${y})`} />
          ))}
        </g>
      )}
      {fill === "fresh" && (
        <g stroke={INK} strokeWidth="2" strokeLinejoin="round">
          {/* Meat, greens, egg, carrot and a few berries, heaped up. */}
          <path d="M30 50c0-12 12-18 24-16 8 2 12 8 10 16Z" fill="#d9654f" />
          <path d="M60 48c-2-14 12-22 26-18 8 3 8 12 4 18Z" fill="#c4553f" />
          <path d="M84 46c-4-18 8-28 22-26-2 14-10 24-22 26Z" fill="#7fb069" />
          <path d="M100 48c8-14 22-16 30-6-6 8-18 10-30 6Z" fill="#6aa15a" />
          <ellipse cx="112" cy="40" rx="12" ry="9" fill="#fff" />
          <circle cx="112" cy="40" r="4.5" fill="#f2b33d" />
          <circle cx="46" cy="32" r="7" fill="#f08a3c" />
          <circle cx="76" cy="28" r="5" fill="#f08a3c" />
          <circle cx="94" cy="34" r="4" fill="#4b5fb0" />
          <circle cx="126" cy="46" r="4" fill="#4b5fb0" />
        </g>
      )}
      {/* The bowl. */}
      <path d="M20 50h120c0 30-26 46-60 46S20 80 20 50Z" fill="#fbe0d2" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M20 50h120" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function BowlCompare({ bowl, needs, who }: { bowl: Bowl | null; needs: ProblemId[]; who: string }) {
  const c = COMPARE[bowl ?? "kibble"];
  // A vegetarian or home-cooked meat bowl looks like the rice bowl; raw like the fresh one.
  const nowFill: Fill = bowl === "veg" || bowl === "meat" ? "home" : bowl === "raw" ? "fresh" : "kibble";
  const mine = (r: { for?: ProblemId[] }) => !!r.for?.some((p) => needs.includes(p));
  const first = Math.max(0, c.rows.findIndex(mine));
  const [open, setOpen] = useState<number | null>(first);

  return (
    <div className="bc">
      <div className="bc-head">
        <div className="bc-side">
          <BowlArt fill={nowFill} />
          <span className="bc-label">{c.now}</span>
        </div>
        <svg className="bc-arrow" viewBox="0 0 80 40" aria-hidden>
          <path d="M6 26C22 6 50 6 70 20" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M58 18l13 3-4-12" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="bc-side is-fresh">
          <BowlArt fill="fresh" />
          <span className="bc-label">{c.fresh}</span>
        </div>
      </div>

      {c.note && <p className="bc-note">{c.note}</p>}

      <ol className="bc-rows">
        {c.rows.map((r, i) => {
          const on = open === i;
          return (
            <li key={r.topic} className={`${on ? "is-open" : ""} ${mine(r) ? "is-mine" : ""}`}>
              <button className="bc-row" onClick={() => setOpen(on ? null : i)} aria-expanded={on}>
                <span className="bc-topic">
                  <span className="bc-sticker">
                    <Sticker kind={r.sticker as StickerKind} tone="#fff" ink={INK} />
                  </span>
                  {r.topic}
                  {mine(r) && <span className="bc-mine">matters for {who}</span>}
                </span>
                <span className="bc-now">{r.now}</span>
                <span className="bc-to" aria-hidden>
                  →
                </span>
                <span className="bc-fresh">{r.fresh}</span>
                <span className="tl-plus" aria-hidden />
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                    <p className="bc-why">
                      <strong>Why it matters.</strong> {r.why}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
      <p className="bc-src">From The Forever Dog by Rodney Habib and Dr. Karen Becker.</p>
    </div>
  );
}
