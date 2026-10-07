"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AGE_STOPS, BREEDS, NEEDS, WEIGHT_RANGE, formatAge, monthsSince, type BreedId, type NeedId, type Species } from "@/lib/flow";
import { Pet } from "./Pets";
import { BreedArt } from "./Breeds";
import { Toon } from "./Cast";
import { Pack, aimPack, type PackMood } from "./Pack";
import { CatBox, type BoxBrand, type CatCoat } from "./CatBox";
import { Walkers } from "./Walkers";
import Slider from "./Slider";
import HandCursor from "./HandCursor";

type Step = "landing" | "species" | "breed" | "age" | "weight" | "sex" | "needs" | "follow" | "curating" | "done";

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
  curating: "M0,60 C30,60 66,60 100,60 L100,100 L0,100 Z",
  done: "M0,-6 C30,-6 66,-6 100,-6 L100,100 L0,100 Z",
};

const wobble = { type: "spring", stiffness: 90, damping: 9, mass: 1 } as const;
const pop = { type: "spring", stiffness: 260, damping: 18 } as const;

// Order sets who springs in first on the pick-your-dog screen.
const BREED_SPOTS = ["beagle", "gsd", "golden", "indie", "shihtzu"] as const;

// Where the age slider's knob sits for a given age in months: between the
// two nearest stops, so an exact birthday lands in the right place.
function sliderPosition(months: number) {
  const last = AGE_STOPS.length - 1;
  if (months <= AGE_STOPS[0]) return 0;
  if (months >= AGE_STOPS[last]) return 1;
  const i = AGE_STOPS.findIndex((stop) => stop > months);
  const between = (months - AGE_STOPS[i - 1]) / (AGE_STOPS[i] - AGE_STOPS[i - 1]);
  return (i - 1 + between) / last;
}

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
  // Age comes from the slider, or from an exact date of birth, which also
  // moves the slider. Dragging the slider afterwards clears the date.
  const [dob, setDob] = useState("");
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
  const sliderMonths = AGE_STOPS[Math.round(age * (AGE_STOPS.length - 1))];
  const dobMonths = monthsSince(dob);
  const months = dobMonths ?? sliderMonths;
  const [minKg, maxKg] = WEIGHT_RANGE[species];
  const kg = Math.round((minKg + weight * (maxKg - minKg)) * 2) / 2;
  const chosen = NEEDS.filter((n) => needs.includes(n.id));
  // Only the needs that have a follow-up question get one.
  const asks = chosen.filter((n) => n.followUp);
  const current = asks[followIndex];

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
      if (followIndex < asks.length - 1) setFollowIndex(followIndex + 1);
      else go("curating");
    }, 350);
  };

  const restart = () => {
    setStep("landing");
    setTrail([]);
    setBreed(null);
    setSex(null);
    setDob("");
    setNeeds([]);
    setAnswers({});
    setFollowIndex(0);
  };

  // The curating screen is a short pause before the results.
  useEffect(() => {
    if (step !== "curating") return;
    const timer = window.setTimeout(() => setStep("done"), 4600);
    return () => window.clearTimeout(timer);
  }, [step]);

  // Recommendations will read this later.
  useEffect(() => {
    if (step !== "done" || !pet) return;
    const profile = { breed: pet.id, species, ageMonths: months, dateOfBirth: dobMonths !== null ? dob : null, weightKg: kg, sex, needs, answers };
    try {
      localStorage.setItem("petbuddha.profile", JSON.stringify(profile));
    } catch {}
  }, [step, pet, species, months, dobMonths, dob, kg, sex, needs, answers]);

  const titles: Record<Step, [string, string]> = {
    landing: ["", ""],
    species: ["Step 1", "Who's your buddy?"],
    breed: ["Step 2", "Pick your dog"],
    age: [species === "cat" ? "Step 2" : "Step 3", "Tell us more"],
    weight: [species === "cat" ? "Step 2" : "Step 3", "Tell us more"],
    sex: [species === "cat" ? "Step 2" : "Step 3", "Tell us more"],
    needs: [species === "cat" ? "Step 3" : "Step 4", "What do you need help with?"],
    follow: [species === "cat" ? "Step 4" : "Step 5", current?.label ?? ""],
    curating: ["Hang tight", pet ? `Curating for your ${pet.name}` : "Curating"],
    done: ["All set", pet ? `Picks for your ${pet.name}` : ""],
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

      {trail.length > 0 && step !== "done" && step !== "curating" && (
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
              {pet.id === "indie-cat" ? <Pet id={pet.id} happy={cheer} className="reactive" /> : <BreedArt id={pet.id} happy={cheer} className="reactive" />}
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
            <div className="breed-scene">
              {BREED_SPOTS.map((id, i) => (
                <motion.button
                  key={id}
                  className={`breed-spot at-${id} reactive`}
                  onClick={() => pick(id)}
                  initial={{ y: 90, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ ...pop, delay: 0.09 * i }}
                  whileTap={{ scale: 0.94 }}
                >
                  <BreedArt id={id} couch />
                  <span className="breed-name">{BREEDS.find((b) => b.id === id)!.name}</span>
                </motion.button>
              ))}
            </div>
          )}

          {step === "age" && (
            <div className="controls">
              <p className="readout">{formatAge(months)} old</p>
              <Slider
                value={age}
                onChange={(v) => {
                  setAge(v);
                  if (dob) setDob("");
                }}
                left="Baby"
                right="Senior"
                label="Age"
                valueText={formatAge(months)}
                steps={AGE_STOPS.length - 1}
              />
              <label className="dob">
                <span>or enter the date of birth</span>
                <input
                  type="date"
                  value={dob}
                  max={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => {
                    setDob(e.target.value);
                    const m = monthsSince(e.target.value);
                    if (m !== null) setAge(sliderPosition(m));
                  }}
                />
              </label>
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
                      setNeeds((now) => (now.includes(n.id) ? now.filter((x) => x !== n.id) : [...now, n.id]));
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
                  go(asks.length > 0 ? "follow" : "curating");
                }}
              >
                Next
              </button>
            </div>
          )}

          {step === "follow" && current && (
            <div className="controls">
              <p className="readout">{current.followUp!.question(species)}</p>
              <div className="chips">
                {current.followUp!.options.map((o) => (
                  <button key={o} className="chip" aria-pressed={answers[current.id] === o} onClick={() => answer(o)}>
                    {o}
                  </button>
                ))}
              </div>
              <p className="hint">
                {followIndex + 1} of {asks.length}
              </p>
            </div>
          )}

          {step === "curating" && (
            <>
              <Walkers />
              <p className="curating-note">
                <span className="paw-trail" aria-hidden>
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <svg key={i} viewBox="0 0 24 24" style={{ "--i": i } as React.CSSProperties}>
                      <ellipse cx="12" cy="15.5" rx="5.5" ry="4.5" />
                      <circle cx="5.5" cy="9.5" r="2.4" />
                      <circle cx="10" cy="6" r="2.4" />
                      <circle cx="15" cy="6.5" r="2.4" />
                      <circle cx="19" cy="10.5" r="2.4" />
                    </svg>
                  ))}
                </span>
                Fetching the best picks<span className="dots" aria-hidden />
              </p>
            </>
          )}

          {step === "done" && pet && (
            <div className="controls">
              <p className="readout">
                {formatAge(months)} old · {kg} kg · {sex}
              </p>
              <div className="chips">
                {chosen.map((n) => (
                  <span key={n.id} className="chip chip-static">
                    {answers[n.id] ? `${n.label}: ${answers[n.id]}` : n.label}
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
