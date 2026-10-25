"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { FUN_FACTS } from "@/lib/content";
import { Face } from "./Faces";
import { Sticker, type StickerKind } from "./Stickers";

// The landing below the first screen, after truus.co:
//   1. "every dog is different": a huge line that slides sideways as you
//      scroll while the section is pinned. Each letter waits off to the
//      right, scattered and tilted, and drops into line as it reaches the
//      middle of the screen. Stickers ride on the words.
//   2. "why pet buddha": the three reasons as tilted cards, with stickers.
//   3. "did you know?": a blob with a fanned stack of fact cards that shuffle.
//   4. A closing call to action.
// The landing scrolls inside its own sheet, so `scroller` is passed in.

const SENTENCE = "every dog is different";

// A fixed scatter per letter (not random, so the server and browser agree):
// how far up or down, as a share of the letter's height, and how tilted.
function scatter(i: number) {
  const r = Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
  const sign = i % 2 ? 1 : -1;
  return { y: Math.round(sign * (40 + r * 150)), rot: Math.round((r - 0.5) * 50) };
}

// Stickers that sit on a letter (key = the letter's index in the sentence).
type OnLetter = { face?: "beagle" | "indie"; kind?: StickerKind; tone: string; ink?: string; tilt: number; up: boolean };
const ON_LETTER: Record<number, OnLetter> = {
  1: { kind: "heart", tone: "#f6c9d8", ink: "#7c2d4a", tilt: -10, up: true },
  7: { face: "beagle", tone: "#e6f5c9", tilt: -12, up: true },
  11: { kind: "bone", tone: "#fde3b0", ink: "#6b3a12", tilt: 14, up: true },
  15: { kind: "paw", tone: "#d8e3ff", ink: "#23356b", tilt: -8, up: true },
  19: { face: "indie", tone: "#e4ddf1", tilt: 9, up: true },
};

function ScatterWords({ scroller }: { scroller: React.RefObject<HTMLElement | null> }) {
  const section = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  // Measured once (and again on resize), never during the animation: reading
  // layout while moving things makes the browser redo the page every frame.
  const metrics = useRef<{ vw: number; width: number; centres: number[] } | null>(null);
  const frame = useRef(0);
  const chars = [...SENTENCE];
  const seeds = useMemo(() => chars.map((_, i) => scatter(i)), [chars.length]); // eslint-disable-line react-hooks/exhaustive-deps
  // Starts as soon as the line scrolls into view (section top at 75% of the
  // screen), not once the section reaches the top, so nothing waits off-screen.
  const { scrollYProgress: raw } = useScroll({ container: scroller, target: section, offset: ["start 0.75", "end end"] });
  // Smoothed, so the line glides with the wheel or trackpad.
  const progress = useSpring(raw, { stiffness: 140, damping: 30, mass: 0.5, restDelta: 0.0002 });

  const measure = () => {
    const el = line.current;
    if (!el) return;
    metrics.current = {
      vw: el.parentElement?.clientWidth ?? window.innerWidth,
      width: el.scrollWidth,
      centres: letters.current.map((l) => (l ? l.offsetLeft + l.offsetWidth / 2 : 0)),
    };
  };

  // Writes only: the line's position and each letter's offset and tilt.
  const place = (p: number) => {
    const el = line.current;
    const m = metrics.current;
    if (!el || !m) return;
    const from = m.vw * 0.55;
    const to = m.vw * 0.62 - m.width;
    const x = from + (to - from) * Math.min(1, Math.max(0, p / 0.92));
    el.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
    letters.current.forEach((l, i) => {
      if (!l) return;
      const centre = x + m.centres[i];
      // Fully scattered near the right edge, in line by the middle.
      const s = Math.min(1, Math.max(0, (m.vw * 0.98 - centre) / (m.vw * 0.42)));
      // Ease out with a touch of overshoot, so each letter lands softly.
      const e = s === 1 ? 1 : 1 + 2.2 * Math.pow(s - 1, 3) + 1.2 * Math.pow(s - 1, 2);
      const k = 1 - Math.min(1.06, e);
      l.style.transform = Math.abs(k) < 0.002 ? "translate3d(0,0,0)" : `translate3d(0, ${(k * seeds[i].y).toFixed(2)}%, 0) rotate(${(k * seeds[i].rot).toFixed(2)}deg)`;
      const set = k < 0.15;
      if (l.dataset.set !== String(set)) {
        l.dataset.set = String(set);
        l.classList.toggle("is-set", set);
      }
    });
  };

  useMotionValueEvent(progress, "change", (p) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => place(p));
  });

  useEffect(() => {
    const refresh = () => {
      measure();
      place(progress.get());
    };
    refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("resize", refresh);
    return () => {
      window.removeEventListener("resize", refresh);
      cancelAnimationFrame(frame.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section ref={section} className="sw" aria-label={SENTENCE}>
      <div className="sw-pin">
        <div ref={line} className="sw-line" aria-hidden>
          {chars.map((ch, i) => {
            const st = ON_LETTER[i];
            return (
              <span key={i} className={ch === " " ? "sw-space" : "sw-letter"} ref={(n) => void (letters.current[i] = n)}>
                {ch === " " ? " " : ch}
                {st && (
                  <span className={`sw-sticker ${st.up ? "is-up" : "is-down"}`} style={{ "--tilt": `${st.tilt}deg` } as React.CSSProperties}>
                    {st.face ? (
                      <span className="face-sticker" style={{ background: st.tone }}>
                        <Face id={st.face} />
                      </span>
                    ) : (
                      <Sticker kind={st.kind!} tone={st.tone} ink={st.ink} />
                    )}
                  </span>
                )}
              </span>
            );
          })}
        </div>
        <p className="sw-sub">
          So their plan should be too. Pet Buddha looks at <em>your</em> dog&apos;s breed, age, weight, habits and food before suggesting anything.
        </p>
      </div>
    </section>
  );
}

// A hand-drawn underline with a little loop, like truus's under "from TV to TikTok".
export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg className={`squiggle ${className}`} viewBox="0 0 600 50" preserveAspectRatio="none" aria-hidden>
      <motion.path
        d="M6 42 C120 34 220 20 300 14 C330 12 338 13 322 18 C290 26 236 30 246 36 C270 44 420 30 590 34"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.9, ease: "easeInOut", delay: 0.2 }}
      />
    </svg>
  );
}

