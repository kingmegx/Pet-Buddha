"use client";

import { useState } from "react";
import { AGE_STOPS, MIXED, POPULAR, WEIGHT_RANGE, formatAge, searchBreeds, type Breed } from "@/lib/flow";
import { FOOD_CHOICES, PROBLEMS, type Bowl, type ProblemId, type Sex } from "@/lib/content";
import { Face } from "./Faces";
import { Logo } from "./Logo";
import Slider from "./Slider";
import { Squiggle } from "./LandingMore";

// The dog's profile: everything the questions asked, on one page, all of it
// editable. Changing anything here changes the suggestions. It lives on this
// device only. Styles are in globals.css under ".profile".
export function Profile({
  name,
  setName,
  breed,
  setBreed,
  kg,
  setKg,
  age,
  setAge,
  months,
  sex,
  setSex,
  needs,
  setNeeds,
  foods,
  toggleFood,
  onDone,
}: {
  name: string;
  setName: (v: string) => void;
  breed: Breed;
  setBreed: (b: Breed) => void;
  kg: number;
  setKg: (v: number) => void;
  // 0..1 along the age slider.
  age: number;
  setAge: (v: number) => void;
  months: number;
  sex: Sex | null;
  setSex: (s: Sex) => void;
  needs: ProblemId[];
  setNeeds: (fn: (now: ProblemId[]) => ProblemId[]) => void;
  foods: Bowl[];
  toggleFood: (b: Bowl) => void;
  onDone: () => void;
}) {
  const [typed, setTyped] = useState("");
  const [minKg, maxKg] = WEIGHT_RANGE;
  const matches = searchBreeds(typed, 4);
  const choices = [...POPULAR, MIXED];

  return (
    <div className="results profile sugg">
      <div className="results-bar">
        <Logo />
        <button className="linklike" onClick={onDone}>
          Back to the plan
        </button>
      </div>

      <header className="results-head">
        <div className="results-pet">
          <Face id={breed.face} className="reactive" />
        </div>
        <div>
          <h1>
            {name.trim() ? (
              <>
                <em>{name.trim().replace(/^./, (c) => c.toUpperCase())}&apos;s</em> profile
              </>
            ) : (
              <>
                your dog&apos;s <em>profile</em>
              </>
            )}
          </h1>
          <Squiggle className="s-squiggle" />
          <p>Change anything, tick more, and the suggestions follow. Kept on this device only.</p>
        </div>
      </header>

      <section className="card profile-card">
        <label className="profile-row">
          <span>Name</span>
          <input type="text" value={name} maxLength={24} autoComplete="off" placeholder="Name, or a nickname" onChange={(e) => setName(e.target.value)} />
        </label>

        <div className="profile-row">
          <span>Breed</span>
          <div className="profile-field">
            <div className="chips chips-left">
              {choices.map((b) => (
                <button key={b.name} className="chip" aria-pressed={breed.name === b.name} onClick={() => setBreed(b)}>
                  {b.name}
                </button>
              ))}
              {!choices.some((b) => b.name === breed.name) && (
                <button className="chip" aria-pressed>
                  {breed.name}
                </button>
              )}
            </div>
            <input type="text" value={typed} autoComplete="off" placeholder="Or search, like Labrador or Pug" onChange={(e) => setTyped(e.target.value)} />
            {matches.length > 0 && (
              <div className="chips chips-left">
                {matches.map((b) => (
                  <button
                    key={b.name}
                    className="chip"
                    onClick={() => {
                      setBreed(b);
                      setTyped("");
                    }}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <label className="profile-row">
          <span>Weight</span>
          <span className="profile-field profile-inline">
            <input
              type="number"
              inputMode="decimal"
              min={minKg}
              max={maxKg}
              step={0.5}
              value={kg}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v >= minKg && v <= maxKg) setKg(v);
              }}
            />
            kg
          </span>
        </label>

        <div className="profile-row">
          <span>Age</span>
          <div className="profile-field">
            <strong>{formatAge(months)} old</strong>
            <Slider value={age} onChange={setAge} left="Baby" right="Senior" label="Age" valueText={formatAge(months)} steps={AGE_STOPS.length - 1} />
          </div>
        </div>

        <div className="profile-row">
          <span>Boy or girl</span>
          <div className="chips chips-left">
            {(["boy", "girl"] as const).map((s) => (
              <button key={s} className="chip" aria-pressed={sex === s} onClick={() => setSex(s)}>
                {s === "boy" ? "Good boy" : "Good girl"}
              </button>
            ))}
          </div>
        </div>

        <div className="profile-row">
          <span>Eats</span>
          <div className="chips chips-left">
            {FOOD_CHOICES.map((b) => (
              <button key={b.id} className="chip" aria-pressed={foods.includes(b.id)} onClick={() => toggleFood(b.id)}>
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="profile-row">
          <span>Body</span>
          <div className="chips chips-left">
            {PROBLEMS.filter((p) => p.body).map((p) => (
              <button key={p.id} className="chip" aria-pressed={needs.includes(p.id)} onClick={() => setNeeds((now) => (now.includes(p.id) ? now.filter((x) => x !== p.id) : [...now, p.id]))}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="profile-row">
          <span>Needs help with</span>
          <div className="chips chips-left">
            {PROBLEMS.filter((p) => !p.body).map((p) => (
              <button key={p.id} className="chip" aria-pressed={needs.includes(p.id)} onClick={() => setNeeds((now) => (now.includes(p.id) ? now.filter((x) => x !== p.id) : [...now, p.id]))}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <button className="pill" onClick={onDone}>
        Show suggestions <span className="arrow" aria-hidden />
      </button>
    </div>
  );
}
