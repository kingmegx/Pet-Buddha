"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AGE_STOPS, BREEDS, MIXED, POPULAR, WEIGHT_RANGE, ageBand, formatAge, monthsSince, searchBreeds, type Breed } from "@/lib/flow";
import { FOOD_CHOICES, PROBLEMS, bowlFor, commonProblems, foodsFromBowl, type Bowl, type ProblemId, type Sex } from "@/lib/content";
import { Face } from "./Faces";
import { CatBust, ProfileBust } from "./Busts";
import { NicheArt } from "./NicheArt";
import { HeroDoodles, LandingMore, Squiggle } from "./LandingMore";
import { BLOB, Sticker, type StickerKind } from "./Stickers";
import { NameTag } from "./NameTag";
import { Pack, aimPack, type PackMood } from "./Pack";
import { CatBox, type BoxBrand, type CatCoat } from "./CatBox";
import { Walkers } from "./Walkers";
import { Results } from "./Results";
import { Profile } from "./Profile";
import Slider from "./Slider";
import { DobInput } from "./DobInput";
import HandCursor from "./HandCursor";
import { accounts, loadDog, localDog, saveDog, takeSaveOnReturn, type SavedDog } from "@/lib/account";

type Step = "landing" | "species" | "name" | "breed" | "weight" | "age" | "sex" | "needs" | "food" | "curating" | "done" | "profile";

const pop = { type: "spring", stiffness: 260, damping: 18 } as const;

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

// "quro" becomes "Quro".
const cap = (s: string) => s.trim().replace(/^./, (c) => c.toUpperCase());