// What a plan actually holds, said plainly. Laid out like truus's "call us if
// you need" hand of cards: a coloured card per area, a sticker on top, a rule
// and a short list of the concrete things inside.
const CARDS: { t: string; items: string[]; kind: StickerKind; tone: string; tilt: number }[] = [
  { t: "a plan for your pup", items: ["8 quick questions", "Built around breed, age and size", "No sign-up needed"], kind: "paw", tone: "green", tilt: -4 },
  { t: "food, sorted", items: ["Fresh-food steps, vet-backed", "Their daily calories, worked out", "Bowl balancing, coming soon"], kind: "bowl", tone: "blue", tilt: 3 },
  { t: "better behaviour", items: ["Chewing and biting, redirected", "Potty training made paw-sible", "Kind methods only"], kind: "bone", tone: "orange", tilt: -2 },
  { t: "india's experts", items: ["Top Indian nutritionists and vets", "Every tip credited", "Book them in a tap"], kind: "heart", tone: "plum", tilt: 4 },
  { t: "pawsome finds", items: ["Sniff mats, puzzles and chews", "From Indian stores", "Only what suits your dog"], kind: "ball", tone: "lilac", tilt: -3 },
];

// Text and picture stickers scattered around the cards.
const AROUND: { text?: string; kind?: StickerKind; tone: string; ink?: string; tilt: number; pos: React.CSSProperties }[] = [
  { text: "sniffing > zoomies", tone: "lime", tilt: -6, pos: { top: "9%", left: "6%" } },
  { kind: "ball", tone: "#e6f5c9", ink: "#3d5a12", tilt: 12, pos: { top: "7%", right: "10%" } },
  { text: "no two noses alike", tone: "coral", tilt: 5, pos: { top: "16%", right: "4%" } },
  { kind: "leaf", tone: "#d6eadf", ink: "#1f5c43", tilt: -10, pos: { bottom: "10%", left: "4%" } },
  { text: "chew on purpose", tone: "lilac", tilt: -4, pos: { bottom: "7%", left: "14%" } },
  { kind: "sparkle", tone: "#fde3b0", ink: "#6b3a12", tilt: 8, pos: { bottom: "14%", right: "6%" } },
  { text: "calm > tired", tone: "sun", tilt: 7, pos: { bottom: "7%", right: "14%" } },
];

