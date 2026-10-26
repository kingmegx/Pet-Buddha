"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { dailyCalories, puppyCalories } from "@/lib/plan";
import { DietChart } from "./DietChart";
import type { Preset } from "./BalanceBowl";

// Is this dog a healthy weight? A body condition check on the usual 1 to 9
// scale (5 is ideal), in five quick looks and feels, one at a time. Each
// answer is a score; the result is their average. Above 5, each point is
// about 10% extra body weight, which gives a target weight, the calories to
// feed for it, and a diet chart sized to it. Not a vet's diagnosis.

// Which drawing each question shows: the dog from the side or from above,
// and what to mark on it.
type View = "ribs" | "above" | "side" | "spine" | "tail";
type Q = { title: string; how: string; view: View; options: [string, number][] };

const INK = "#211e1c";

// A smooth closed outline through points (Catmull-Rom turned into curves).
function smooth(pts: [number, number][]) {
  const n = pts.length;
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d + "Z";
}

// A small line drawing of the dog at a body shape from 0 (very thin) to 4
// (very heavy), in the sticker style: one ink line, one soft fill.
function Figure({ view, f, on }: { view: View; f: number; on: boolean }) {
  const fill = on ? "#fbf6ef" : "#f3c9a8";
  const bones = [1, 0.75, 0.35, 0.1, 0][f];
  if (view === "above" || view === "spine") {
    const w = [5, 8.5, 11, 14, 17.5][f]; // half-width at the waist
    const c = 13 + f * 1.6; // chest
    const h = 11 + f * 1.8; // hips
    const body = smooth([
      [20, 30], [26, 30 - h], [50, 30 - w], [74, 30 - c], [88, 30 - 7], [92, 30],
      [88, 30 + 7], [74, 30 + c], [50, 30 + w], [26, 30 + h],
    ]);
    return (
      <svg viewBox="0 0 120 60" className="bc-fig" aria-hidden>
        <path d="M21 30 C14 30 10 26 6 22" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        <path d={body} fill={fill} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
        <ellipse cx="95" cy="21.5" rx="5" ry="3" transform="rotate(-20 95 21.5)" fill="#d9a27c" stroke={INK} strokeWidth="2" />
        <ellipse cx="95" cy="38.5" rx="5" ry="3" transform="rotate(20 95 38.5)" fill="#d9a27c" stroke={INK} strokeWidth="2" />
        <path d="M90 30 C90 23 97 21 104 24 L114 28 Q116.5 30 114 32 L104 36 C97 39 90 37 90 30Z" fill={fill} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="115" cy="30" r="1.6" fill={INK} />
        {view === "spine" && bones > 0 && (
          <g fill={INK} opacity={bones}>
            {[30, 40, 50, 60, 70, 80].map((x) => (
              <circle key={x} cx={x} cy="30" r="1.6" />
            ))}
            <path d="M28 22 q-3 8 0 16" fill="none" stroke={INK} strokeWidth="1.6" />
          </g>
        )}
      </svg>
    );
  }
  // From the side: back line, chest, and the line of the tummy.
  const back = 20 - f * 0.6;
  const chest = 40 + f * 1.5;
  const tuck = [29, 32, 35, 40, 47][f]; // tummy height under the waist
  const hip = 36 + f * 0.8;
  const body = smooth([
    [22, back + 2], [50, back - 0.5], [80, back], [90, back + 4], [92, chest - 6],
    [84, chest], [62, tuck + (chest - tuck) * 0.3], [48, tuck], [30, hip], [20, back + 9],
  ]);
  return (
    <svg viewBox="0 0 120 64" className="bc-fig" aria-hidden>
      <path d="M22 22 C16 18 13 12 12 7" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      {[28, 38, 76, 86].map((x, i) => (
        <path key={x} d={`M${x} ${i < 2 ? hip - 4 : chest - 4} L${x - 1} 60 L${x + 2.5} 60`} fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      <path d={body} fill={fill} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <path d={`M87 ${back + 3} C88 ${back - 7} 98 ${back - 10} 104 ${back - 5} L113 ${back - 3} C116.5 ${back - 2} 116.5 ${back + 3} 113 ${back + 4} L102 ${back + 7} C96 ${back + 9} 90 ${back + 9} 88 ${back + 6}`} fill={fill} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <path d={`M96 ${back - 6} C91 ${back - 4} 90 ${back + 3} 93 ${back + 6} C97 ${back + 4} 98 ${back - 1} 96 ${back - 6}Z`} fill="#d9a27c" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="102.5" cy={back - 3} r="1.4" fill={INK} />
      <circle cx="115" cy={back} r="1.6" fill={INK} />
      {view === "ribs" && bones > 0 && (
        <g fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" opacity={bones}>
          {[60, 66, 72, 78].map((x) => (
            <path key={x} d={`M${x} ${back + 4} q-3 ${(chest - back) / 2} 0 ${chest - back - 8}`} />
          ))}
        </g>
      )}
      {view === "tail" && f >= 2 && <ellipse cx="24" cy={back + 3} rx={2 + (f - 2) * 2.2} ry={1.5 + (f - 2) * 1.6} fill={INK} opacity="0.18" />}
      {view === "tail" && f <= 1 && <path d={`M22 ${back + 1} l3 -3 l3 3`} fill="none" stroke={INK} strokeWidth="1.6" opacity={bones} />}
    </svg>
  );
}

const QUESTIONS: Q[] = [
  {
    title: "Feel the ribs",
    view: "ribs",
    how: "Run your flat hands along their sides while they stand.",
    options: [
      ["Sharp and easy to see", 2],
      ["Easy to feel, a very thin layer", 4],
      ["Easy to feel, not seen", 5],
      ["Need a little pressure to feel", 7],
      ["Hard to feel at all", 9],
    ],
  },
  {
    title: "Look from above",
    view: "above",
    how: "Stand over them and look down at the shape behind the ribs.",
    options: [
      ["Very narrow, bones stand out", 2],
      ["A strong, sharp waist", 4],
      ["A clear, gentle waist", 5],
      ["Waist hard to see", 7],
      ["No waist; round or oval", 9],
    ],
  },
  {
    title: "Look from the side",
    view: "side",
    how: "Crouch down and look at the line of the tummy.",
    options: [
      ["Deep tuck, bones showing", 2],
      ["A clear upward tuck", 4],
      ["A gentle tuck behind the ribs", 5],
      ["Tummy fairly straight", 7],
      ["Tummy rounded or hanging", 9],
    ],
  },
  {
    title: "Feel the spine and hips",
    view: "spine",
    how: "Run a hand down their back and over the hip bones.",
    options: [
      ["Bones sharp, little muscle", 2],
      ["Bones easy to feel", 4],
      ["Bones felt under a smooth layer", 5],
      ["Bones hard to find", 7],
      ["Can't feel them for padding", 9],
    ],
  },
  {
    title: "Base of the tail and chest",
    view: "tail",
    how: "Feel where the tail meets the back, and the bone at the front of the chest.",
    options: [
      ["Bones jut out", 2],
      ["Thin covering", 4],
      ["Smooth, bones still there", 5],
      ["Soft padding", 7],
      ["Thick fat pads", 9],
    ],
  },
];

function band(score: number) {
  if (score <= 3) return { label: "Underweight", tone: "is-under" };
  if (score <= 5) return { label: score === 4 ? "Lean and healthy" : "Ideal", tone: "is-ideal" };
  if (score <= 7) return { label: "Carrying extra weight", tone: "is-over" };
  return { label: "Carrying a lot of extra weight", tone: "is-over" };
}

export function BodyCheck({ kg, months, who, onLoad, onExperts }: { kg: number; months: number; who: string; onLoad: (p: Omit<Preset, "key">) => void; onExperts: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [chart, setChart] = useState(false);
  const done = answers.length === QUESTIONS.length;
  const score = done ? Math.round(answers.reduce((a, b) => a + b, 0) / answers.length) : 0;
  const b = band(score);
  // Each point over 5 is about 10% extra; round the target to the half kilo.
  const target = score > 5 ? Math.round((kg / (1 + 0.1 * (score - 5))) * 2) / 2 : kg;
  const now = dailyCalories(kg);
  const aim = dailyCalories(target);
  const weekly = Math.round(kg * 0.01 * 10) / 10;
  // Puppies never diet down to a target: they're fed a little under a
  // growing puppy's need and grow into a leaner shape.
  const puppy = months < 12;
  const pupAim = Math.round((puppyCalories(kg, months) * 0.9) / 10) * 10;

  const pick = (v: number) => {
    const next = [...answers.slice(0, step), v];
    setAnswers(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
  };
  const restart = () => {
    setAnswers([]);
    setStep(0);
    setChart(false);
  };

  if (!done) {
    const q = QUESTIONS[step];
    return (
      <div className="bc-check">
        <div className="bc-progress" aria-hidden>
          {QUESTIONS.map((_, i) => (
            <span key={i} className={i < answers.length ? "is-done" : i === step ? "is-now" : ""} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            <p className="bc-q-num">
              {step + 1} of {QUESTIONS.length}
            </p>
            <h4 className="bc-q">{q.title}</h4>
            <p className="bc-how">{q.how}</p>
            <div className="bc-options">
              {q.options.map(([label, v], i) => (
                <button key={label} className={answers[step] === v ? "is-on" : ""} onClick={() => pick(v)}>
                  <Figure view={q.view} f={i} on={answers[step] === v} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        {step > 0 && (
          <button className="bc-back" onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bc-check">
      <div className={`bc-result ${b.tone}`}>
        <span className="bc-score">
          <strong>{score}</strong>
          <small>/ 9</small>
        </span>
        <span>
          <strong>{b.label}</strong>
          <small>
            {score > 5 && puppy
              ? `A little more padding than ideal. Puppies shouldn't diet: feed ${who} a little less and let them grow into a leaner shape.`
              : score > 5
              ? `About ${Math.round((score - 5) * 10)}% over ${who}'s ideal. A good target is around ${target} kg.`
              : score <= 3
                ? `${who} could do with a little more. Talk to your vet, then feed a little more of a complete, fresh bowl.`
                : `${who} is in good shape. Keep doing what you're doing.`}
          </small>
        </span>
        <button className="bc-retake" onClick={restart}>
          Check again
        </button>
      </div>

      {score > 5 && (
        <>
          <ol className="tc tc-compact">
            {(puppy
              ? [
                  ["Feed a little less, not a diet", `About ${pupAim} calories a day: a tenth under what a growing puppy of ${kg} kg needs.`],
                  ["Weigh the food", "Use a kitchen scale. Cups and handfuls creep up without anyone noticing."],
                  ["Treats count", "Keep treats under a tenth of the day. Use bits of their meal as rewards in training."],
                  ["Play, don't run them hard", "Short games and sniffy walks. Long runs and lots of stairs are hard on growing joints."],
                  ["Check every two weeks", `Weigh ${who} and redo this check every two weeks: a puppy's shape changes fast. Ask your vet if it isn't improving.`],
                ]
              : [
              ["Feed for the weight you want", `About ${aim} calories a day: what ${who} needs at ${target} kg, about ${now - aim} fewer than now.`],
              ["Weigh the food", "Use a kitchen scale for a week. Cups and handfuls creep up without anyone noticing."],
              ["Swap starch for veg", "Cut back the rice, roti or kibble and fill the gap with green beans, pumpkin or zucchini. Same full bowl, far fewer calories."],
              ["Treats count", "Keep treats under a tenth of the day. Use bits of their meal, or crunchy veg, as rewards."],
              ["Add a sniffy walk", "Ten extra minutes of slow, sniffy walking a day helps more than one tiring run."],
              ["Slow and steady", `Aim to lose about ${weekly} kg a week (1% of their weight). Weigh them weekly, and ask your vet to confirm the target.`],
            ]).map(([t, d], i) => (
              <li key={t}>
                <span className="tc-num">{String(i + 1).padStart(2, "0")}</span>
                <strong>{t}</strong>
                <p>{d}</p>
              </li>
            ))}
          </ol>
          {chart ? (
            <DietChart kg={puppy ? kg : target} months={months} need={puppy ? pupAim : aim} who={who} onLoad={onLoad} onExperts={onExperts} />
          ) : (
            <div className="fn-cta">
              <p>
                <strong>Want this as a plan?</strong> {puppy ? <>We&apos;ll size a growing puppy&apos;s diet chart for {who} at {kg} kg, a little under their need, in grams, with Indian food.</> : <>We&apos;ll size a diet chart for {who} at their target of {target} kg, in grams, with Indian food.</>}
              </p>
              <button className="pill" onClick={() => setChart(true)}>
                Make {who}&apos;s diet chart <span className="arrow" aria-hidden />
              </button>
            </div>
          )}
        </>
      )}
      <p className="bc-note">A guide to start from, not a diagnosis. Sudden weight change, a swollen tummy, or losing muscle needs a vet.</p>
    </div>
  );
}