// A heading whose words rise into place one after another.
// The question, word by word. One word (usually the dog's name) is set in the
// italic accent face, like "why *pet buddha*" on the landing.
function Rise({ text, accent }: { text: string; accent?: string }) {
  const bare = (w: string) => w.replace(/[?.,!]+$/, "").replace(/['’]s$/, "");
  return (
    <>
      {text.split(" ").map((word, i) => (
        <Fragment key={i}>
          <span className="rise">
            <span style={{ "--i": i } as React.CSSProperties}>{accent && bare(word) === accent ? <em>{word}</em> : word}</span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

// A line-art sticker and a text sticker on each question, in the corners,
// like the ones scattered around the landing's sections.
const STEP_STICKERS: Partial<Record<Step, { kind: StickerKind; tone: string; ink: string; text: string; ts: string }>> = {
  species: { kind: "heart", tone: "#fbe0d2", ink: "#7c2d4a", text: "hi there", ts: "ts-lime" },
  name: { kind: "sparkle", tone: "#fde3b0", ink: "#6b3a12", text: "good name!", ts: "ts-lilac" },
  breed: { kind: "nose", tone: "#e6f5c9", ink: "#1f5c43", text: "no two noses alike", ts: "ts-coral" },
  weight: { kind: "bone", tone: "#c9d3ff", ink: "#3a3f8f", text: "no scales needed", ts: "ts-sun" },
  age: { kind: "ball", tone: "#fde3b0", ink: "#6b3a12", text: "puppy or wise one?", ts: "ts-lime" },
  sex: { kind: "paw", tone: "#ecd3f5", ink: "#7c2d4a", text: "noted", ts: "ts-coral" },
  needs: { kind: "leaf", tone: "#e6f5c9", ink: "#1f5c43", text: "we've got you", ts: "ts-lilac" },
  food: { kind: "bowl", tone: "#fbe0d2", ink: "#7c2d4a", text: "bowl talk", ts: "ts-sun" },
};
const HERO_TONES = ["#c9d3ff", "#e6f5c9", "#fbe0d2", "#ecd3f5", "#fde3b0"];
const TAG_TONES = ["ts-lime", "ts-coral", "ts-lilac", "ts-sun"];

export default function Onboarding() {
  const [step, setStep] = useState<Step>("landing");
  const [trail, setTrail] = useState<Step[]>([]);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState<Breed | null>(null);
  const [typed, setTyped] = useState("");
  const [age, setAge] = useState(0.2);
  // Age comes from the slider, or from an exact date of birth, which also
  // moves the slider. Dragging the slider afterwards clears the date.
  const [dob, setDob] = useState("");
  const [weight, setWeight] = useState(0.3);
  // False when the owner tapped "Not sure": the weight is then the breed's typical one.
  const [weightSure, setWeightSure] = useState(true);
  const [sex, setSex] = useState<Sex | null>(null);
  const [needs, setNeeds] = useState<ProblemId[]>([]);
  // Once the owner has ticked or unticked anything, their list is left alone.
  const [needsTouched, setNeedsTouched] = useState(false);
  // What is in the bowl now, from the food step: one or more foods, and
  // the bowl the advice is written for.
  const [foods, setFoods] = useState<Bowl[]>([]);
  const bowl = bowlFor(foods);
  const toggleFood = (f: Bowl) => setFoods((now) => (now.includes(f) ? now.filter((x) => x !== f) : [...now, f]));
  const [cheer, setCheer] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [packMood, setPackMood] = useState<PackMood>("idle");
  // The dogs liven up for 3 seconds each time the pointer arrives on their
  // side, then calm down until it leaves and comes back.
  const packArmed = useRef(false);
  const packUntil = useRef(0);
  const packTimer = useRef(0);
  const lookFrame = useRef(0);
  // The landing scrolls inside its own sheet; its sections read this.
  const landingRef = useRef<HTMLDivElement>(null);
  const aimFrame = useRef(0);

  const pet = breed;
  const who = name.trim() || "your dog";
  const sliderMonths = AGE_STOPS[Math.round(age * (AGE_STOPS.length - 1))];
  const dobMonths = monthsSince(dob);
  const months = dobMonths ?? sliderMonths;
  const [minKg, maxKg] = WEIGHT_RANGE;
  const kg = Math.round((minKg + weight * (maxKg - minKg)) * 2) / 2;
  const matches = searchBreeds(typed);

  // The name is remembered on this device only.
  useEffect(() => {
    try {
      setName(cap(localStorage.getItem("petbuddha.name") ?? ""));
    } catch {}
  }, []);

  // Signed in: who to, and their saved dog. Back from Google or the email
  // link, the plan they were looking at is saved first; otherwise the saved
  // one opens, so they land straight on it.
  const [email, setEmail] = useState<string | null>(null);
  const restore = (d: SavedDog) => {
    const b = BREEDS.find((x) => x.name === d.breed) ?? (d.breed === MIXED.name ? MIXED : null);
    if (!b) return;
    setName(cap(d.name ?? ""));
    setBreed(b);
    setDob(d.dateOfBirth ?? "");
    setAge(sliderPosition(d.ageMonths));
    setWeight((d.weightKg - minKg) / (maxKg - minKg));
    setWeightSure(d.weightSure);
    setSex(d.sex);
    setNeeds(d.needs);
    setNeedsTouched(true);
    setFoods(d.foods ?? foodsFromBowl(d.bowl));
    setTrail([]);
    setStep("done");
  };
  useEffect(() => {
    if (!accounts) return;
    let first = true;
    const { data } = accounts.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
      if (!session || !first) return;
      first = false;
      // Off the auth callback, so Supabase isn't asked while it's still busy.
      window.setTimeout(async () => {
        const local = localDog();
        if (takeSaveOnReturn() && local) {
          await saveDog(local);
          restore(local);
        } else {
          const saved = await loadDog();
          if (saved) restore(saved);
        }
      }, 0);
    });
    return () => data.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On the landing, the bottoms of the two arched windows line up with the
  // "8 short questions" line under the button.
  useEffect(() => {
    if (step !== "landing") return;
    const align = () => {
      const hero = landingRef.current?.querySelector<HTMLElement>(".l-hero");
      const note = hero?.querySelector<HTMLElement>(".lede-note");
      if (!hero || !note) return;
      // Layout offsets, not on-screen boxes, so the entrance animations don't skew it.
      const copy = note.offsetParent as HTMLElement;
      const bottom = copy.offsetTop + note.offsetTop + note.offsetHeight;
      hero.style.setProperty("--niche-bottom", `${Math.round(bottom)}px`);
    };
    align();
    document.fonts?.ready.then(align);
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, [step]);

  const startQuestions = () => {
    // Let the dogs leave before the questions come in.
    setLeaving(true);
    window.setTimeout(() => {
      go("species");
      setLeaving(false);
    }, 380);
  };

  const go = (next: Step) => {
    setTrail((t) => [...t, step]);
    setStep(next);
  };

  const back = () => {
    const prev = trail[trail.length - 1];
    if (!prev) return;
    setTrail(trail.slice(0, -1));
    setStep(prev);
  };

  const pick = (b: Breed) => {
    setBreed(b);
    setTyped("");
    // Start the weight in the middle of what is typical for the breed.
    setWeight(((b.kg[0] + b.kg[1]) / 2 - minKg) / (maxKg - minKg));
    setWeightSure(true);
    go("weight");
  };

  const saveName = () => {
    // Names always start with a capital, however they were typed.
    const tidy = cap(name);
    setName(tidy);
    try {
      localStorage.setItem("petbuddha.name", tidy);
    } catch {}
    go("breed");
  };

  const celebrate = () => {
    setCheer(true);
    window.setTimeout(() => setCheer(false), 900);
  };

  const restart = () => {
    setStep("landing");
    setTrail([]);
    setBreed(null);
    setSex(null);
    setDob("");
    setNeeds([]);
    setNeedsTouched(false);
    setFoods([]);
  };

  // The curating screen is a short pause before the results.
  useEffect(() => {
    if (step !== "curating") return;
    const timer = window.setTimeout(() => setStep("done"), 4600);
    return () => window.clearTimeout(timer);
  }, [step]);

  // Later flows will read this instead of asking again.
  useEffect(() => {
    if ((step !== "done" && step !== "profile") || !pet) return;
    const profile = { name: name.trim() || null, breed: pet.name, ageMonths: months, dateOfBirth: dobMonths !== null ? dob : null, weightKg: kg, weightSure, sex, needs, bowl, foods };
    try {
      localStorage.setItem("petbuddha.profile", JSON.stringify(profile));
    } catch {}
    // Signed in: keep the account copy up to date too, once the edits settle.
    if (!email) return;
    const t = window.setTimeout(() => saveDog(profile), 800);
    return () => window.clearTimeout(t);
  }, [step, pet, name, months, dobMonths, dob, kg, weightSure, sex, needs, bowl, foods, email]);

  // Eyebrow, title and the line under the title, per step.
  const titles: Record<Step, [string, string, string]> = {
    landing: ["", "", ""],
    species: ["Step 1 of 8", "Who are we helping today?", ""],
    name: ["Step 2 of 8", "What's your dog's name?", "We'll use it to personalise the plan. It stays on this device."],
    breed: ["Step 3 of 8", `What breed is ${who}?`, "Search, or pick the closest face. Not sure? Choose \"Mixed\" and the plan still works."],
    weight: ["Step 4 of 8", `How much does ${who} weigh?`, "A rough guess is fine. It helps us size chews and portions safely."],
    age: ["Step 5 of 8", `How old is ${who}?`, "Age changes what's safe to chew and what they need."],
    sex: ["Step 6 of 8", `Is ${who} a boy or a girl?`, "A few behaviours differ between the two."],
    needs: ["Step 7 of 8", "What would you like help with?", `Pick all that apply. We've pre-selected what's common at ${formatAge(months)}.`],
    food: ["Step 8 of 8", `What does ${who} eat now?`, "Tick everything that goes in the bowl, then anything you've noticed about their body."],
    curating: ["One moment", `Putting it together for ${who}`, ""],
    done: ["", "", ""],
    profile: ["", "", ""],
  };
  const [eyebrow, title, sub] = titles[step];
  // The word in each question set in the italic accent; the dog's name when
  // the question has it.
  const ACCENT: Partial<Record<Step, string>> = { species: "helping", name: "name", needs: "help" };

  // How far through the flow we are, for the bar along the top.
  const ORDER: Step[] = ["landing", "species", "name", "breed", "weight", "age", "sex", "needs", "food", "curating", "done"];
  const progress = step === "profile" ? 1 : ORDER.indexOf(step) / (ORDER.length - 1);

  // Where the picked pet sits. It moves up and shrinks on steps with taller
  // controls, so there is always clear space between it and the question.
  const HERO: Partial<Record<Step, { top: string; scale: number }>> = {
    weight: { top: "40%", scale: 1 },
    age: { top: "37%", scale: 0.92 },
    sex: { top: "43%", scale: 1 },
    needs: { top: "33%", scale: 0.5 },
    food: { top: "33%", scale: 0.5 },
  };
  const hero = HERO[step];

  const heroOn = !!pet && !!hero;
  // The head grows with age and fills out a little with weight.
  const growth = 0.66 + 0.34 * Math.min(1, months / 18);
  const girth = 0.94 + 0.2 * weight;

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
      {/* The step bar belongs to the questions, so it goes once they are done. */}
      {step !== "done" && step !== "profile" && (
        <div className="progress" aria-hidden>
          <motion.span initial={false} animate={{ scaleX: progress }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
        </div>
      )}

      {trail.length > 0 && step !== "done" && step !== "curating" && step !== "profile" && (
        <button className="back" onClick={back} aria-label="Back">
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden>
            <path d="M16 10H4M9 5l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <AnimatePresence mode="wait">
        {title && (
          <motion.header
            key={`${title}|${sub}`}
            className="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ y: -24, opacity: 0, transition: { duration: 0.16 } }}
            transition={{ duration: 0.2 }}
          >
            <p className={`eyebrow step-tag ${TAG_TONES[ORDER.indexOf(step) % TAG_TONES.length]}`}>{eyebrow}</p>
            <h1>
              <Rise text={title} accent={ACCENT[step] ?? who} />
            </h1>
            <Squiggle className="title-squiggle" />
            {sub && <p className="sub">{sub}</p>}
          </motion.header>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {STEP_STICKERS[step] && (
          <motion.div key={step} className="step-stickers" aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
            <motion.span className="step-line" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: -8 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.25 }}>
              <Sticker kind={STEP_STICKERS[step]!.kind} tone={STEP_STICKERS[step]!.tone} ink={STEP_STICKERS[step]!.ink} />
            </motion.span>
            <motion.span className={`step-text text-sticker ${STEP_STICKERS[step]!.ts}`} initial={{ scale: 0, rotate: 12 }} animate={{ scale: 1, rotate: 5 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.35 }}>
              {STEP_STICKERS[step]!.text}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {heroOn && pet && (
          <motion.div
            key={pet.name}
            className="hero"
            initial={{ scale: 0, top: "50%" }}
            animate={{ scale: hero!.scale, top: hero!.top }}
            exit={{ scale: 0 }}
            transition={pop}
          >
            <svg className="hero-blob" viewBox="0 0 64 64" aria-hidden>
              <motion.path d={BLOB} initial={false} animate={{ fill: HERO_TONES[ORDER.indexOf(step) % HERO_TONES.length] }} transition={{ duration: 0.4 }} />
            </svg>
            <div className="hero-size" style={{ transform: `scale(${growth * girth}, ${growth})` }}>
              <Face id={pet.face} happy={cheer} className="reactive" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.section
          key={step}
          className={`screen screen-${step}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -18, transition: { duration: 0.16 } }}
          transition={{ duration: 0.2 }}
        >
          {step === "landing" && (
            <>
              {/* The landing, top to bottom: the name between the two bowing
                  animals with the way in; three reasons to trust it; and a
                  "Did you know?" strip along the bottom. */}
              <div className="landing-bg" />
              <div className={`card-page ${leaving ? "is-leaving" : ""}`}>
                <div className="paper landing" ref={landingRef}>
                  <div className="l-first">
                  <section className="l-hero">
                    {/* Either side of the name, eyes closed, bowing towards it. */}
                    <HeroDoodles />
                    <div className="niche n-left reactive" data-pat data-say="namaste 🙏">
                      <NicheArt src="/art/pray-dog.png">
                        <ProfileBust />
                      </NicheArt>
                    </div>
                    <div className="niche n-right reactive" data-pat data-say="namaste 🙏">
                      <NicheArt src="/art/pray-cat.png">
                        <CatBust />
                      </NicheArt>
                    </div>
                    <div className="landing-copy">
                      {/* The meditating dog floats above the name. */}
                      <span className="floater" aria-hidden>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/art/buddha.png" alt="" draggable={false} />
                        <i />
                      </span>
                      <h1 className="logo">Pet Buddha</h1>
                      <p className="lede">Tell us about your dog, and we&apos;ll put together advice and products picked for them.</p>
                      <button className="pill" onClick={startQuestions}>
                        Personalise my plan <span className="arrow" aria-hidden />
                      </button>
                      <p className="lede-note">8 short questions · about 2 minutes · no sign-up</p>
                    </div>
                  </section>
                  <div className="l-bottom">
                    <button
                      className="l-scroll"
                      onClick={() => {
                        const sheet = landingRef.current;
                        const next = sheet?.querySelector<HTMLElement>(".sw");
                        if (sheet && next) sheet.scrollTo({ top: next.offsetTop, behavior: "smooth" });
                      }}
                    >
                      <span>Scroll to see why</span>
                      <i aria-hidden>
                        <svg viewBox="0 0 20 20" width="16" height="16">
                          <path d="M10 4v12M5 11l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </i>
                    </button>
                  </div>
                  </div>
                  <LandingMore scroller={landingRef} onStart={startQuestions} />
                </div>
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
                const sides = e.currentTarget;
                const onDogs = at >= 0.52;
                if (onDogs && !packArmed.current) {
                  packArmed.current = true;
                  packUntil.current = Date.now() + 3000;
                  window.clearTimeout(packTimer.current);
                  packTimer.current = window.setTimeout(() => {
                    setPackMood("idle");
                    aimPack(sides, null);
                  }, 3000);
                }
                if (!onDogs) packArmed.current = false;
                const awake = Date.now() < packUntil.current;
                const next: PackMood = !awake ? "idle" : at >= 0.65 ? "wag" : onDogs ? "sniff" : "idle";
                if (next !== packMood) setPackMood(next);
                const target = next === "idle" ? null : { x: e.clientX, y: e.clientY };
                cancelAnimationFrame(aimFrame.current);
                aimFrame.current = requestAnimationFrame(() => aimPack(sides, target));
              }}
              onPointerLeave={(e) => {
                packArmed.current = false;
                setPackMood("idle");
                cancelAnimationFrame(aimFrame.current);
                aimPack(e.currentTarget, null);
              }}
            >
              <button className="side side-cat" aria-disabled data-say="Cats are coming soon">
                <span className="crowd">
                  {CAT_BOXES.map((b) => (
                    <span key={b.coat} className="spot" style={b.style}>
                      <CatBox coat={b.coat} brand={b.brand} delay={b.delay} />
                    </span>
                  ))}
                </span>
                <span className="side-label">
                  Cat <small>soon</small>
                </span>
              </button>
              <button className="side side-dog" onClick={() => go("name")} data-pat>
                <span className="crowd">
                  <Pack mood={packMood} />
                </span>
                <span className="side-label">Dog</span>
              </button>
            </div>
          )}

          {step === "name" && <NameTag name={name} />}

          {step === "name" && (
            <form
              className="controls"
              onSubmit={(e) => {
                e.preventDefault();
                saveName();
              }}
            >
              <label className="field">
                <span className="sr">Your dog's name</span>
                <input type="text" value={name} maxLength={24} autoComplete="off" placeholder="Name, or a nickname" onChange={(e) => setName(e.target.value)} />
              </label>
              <button className="pill" type="submit">
                Continue <span className="arrow" aria-hidden />
              </button>
            </form>
          )}

          {step === "breed" && (
            <div className="breed-pick">
              <div className="search">
                <label className="field">
                  <span className="sr">Search for a breed</span>
                  <input type="text" value={typed} autoComplete="off" placeholder="Search, like Labrador or Pug" onChange={(e) => setTyped(e.target.value)} />
                </label>
                {typed.trim() && (
                  <ul className="matches">
                    {matches.map((b) => (
                      <li key={b.name}>
                        <button onClick={() => pick(b)}>{b.name}</button>
                      </li>
                    ))}
                    <li>
                      <button onClick={() => pick(MIXED)}>{matches.length ? MIXED.name : `Can't find it? Choose "${MIXED.name}"`}</button>
                    </li>
                  </ul>
                )}
              </div>
              <div className="tiles">
                {[...POPULAR, MIXED].map((b, i) => (
                  <motion.button
                    key={b.name}
                    className="tile reactive"
                    onClick={() => pick(b)}
                    initial={{ y: 70, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ...pop, delay: 0.07 * i }}
                    whileTap={{ scale: 0.94 }}
                  >
                    <Face id={b.face} />
                    <span className="breed-name">{b.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {step === "weight" && pet && (
            <div className="controls">
              <p className="readout">
                <input
                  className="kg"
                  type="number"
                  inputMode="decimal"
                  min={minKg}
                  max={maxKg}
                  step={0.5}
                  value={kg}
                  aria-label="Weight in kilograms"
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (v >= minKg && v <= maxKg) setWeight((v - minKg) / (maxKg - minKg));
                    setWeightSure(true);
                  }}
                />{" "}
                kg
              </p>
              <Slider
                value={weight}
                onChange={(v) => {
                  setWeight(v);
                  setWeightSure(true);
                }}
                left="Light"
                right="Heavy"
                label="Weight"
                valueText={`${kg} kilograms`}
                steps={69}
              />
              <p className="hint">
                {pet === MIXED ? "Drag, or type the number." : `Grown ${pet.name}s are usually ${pet.kg[0]}-${pet.kg[1]} kg. Drag, or type the number.`}
              </p>
              <div className="row">
                <button
                  className="pill pill-quiet"
                  onClick={() => {
                    setWeight(((pet.kg[0] + pet.kg[1]) / 2 - minKg) / (maxKg - minKg));
                    setWeightSure(false);
                    go("age");
                  }}
                >
                  Not sure
                </button>
                <button className="pill" onClick={() => go("age")}>
                  Continue <span className="arrow" aria-hidden />
                </button>
              </div>
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
              <div className="dob">
                <span>or enter the date of birth</span>
                {/* Clears when the slider is moved instead (dob goes back to ""). */}
                <DobInput
                  key={dob ? "set" : "empty"}
                  value={dob}
                  onChange={(iso) => {
                    setDob(iso);
                    const m = monthsSince(iso);
                    if (m !== null) setAge(sliderPosition(m));
                  }}
                />
              </div>
              <button className="pill" onClick={() => go("sex")}>
                Continue <span className="arrow" aria-hidden />
              </button>
            </div>
          )}

          {step === "sex" && (
            <div className="controls">
              <div className="chips">
                {(["boy", "girl"] as const).map((s) => (
                  <button
                    key={s}
                    className="chip chip-big"
                    aria-pressed={sex === s}
                    onClick={() => {
                      setSex(s);
                      celebrate();
                      // Tick what is common at this age, unless the owner already chose.
                      if (!needsTouched) setNeeds(commonProblems(ageBand(months)));
                      window.setTimeout(() => go("needs"), 350);
                    }}
                  >
                    {s === "boy" ? "Good boy" : "Good girl"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "needs" && (
            <div className="controls">
              <div className="chips">
                {PROBLEMS.filter((p) => !p.body).map((p) => (
                  <button
                    key={p.id}
                    className="chip"
                    aria-pressed={needs.includes(p.id)}
                    onClick={() => {
                      setNeedsTouched(true);
                      setNeeds((now) => (now.includes(p.id) ? now.filter((x) => x !== p.id) : [...now, p.id]));
                      celebrate();
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <button className="pill" onClick={() => go("food")}>
                Continue <span className="arrow" aria-hidden />
              </button>
            </div>
          )}

          {step === "food" && (
            <div className="controls">
              <div className="chips chips-foods" role="group" aria-label="What they eat">
                {FOOD_CHOICES.map((b) => (
                  <button
                    key={b.id}
                    className="chip chip-big"
                    aria-pressed={foods.includes(b.id)}
                    onClick={() => {
                      if (!foods.includes(b.id)) celebrate();
                      toggleFood(b.id);
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              <p className="hint">Anything about their body?</p>
              {/* Two even rows: skin and coat, then food and body. */}
              {[
                ["itch", "ticks", "coat"],
                ["tummy", "picky", "weight", "joints"],
              ].map((row) => (
                <div key={row[0]} className="chips chips-quiet chips-row">
                  {PROBLEMS.filter((p) => row.includes(p.id)).map((p) => (
                  <button
                    key={p.id}
                    className="chip"
                    aria-pressed={needs.includes(p.id)}
                    onClick={() => setNeeds((now) => (now.includes(p.id) ? now.filter((x) => x !== p.id) : [...now, p.id]))}
                  >
                    {p.label}
                  </button>
                  ))}
                </div>
              ))}
              <button className="pill" onClick={() => go("curating")}>
                {name.trim() ? `See ${cap(name)}'s plan` : "See the plan"} <span className="arrow" aria-hidden />
              </button>
            </div>
          )}

          {step === "curating" && <Walkers name={name.trim()} />}

          {step === "profile" && pet && (
            <Profile
              name={name}
              setName={(v) => {
                setName(v);
                try {
                  localStorage.setItem("petbuddha.name", v.trim());
                } catch {}
              }}
              breed={pet}
              setBreed={setBreed}
              kg={kg}
              setKg={(v) => {
                setWeight((v - minKg) / (maxKg - minKg));
                setWeightSure(true);
              }}
              age={age}
              setAge={(v) => {
                setAge(v);
                if (dob) setDob("");
              }}
              months={months}
              sex={sex}
              setSex={setSex}
              needs={needs}
              setNeeds={(fn) => {
                setNeedsTouched(true);
                setNeeds(fn);
              }}
              foods={foods}
              toggleFood={toggleFood}
              onDone={() => setStep("done")}
            />
          )}

          {step === "done" && pet && <Results pet={pet} name={cap(name)} months={months} kg={kg} weightSure={weightSure} sex={sex} needs={needs} bowl={bowl} foods={foods} email={email} onProfile={() => setStep("profile")} onRestart={restart} />}
        </motion.section>
      </AnimatePresence>

      {/* The hand belongs to the onboarding; the plan and profile use the normal pointer. */}
      {step !== "done" && step !== "profile" && <HandCursor />}
    </main>
  );
}
