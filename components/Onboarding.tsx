"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AGE_STOPS, BREEDS, NEEDS, WEIGHT_RANGE, formatAge, type BreedId, type NeedId, type Species } from "@/lib/flow";
import { Pet } from "./Pets";
import { CastDefs, Toon } from "./Cast";
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

const CAT_BOXES: { coat: CatCoat; brand: BoxBrand; delay: number; style: React.CSSProperties }[] = [
  { coat: "black", brand: "furex", delay: 0, style: { left: "8%", top: "8%", width: "38%" } },
  { coat: "orange", brand: "pawmazon", delay: 2.6, style: { left: "54%", top: "18%", width: "38%" } },
  { coat: "spotted", brand: "plain", delay: 5.4, style: { left: "27%", top: "52%", width: "40%" } },
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
    species: ["Step 1", "Who's your buddy?"],
    breed: ["Step 2", "Pick your dog"],
    age: [species === "cat" ? "Step 2" : "Step 3", "Tell us more"],
    weight: [species === "cat" ? "Step 2" : "Step 3", "Tell us more"],
    sex: [species === "cat" ? "Step 2" : "Step 3", "Tell us more"],
    needs: [species === "cat" ? "Step 3" : "Step 4", "What do you need help with?"],
    follow: [species === "cat" ? "Step 4" : "Step 5", current?.label ?? ""],
    done: ["All set", pet ? `Curating for your ${pet.name}` : ""],
  };
  const [eyebrow, title] = titles[step];

  const heroOn = !!pet && ["age", "weight", "sex", "needs", "follow", "done"].includes(step);
  const heroSmall = step === "needs" || step === "follow" || step === "done";
  const growth = 0.62 + 0.38 * Math.min(1, months / 18);
  const girth = 0.9 + 0.28 * weight;

  return (
    <main
      className="stage"
      onPointerMove={(e) => {
        e.currentTarget.style.setProperty("--lx", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(2));
        e.currentTarget.style.setProperty("--ly", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(2));
      }}
    >
      <CastDefs />
      <svg className="hill" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <motion.path initial={false} animate={{ d: HILL[step] }} transition={wobble} />
      </svg>

      {trail.length > 0 && step !== "done" && (
        <button className="back" onClick={back} aria-label="Back">
          ←
        </button>
      )}

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
            <p>{eyebrow}</p>
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
                // The dogs notice the hand as it crosses the middle: from 52% of
                // the way over they point their noses at it, and wag once it is on top of them.
                const at = e.clientX / window.innerWidth;
                const next: PackMood = at >= 0.65 ? "wag" : at >= 0.52 ? "sniff" : "idle";
                if (next !== packMood) setPackMood(next);
                aimPack(e.currentTarget, next === "idle" ? null : { x: e.clientX, y: e.clientY });
              }}
              onPointerLeave={(e) => {
                setPackMood("idle");
                aimPack(e.currentTarget, null);
              }}
            >
              <button className="side side-cat" onClick={() => pick("indie-cat")}>
                <span className="crowd">
                  {CAT_BOXES.map((b) => (
                    <span key={b.coat} className="spot" style={b.style}>
                      <CatBox coat={b.coat} brand={b.brand} delay={b.delay} />
                    </span>
                  ))}
                </span>
                <span className="side-label">Cat</span>
              </button>
              <button className="side side-dog" onClick={() => go("breed")} data-pat>
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
