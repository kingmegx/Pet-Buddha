"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AGE_STOPS, BREEDS, NEEDS, WEIGHT_RANGE, formatAge, type BreedId, type NeedId, type Species } from "@/lib/flow";
import { Pet } from "./Pets";
import { Toon } from "./Cast";
import { Pack, aimPack, type PackMood } from "./Pack";
import { CatBox, type BoxBrand, type CatCoat } from "./CatBox";
import Slider from "./Slider";
import HandCursor from "./HandCursor";

type Step = "landing" | "species" | "breed" | "age" | "weight" | "sex" | "needs" | "follow" | "done";

// The hill is one path that re-shapes itself on every step. All shapes use
// the same commands so they can morph into each other.
const HILL: Record<Step, string> = {
  landing: "M0,101 C28,101 58,101 100,101 L100,102 L0,102 Z",
  species: "M0,40 C30,30 62,48 100,36 L100,100 L0,100 Z",
  breed: "M0,38 C30,52 66,28 100,42 L100,100 L0,100 Z",
  age: "M0,44 C34,34 60,52 100,32 L100,100 L0,100 Z",
  weight: "M0,34 C30,50 64,34 100,46 L100,100 L0,100 Z",
  sex: "M0,46 C36,36 62,46 100,36 L100,100 L0,100 Z",
  needs: "M0,26 C30,36 66,20 100,30 L100,100 L0,100 Z",
  follow: "M0,30 C32,20 64,36 100,24 L100,100 L0,100 Z",
  done: "M0,-6 C30,-6 66,-6 100,-6 L100,100 L0,100 Z",
};

const wobble = { type: "spring", stiffness: 90, damping: 9, mass: 1 } as const;
const pop = { type: "spring", stiffness: 260, damping: 18 } as const;

const CAT_BOXES: { coat: CatCoat; brand: BoxBrand; style: React.CSSProperties }[] = [
  { coat: "black", brand: "furex", style: { left: "8%", top: "8%", width: "38%" } },
  { coat: "orange", brand: "pawmazon", style: { left: "54%", top: "18%", width: "38%" } },
  { coat: "spotted", brand: "plain", style: { left: "27%", top: "52%", width: "40%" } },
];