// The hand of cards. Fanned and overlapping at rest; the card under the
// pointer straightens and lifts, and the others slide aside to make room.
// On narrow screens they simply stack.
const STICKER_TONES: Record<string, { tone: string; ink: string }> = {
  green: { tone: "#e6f5c9", ink: "#1f5c43" },
  blue: { tone: "#fde3b0", ink: "#3a3f8f" },
  orange: { tone: "#c9d3ff", ink: "#b2431c" },
  plum: { tone: "#fbe0d2", ink: "#7c2d4a" },
  lilac: { tone: "#ffffff", ink: "#7c2d4a" },
};

function CardHand() {
  const [hot, setHot] = useState<number | null>(null);
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const n = CARDS.length;
  return (
    <ul className="hand-row" onPointerLeave={() => setHot(null)}>
      {CARDS.map((c, i) => {
        // Spread from the centre; neighbours of the hovered card move away.
        const base = (i - (n - 1) / 2) * 196;
        const push = hot === null || i === hot ? 0 : i < hot ? -70 : 70;
        const pose = wide
          ? { x: base + push, y: hot === i ? -16 : i % 2 ? 22 : 0, rotate: hot === i ? 0 : c.tilt }
          : { x: 0, y: 0, rotate: c.tilt / 2 };
        const tones = STICKER_TONES[c.tone];
        return (
          <motion.li
            key={c.t}
            className={`hand-card hc-${c.tone}`}
            style={{ zIndex: hot === i ? 10 : i + 1 }}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            animate={pose}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            onPointerEnter={() => setHot(i)}
          >
            <span className="hc-sticker">
              <Sticker kind={c.kind} tone={tones.tone} ink={tones.ink} />
            </span>
            <strong>{c.t}</strong>
            <svg className="hc-rule" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden>
              <path d="M1 5 C60 3.5 140 6 192 4.6 M186 1.4 L194 4.6 L186 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <ul>
              {c.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </motion.li>
        );
      })}
    </ul>
  );
}

function ReasonCards() {
  return (
    <section className="rc">
      {AROUND.map((s, i) => (
        <motion.span
          key={i}
          className={s.text ? `text-sticker ts-${s.tone}` : "around-sticker"}
          style={{ ...s.pos, rotate: s.tilt }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: i * 0.05 }}
        >
          {s.text ?? <Sticker kind={s.kind!} tone={s.tone} ink={s.ink} />}
        </motion.span>
      ))}
      <div className="rc-head">
        <h2 className="rc-title">
          why <em>pet buddha</em>
        </h2>
        <Squiggle />
      </div>
      <CardHand />
    </section>
  );
}

// "did you know?": a fan of tall fact cards, like truus's work carousel. The
// card in the middle stands up straight, fact side out; as a card moves off
// to the side it flips over to its picture side and leans out behind. The blue blob sits behind the fan. It moves
// on every few seconds, or straight away on a click; hovering holds it.
const FACT_LOOK: { label: string; kind: StickerKind; bg: string; tone: string; ink: string }[] = [
  { label: "nose facts", kind: "nose", bg: "#2e6a4c", tone: "#e6f5c9", ink: "#1f5c43" },
  { label: "nose facts", kind: "sparkle", bg: "#ee6a3c", tone: "#fde3b0", ink: "#b2431c" },
  { label: "paw facts", kind: "paw", bg: "#8e2f50", tone: "#fbe0d2", ink: "#7c2d4a" },
  { label: "puppy facts", kind: "heart", bg: "#e9b9f4", tone: "#ffffff", ink: "#7c2d4a" },
  { label: "ear facts", kind: "ball", bg: "#2e6a4c", tone: "#fde3b0", ink: "#1f5c43" },
  { label: "sleep facts", kind: "leaf", bg: "#ee6a3c", tone: "#e6f5c9", ink: "#1f5c43" },
  { label: "eye facts", kind: "bone", bg: "#8e2f50", tone: "#e9b9f4", ink: "#7c2d4a" },
];

