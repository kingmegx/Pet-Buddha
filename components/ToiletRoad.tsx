"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Face } from "./Faces";
import { Sticker, type StickerKind } from "./Stickers";

// The toilet guide as a little journey: a winding road across the page with
// a stop for each step. The dog's own face walks along the road to the step
// you pick, and the card underneath tells you what to do there.
// Drawn on a 1000 x 250 grid; stops alternate high and low.

type Look = { kind: StickerKind; tone: string; ink: string };

const W = 1000;
const H = 250;
const BADGES = ["#ee6a3c", "#2e6a4c", "#8c9cf5", "#e2a33b", "#8e2f50"];

function stopsFor(n: number) {
  const pad = n === 5 ? 90 : 120;
  return Array.from({ length: n }, (_, i) => ({
    x: pad + (i * (W - pad * 2)) / (n - 1),
    y: i % 2 === 0 ? 178 : 72,
  }));
}

// A smooth road through every stop, starting off the left edge and running
// off the right one.
function roadThrough(pts: { x: number; y: number }[]) {
  const first = pts[0];
  const last = pts[pts.length - 1];
  let d = `M ${first.x - 90} ${first.y + 40} C ${first.x - 50} ${first.y + 30} ${first.x - 60} ${first.y} ${first.x} ${first.y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const k = (b.x - a.x) * 0.5;
    d += ` C ${a.x + k} ${a.y} ${b.x - k} ${b.y} ${b.x} ${b.y}`;
  }
  d += ` C ${last.x + 50} ${last.y} ${last.x + 60} ${last.y - 30} ${last.x + 90} ${last.y - 40}`;
  return d;
}

export function ToiletRoad({ titles, steps, looks, face, word }: { titles: string[]; steps: string[]; looks: Look[]; face: string; word: (s: string) => string }) {
  const pts = stopsFor(steps.length);
  const d = roadThrough(pts);
  const road = useRef<SVGPathElement>(null);
  const [at, setAt] = useState(0);
  const [pos, setPos] = useState(pts[0]);
  // Where along the road each stop sits, found once the road is drawn.
  const lengths = useRef<number[]>([]);
  const now = useRef(0);

  useLayoutEffect(() => {
    const p = road.current;
    if (!p) return;
    const total = p.getTotalLength();
    lengths.current = pts.map((s) => {
      let best = 0;
      let bestD = Infinity;
      for (let l = 0; l <= total; l += 2) {
        const q = p.getPointAtLength(l);
        const dd = (q.x - s.x) ** 2 + (q.y - s.y) ** 2;
        if (dd < bestD) {
          bestD = dd;
          best = l;
        }
      }
      return best;
    });
    now.current = lengths.current[0];
    setAt(0);
    setPos(pts[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d]);

  // Walk the dog along the road to the chosen stop.
  useEffect(() => {
    const p = road.current;
    const to = lengths.current[at];
    if (!p || to === undefined) return;
    const from = now.current;
    const start = performance.now();
    const ms = Math.min(1400, 350 + Math.abs(to - from) * 1.6);
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      const l = from + (to - from) * e;
      now.current = l;
      const q = p.getPointAtLength(l);
      setPos({ x: q.x, y: q.y });
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [at]);

  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  return (
    <div className="road">
      <motion.div className="road-map" initial="hide" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <motion.svg
          className="road-svg"
          viewBox={`0 0 ${W} ${H}`}
          aria-hidden
          variants={{ hide: { clipPath: "inset(0 100% 0 0)" }, show: { clipPath: "inset(0 0% 0 0)", transition: { duration: 1.4, ease: "easeInOut" } } }}
        >
          <path ref={road} d={d} fill="none" stroke="#2e6a4c" strokeWidth="26" strokeLinecap="round" />
          <path d={d} fill="none" stroke="#fbf6ef" strokeWidth="3" strokeLinecap="round" strokeDasharray="14 12" />
        </motion.svg>

        {pts.map((s, i) => {
          const low = s.y > H / 2;
          const look = looks[i % looks.length];
          return (
            <button
              key={titles[i]}
              className={`road-stop ${low ? "is-low" : "is-high"} ${i === at ? "is-on" : ""} ${i < at ? "is-done" : ""}`}
              style={{ left: pct(s.x, W), top: pct(s.y, H) }}
              onClick={() => setAt(i)}
              aria-label={`Step ${i + 1}: ${titles[i]}`}
              aria-pressed={i === at}
            >
              <span className="road-art">
                <Sticker kind={look.kind} tone={look.tone} ink={look.ink} />
                <span className="road-badge" style={{ background: BADGES[i % BADGES.length] }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="road-title">{word(titles[i])}</span>
            </button>
          );
        })}

        {/* The dog, walking the road. */}
        <span className="road-dog" style={{ left: pct(pos.x, W), top: pct(pos.y, H) }} aria-hidden>
          <Face id={face as never} />
        </span>
      </motion.div>

      <div className="road-card">
        <AnimatePresence mode="wait">
          <motion.div key={at} className="road-card-body" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
            <span className="road-card-num" style={{ background: BADGES[at % BADGES.length] }}>
              step {at + 1} of {steps.length}
            </span>
            <strong>{word(titles[at])}</strong>
            <p>{word(steps[at])}</p>
          </motion.div>
        </AnimatePresence>
        <div className="road-nav">
          <button className="road-prev" onClick={() => setAt((v) => Math.max(0, v - 1))} disabled={at === 0}>
            ← Back
          </button>
          <button className="pill" onClick={() => setAt((v) => Math.min(steps.length - 1, v + 1))} disabled={at === steps.length - 1}>
            {at === steps.length - 1 ? "That's it" : "Next step"} <span className="arrow" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