export default function Onboarding() {
  const [step, setStep] = useState<Step>("landing");
  const [trail, setTrail] = useState<Step[]>([]);
  const [breed, setBreed] = useState<BreedId | null>(null);
  const [age, setAge] = useState(0.2);
  const [weight, setWeight] = useState(0.4);
  const [sex, setSex] = useState<"boy" | "girl" | null>(null);
  const [needs, setNeeds] = useState<NeedId[]>([]);
  const [followIndex, setFollowIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<NeedId, string>>>({});
  const [cheer, setCheer] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [packMood, setPackMood] = useState<PackMood>("idle");
  const lookFrame = useRef(0);
  const aimFrame = useRef(0);

  const pet = BREEDS.find((b) => b.id === breed);
  const species: Species = pet?.species ?? "dog";
  const months = AGE_STOPS[Math.round(age * (AGE_STOPS.length - 1))];
  const [minKg, maxKg] = WEIGHT_RANGE[species];
  const kg = Math.round((minKg + weight * (maxKg - minKg)) * 2) / 2;
  const chosen = NEEDS.filter((n) => needs.includes(n.id));
  const current = chosen[followIndex];

  const go = (next: Step) => {
    setTrail((t) => [...t, step]);
    setStep(next);
  };

  const back = () => {
    if (step === "follow" && followIndex > 0) return setFollowIndex(followIndex - 1);
    const prev = trail[trail.length - 1];
    if (!prev) return;
    setTrail(trail.slice(0, -1));
    setStep(prev);
  };

  const pick = (id: BreedId) => {
    const b = BREEDS.find((x) => x.id === id)!;
    const [lo, hi] = WEIGHT_RANGE[b.species];
    setBreed(id);
    setWeight((b.typicalKg - lo) / (hi - lo));
    go("age");
  };

  const celebrate = () => {
    setCheer(true);
    window.setTimeout(() => setCheer(false), 900);
  };

  const answer = (option: string) => {
    setAnswers({ ...answers, [current.id]: option });
    celebrate();
    window.setTimeout(() => {
      if (followIndex < chosen.length - 1) setFollowIndex(followIndex + 1);
      else go("done");
    }, 350);
  };

  const restart = () => {
    setStep("landing");
    setTrail([]);
    setBreed(null);
    setSex(null);
    setNeeds([]);
    setAnswers({});
    setFollowIndex(0);
  };

  // Recommendations will read this later.
  useEffect(() => {
    if (step !== "done" || !pet) return;
    const profile = { breed: pet.id, species, ageMonths: months, weightKg: kg, sex, needs, answers };
    try {
      localStorage.setItem("petbuddha.profile", JSON.stringify(profile));
    } catch {}
  }, [step, pet, species, months, kg, sex, needs, answers]);

  const titles: Record<Step, [string, string]> = {
    landing: ["", ""],
    species: ["", "Who's your buddy?"],
    breed: ["", "Pick your dog"],
    age: ["", "Tell us more"],
    weight: ["", "Tell us more"],
    sex: ["", "Tell us more"],
    needs: ["", "What do you need help with?"],
    follow: ["", current?.label ?? ""],
    done: ["All set", pet ? `Curating for your ${pet.name}` : ""],
  };
  const [eyebrow, title] = titles[step];

  // The progress bar has one segment per step (cats skip the breed step).
  // "Tell us more" spans three screens and the follow-ups one per need, so
  // those segments fill in parts.
  const segments = species === "cat" ? ["species", "about", "needs", "follow"] : ["species", "breed", "about", "needs", "follow"];
  const segment = ["age", "weight", "sex"].includes(step) ? "about" : step;
  const at = segments.indexOf(segment);
  const part =
    step === "age" || step === "weight" || step === "sex"
      ? (["age", "weight", "sex"].indexOf(step) + 1) / 3
      : step === "follow"
        ? (followIndex + 1) / Math.max(1, chosen.length)
        : 1;
  const fill = (i: number) => (step === "done" || i < at ? 1 : i === at ? part : 0);

  const heroOn = !!pet && ["age", "weight", "sex", "needs", "follow", "done"].includes(step);
  const heroSmall = step === "needs" || step === "follow" || step === "done";
  const growth = 0.62 + 0.38 * Math.min(1, months / 18);
  const girth = 0.9 + 0.28 * weight;

  return (
    <main
      className="stage"
      onPointerMove={(e) => {
        // Eyes follow the hand. Updated at most once per frame.
        const stage = e.currentTarget;
        const { clientX, clientY } = e;
        cancelAnimationFrame(lookFrame.current);
        lookFrame.current = requestAnimationFrame(() => {
          stage.style.setProperty("--lx", ((clientX / window.innerWidth) * 2 - 1).toFixed(2));
          stage.style.setProperty("--ly", ((clientY / window.innerHeight) * 2 - 1).toFixed(2));
        });
      }}
    >
      <svg className="hill" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <motion.path initial={false} animate={{ d: HILL[step] }} transition={wobble} />
      </svg>

      {trail.length > 0 && step !== "done" && (
        <button className="back" onClick={back} aria-label="Back">
          ←
        </button>
      )}

      <AnimatePresence>
        {step !== "landing" && (
          <motion.div
            className="progress"
            role="progressbar"
            aria-label="Progress"
            aria-valuemin={0}
            aria-valuemax={segments.length}
            aria-valuenow={step === "done" ? segments.length : at + 1}
            aria-valuetext={step === "done" ? "Done" : `Step ${at + 1} of ${segments.length}`}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={pop}
          >
            {segments.map((name, i) => (
              <span key={name} className="progress-seg">
                <motion.span className="progress-fill" initial={false} animate={{ scaleX: fill(i) }} transition={pop} />
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {title && (
          <motion.header
            key={title}
            className="title"
            initial={{ y: -90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0, transition: { duration: 0.15 } }}
            transition={pop}
          >
            {eyebrow && <p>{eyebrow}</p>}
            <h1>{title}</h1>
          </motion.header>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {heroOn && pet && (
          <motion.div
            key={pet.id}
            className="hero"
            initial={{ scale: 0, top: "50%" }}
            animate={{ scale: heroSmall ? 0.82 : 1, top: heroSmall ? "38%" : "47%" }}
            exit={{ scale: 0 }}
            transition={pop}
          >
            <div className="hero-size" style={{ transform: `scale(${growth * girth}, ${growth})` }}>
              <Pet id={pet.id} happy={cheer} className="reactive" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.section
          key={step === "follow" ? `follow-${followIndex}` : step}
          className={`screen screen-${step}`}
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 1.04, transition: { duration: 0.18 } }}
          transition={pop}
        >
          {step === "landing" && (
            <>
              <div className="landing-copy">
                <h1 className="logo">Pet Buddha</h1>
                <p>Calm, simple help for your pet — picked for them.</p>
                <button
                  className="pill"
                  onClick={() => {
                    // Let the cast leap off their edges before the hill rises.
                    setLeaving(true);
                    window.setTimeout(() => {
                      go("species");
                      setLeaving(false);
                    }, 380);
                  }}
                >
                  Get started
                </button>
              </div>
              <div className={`cast ${leaving ? "is-leaving" : ""}`}>
                <Toon id="indie" className="c-indie" />
                <Toon id="beagle" className="c-beagle" />
                <Toon id="gsd" className="c-gsd" />
                <Toon id="golden" className="c-golden" />
                <Toon id="indie-cat" className="c-cat" />
              </div>
            </>
          )}

          {step === "species" && (
            <div
              className="sides"
              onPointerMove={(e) => {
                // The dogs notice the hand as it nears their side: they point
                // their noses at it and sniff. That is their only reaction.
                const at = e.clientX / window.innerWidth;
                const next: PackMood = at >= 0.45 ? "sniff" : "idle";
                if (next !== packMood) setPackMood(next);
                const sides = e.currentTarget;
                const target = next === "idle" ? null : { x: e.clientX, y: e.clientY };
                cancelAnimationFrame(aimFrame.current);
                aimFrame.current = requestAnimationFrame(() => aimPack(sides, target));
              }}
              onPointerLeave={(e) => {
                setPackMood("idle");
                cancelAnimationFrame(aimFrame.current);
                aimPack(e.currentTarget, null);
              }}
            >
              <button className="side side-cat" onClick={() => pick("indie-cat")}>
                <span className="crowd">
                  {CAT_BOXES.map((b) => (
                    <span key={b.coat} className="spot" style={b.style}>
                      <CatBox coat={b.coat} brand={b.brand} />
                    </span>
                  ))}
                </span>
                <span className="side-label">Cat</span>
              </button>
              <button className="side side-dog" onClick={() => go("breed")}>
                <span className="crowd">
                  <Pack mood={packMood} />
                </span>
                <span className="side-label">Dog</span>
              </button>
            </div>
          )}

          {step === "breed" && (
            <div className="breeds">
              {BREEDS.filter((b) => b.species === "dog").map((b, i) => (
                <motion.button
                  key={b.id}
                  className="breed reactive"
                  onClick={() => pick(b.id)}
                  initial={{ y: 120, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ ...pop, delay: 0.08 * i }}
                  whileHover={{ y: -10 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Pet id={b.id} />
                  <span>{b.name}</span>
                </motion.button>
              ))}
            </div>
          )}

          {step === "age" && (
            <div className="controls">
              <p className="readout">{formatAge(months)} old</p>
              <Slider value={age} onChange={setAge} left="Baby" right="Senior" label="Age" valueText={formatAge(months)} steps={AGE_STOPS.length - 1} />
              <button className="pill" onClick={() => go("weight")}>
                Next
              </button>
            </div>
          )}

          {step === "weight" && (
            <div className="controls">
              <p className="readout">{kg} kg</p>
              <Slider value={weight} onChange={setWeight} left="Light" right="Heavy" label="Weight" valueText={`${kg} kilograms`} steps={40} />
              <button className="pill" onClick={() => go("sex")}>
                Next
              </button>
            </div>
          )}

          {step === "sex" && (
            <div className="controls">
              <p className="readout">Boy or girl?</p>
              <div className="chips">
                {(["boy", "girl"] as const).map((s) => (
                  <button
                    key={s}
                    className="chip"
                    aria-pressed={sex === s}
                    onClick={() => {
                      setSex(s);
                      celebrate();
                      window.setTimeout(() => go("needs"), 350);
                    }}
                  >
                    {s === "boy" ? "Boy" : "Girl"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "needs" && (
            <div className="controls">
              <p className="hint">Pick as many as you like</p>
              <div className="chips">
                {NEEDS.map((n) => (
                  <button
                    key={n.id}
                    className="chip"
                    aria-pressed={needs.includes(n.id)}
                    onClick={() => {
                      setNeeds(needs.includes(n.id) ? needs.filter((x) => x !== n.id) : [...needs, n.id]);
                      celebrate();
                    }}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
              <button
                className="pill"
                disabled={needs.length === 0}
                onClick={() => {
                  setFollowIndex(0);
                  go("follow");
                }}
              >
                Next
              </button>
            </div>
          )}

          {step === "follow" && current && (
            <div className="controls">
              <p className="readout">{current.followUp.question(species)}</p>
              <div className="chips">
                {current.followUp.options.map((o) => (
                  <button key={o} className="chip" aria-pressed={answers[current.id] === o} onClick={() => answer(o)}>
                    {o}
                  </button>
                ))}
              </div>
              <p className="hint">
                {followIndex + 1} of {chosen.length}
              </p>
            </div>
          )}

          {step === "done" && pet && (
            <div className="controls">
              <p className="readout">
                {formatAge(months)} old · {kg} kg · {sex}
              </p>
              <div className="chips">
                {chosen.map((n) => (
                  <span key={n.id} className="chip chip-static">
                    {n.label}: {answers[n.id]}
                  </span>
                ))}
              </div>
              <button className="pill" onClick={restart}>
                Start over
              </button>
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      <HandCursor />
    </main>
  );
}