function DidYouKnow() {
  const n = FUN_FACTS.length;
  const [top, setTop] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (held) return;
    const t = window.setTimeout(() => setTop((v) => (v + 1) % n), 4000);
    return () => window.clearTimeout(t);
  }, [top, held, n]);

  return (
    <section className="dyk">
      <div className="dyk-head">
        <h2>
          did you <em>know?</em>
        </h2>
        <Squiggle className="is-short" />
      </div>
      <div className="dyk-fan" onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}>
        <svg className="dyk-blob" viewBox="0 0 400 400" aria-hidden>
          <path d="M210 20c40 2 54 50 40 92 30-30 84-32 98 4 14 36-22 64-62 70 40 10 70 44 54 78-16 34-62 30-92 6 6 44-18 98-58 92-40-6-44-60-28-96-34 26-90 26-100-12-10-36 32-60 72-64-40-14-70-52-50-84 20-30 64-20 90 10-10-44 0-98 36-96Z" fill="#8aa4ff" />
        </svg>
        <svg className="dyk-doodle" viewBox="0 0 120 160" aria-hidden>
          <path d="M14 70c18 6 30 22 30 44s-8 32-16 40M30 74c10-40 34-60 60-58 14 1 22 10 22 18" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
        {FUN_FACTS.map((_, i) => {
          // Distance from the middle card, wrapped so the fan loops.
          let d = (i - top + n) % n;
          if (d > n / 2) d -= n;
          const far = Math.abs(d);
          const look = FACT_LOOK[i % FACT_LOOK.length];
          return (
            <motion.button
              key={i}
              className="dyk-card"
              data-tone={look.bg}
              style={{ zIndex: 10 - far, pointerEvents: far > 2 ? "none" : "auto" }}
              initial={false}
              animate={{
                x: Math.sign(d) * [0, 150, 260, 330][Math.min(far, 3)],
                y: far * 18,
                rotate: d * 8,
                scale: 1 - Math.min(far, 3) * 0.1,
                opacity: far > 2 ? 0 : 1,
              }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              onClick={() => setTop(d === 0 ? (top + 1) % n : i)}
              aria-label={d === 0 ? "Show another fact" : `Show the ${look.label} card`}
              tabIndex={far > 1 ? -1 : 0}
            >
              <motion.span
                className="dyk-flip"
                initial={false}
                animate={{ rotateY: d === 0 ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 110, damping: 18 }}
                style={{ transformPerspective: 1200 }}
              >
                <span className="dyk-face dyk-front" style={{ background: look.bg }} aria-hidden={d !== 0}>
                  <span className="dyk-mini">
                    <Sticker kind={look.kind} tone={look.tone} ink={look.ink} />
                  </span>
                  <span className="dyk-fact">{FUN_FACTS[i]}</span>
                </span>
                <span className="dyk-face dyk-back" style={{ background: look.bg }} aria-hidden>
                  <span className="dyk-art">
                    <Sticker kind={look.kind} tone={look.tone} ink={look.ink} />
                  </span>
                </span>
              </motion.span>
              <span className="dyk-label">{look.label}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

export function LandingMore({ scroller, onStart }: { scroller: React.RefObject<HTMLElement | null>; onStart: () => void }) {
  return (
    <>
      <ScatterWords scroller={scroller} />
      <ReasonCards />
      <DidYouKnow />
      <section className="l-end">
        <h2>
          ready when <em>you</em> are.
        </h2>
        <button className="pill" onClick={onStart}>
          Personalise my plan <span className="arrow" aria-hidden />
        </button>
        <p className="lede-note">8 short questions · about 2 minutes · no sign-up</p>
      </section>
    </>
  );
}

// Hand-drawn bits around the hero, in the truus way: a little burst of
// lines, a squiggle, a lime star and a blue blob, tucked against the
// corners of the two windows. The lines draw themselves in; the shapes
// drift slowly. Purely decorative.
export function HeroDoodles() {
  const draw = (delay: number) => ({
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 0.8, ease: "easeInOut" as const, delay },
  });
  return (
    <div className="doodles" aria-hidden>
      <svg className="dd dd-burst" viewBox="0 0 60 60">
        <motion.path d="M30 8v14M12 18l9 9M48 18l-9 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...draw(0.6)} />
      </svg>
      <svg className="dd dd-star" viewBox="0 0 100 100">
        <path d="M50 4c4 26 20 42 46 46-26 4-42 20-46 46-4-26-20-42-46-46 26-4 42-20 46-46Z" fill="#f4c56e" />
      </svg>
      <svg className="dd dd-blob" viewBox="0 0 120 120">
        <path d="M64 6c26 2 50 22 50 50s-20 58-52 58S6 96 6 66 34 4 64 6Z" fill="#c3d8d2" />
      </svg>
      <svg className="dd dd-swirl" viewBox="0 0 110 60">
        <motion.path d="M4 40c14-20 30-20 34-6s-14 18-12 4 26-30 44-18 14 30 36 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" {...draw(0.9)} />
      </svg>
      <svg className="dd dd-dots" viewBox="0 0 60 20">
        <circle cx="6" cy="10" r="4" fill="#5e8b84" />
        <circle cx="30" cy="10" r="4" fill="#5e8b84" />
        <circle cx="54" cy="10" r="4" fill="#5e8b84" />
      </svg>
    </div>
  );
}
