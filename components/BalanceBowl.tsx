"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PRODUCTS, STORES, doseFor, type Bowl } from "@/lib/content";
import { BRANDS, FOODS, KINDS, NUTRIENTS, analyse, fixesFor, goalsFor, levelFor, food, guessKind, lineKey, startingBowl, valuesOf, type Kind, type Line } from "@/lib/balance";

// Balance the bowl: what the dog eats in a day, in grams, checked against
// what a dog needs. Pick from the shelf, type in anything else, and choose
// the brand of packaged food. The maths runs in the page from typical food
// values (lib/balance.ts). A rough guide, not a recipe.

const GROUPS = ["Meat and eggs", "Fish", "Grains and dal", "Dairy", "Veg and fruit", "Fats", "Packaged"] as const;

// One nutrient against its daily goal, in grams, like a food label for
// people. The bar fills towards the goal and changes colour: red when far
// off, amber when close, green once it's met. Starch is a limit: green
// while under it.
function Bar({ label, grams, goal, share, limit = false }: { label: string; grams: number; goal: number; share: number; limit?: boolean }) {
  const level = levelFor(grams, goal, limit);
  const fill = limit ? Math.min(100, (grams / (goal * 2 || 1)) * 100) : Math.min(100, (grams / (goal || 1)) * 100);
  const note = limit
    ? level === "good"
      ? "Under the limit"
      : level === "near"
        ? "Over the limit"
        : "Well over the limit"
    : level === "good"
      ? "Goal met"
      : level === "high"
        ? "More than needed"
        : level === "near"
          ? "Nearly there"
          : "Too low";
  return (
    <div className={`bb-bar is-${level}`}>
      <div className="bb-bar-top">
        <span>{label}</span>
        <strong>
          {grams} g <small>/ {limit ? "under " : ""}{goal} g</small>
        </strong>
      </div>
      <div className="bb-track">
        {/* For a limit, the goal sits halfway along the bar. */}
        {limit && <i className="bb-mark" style={{ left: "50%" }} aria-hidden />}
        <motion.span initial={false} animate={{ width: `${fill}%` }} transition={{ type: "spring", stiffness: 160, damping: 24 }} />
      </div>
      <span className="bb-target">
        <b>{note}.</b> {share}% of the day&apos;s calories.
      </span>
    </div>
  );
}

// "≈ 2 eggs" under countable foods.
function hint(l: Line) {
  if (l.id === "kibble" || l.id === "custom") return null;
  const f = food(l.id);
  if (!f.count) return null;
  const n = Math.round((l.grams / f.grams) * 2) / 2;
  if (!n) return null;
  // Eggshell powder reads better in teaspoons than in "half teaspoons".
  if (l.id === "eggshell") return `≈ ${n / 2} tsp`;
  return `≈ ${n} ${n === 1 ? f.unit : `${f.unit}s`}`;
}

// `preset` replaces the bowl, e.g. with the day's bowl from the diet chart;
// a new `key` loads it again.
export type Preset = { key: number; lines: [string, number][] };

export function BalanceBowl({ bowl, need, who, kg, preset }: { bowl: Bowl | null; need: number; who: string; kg: number; preset?: Preset | null }) {
  const [lines, setLines] = useState<Line[]>(() => startingBowl(bowl, need));
  useEffect(() => {
    if (preset) setLines(preset.lines.map(([id, grams]) => ({ key: lineKey(), id, grams })));
  }, [preset]);
  const [adding, setAdding] = useState(false);
  const [own, setOwn] = useState({ name: "", grams: "", kind: "veg" as Kind, touched: false });
  const r = useMemo(() => analyse(lines, need), [lines, need]);
  const goals = goalsFor(need);

  const update = (key: string, patch: Partial<Line>) => setLines((now) => now.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  const remove = (key: string) => setLines((now) => now.filter((l) => l.key !== key));
  const step = (l: Line) => (l.id !== "kibble" && l.id !== "custom" && food(l.id).count ? food(l.id).grams : 10);
  const nudge = (l: Line, dir: 1 | -1) => {
    const g = Math.max(0, l.grams + dir * step(l));
    if (g === 0) remove(l.key);
    else update(l.key, { grams: g });
  };
  const add = (id: string) =>
    setLines((now) => {
      const there = now.find((l) => l.id === id);
      if (there) return now.map((l) => (l === there ? { ...l, grams: l.grams + (id === "kibble" ? 50 : food(id).grams) } : l));
      return [...now, { key: lineKey(), id, grams: id === "kibble" ? 100 : food(id).grams, ...(id === "kibble" ? { brand: "typical" } : {}) }];
    });
  // A ready-made topper from a store: it counts for its nutrients, not calories.
  const addProduct = (id: string) => setLines((now) => (now.some((l) => l.product === id) ? now : [...now, { key: lineKey(), id: "product", grams: 1, product: id }]));
  const picked = lines.filter((l) => l.id === "product").map((l) => PRODUCTS.find((p) => p.id === l.product)!).filter(Boolean);

  const addOwn = () => {
    const g = Number(own.grams);
    if (!own.name.trim() || !g) return;
    setLines((now) => [...now, { key: lineKey(), id: "custom", grams: g, name: own.name.trim(), kind: own.kind }]);
    setOwn({ name: "", grams: "", kind: "veg", touched: false });
  };

  const kcalNote = !r.kcal ? "" : r.kcal > need * 1.15 ? "more than they need" : r.kcal < need * 0.85 ? "less than they need" : "about right";

  return (
    <div className="bb">
      {/* What's in the bowl */}
      <div className="bb-in">
        <p className="bb-label">In {who === "your dog" ? "the" : `${who}'s`} bowl, over a day</p>
        <ul className="bb-lines">
          <AnimatePresence initial={false}>
            {lines.map((l) => {
              const v = valuesOf(l);
              return (
                <motion.li key={l.key} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                  {l.id === "product" ? (
                    <div className="bb-row">
                      <span className="bb-name">
                        <strong>{v.name}</strong>
                        <span>
                          {STORES[PRODUCTS.find((p) => p.id === l.product)!.store].name}
                          {PRODUCTS.find((p) => p.id === l.product)?.dose && `, ${doseFor(PRODUCTS.find((p) => p.id === l.product)!.dose!, kg)}`}
                        </span>
                      </span>
                      <span className="bb-amount">
                        <button className="bb-remove" onClick={() => remove(l.key)} aria-label={`Remove ${v.name}`} title="Remove">
                          ×
                        </button>
                      </span>
                    </div>
                  ) : (
                  <div className="bb-row">
                    <span className="bb-name">
                      <strong>{l.id === "custom" ? l.name : v.name}</strong>
                      {l.id === "custom" && <span>Counted as {KINDS[l.kind ?? "veg"].label.toLowerCase()} (approximate)</span>}
                      {hint(l) && <span>{hint(l)}</span>}
                    </span>
                    <span className="bb-amount">
                      <button onClick={() => nudge(l, -1)} aria-label={`Less ${v.name}`}>
                        −
                      </button>
                      <label className="bb-grams">
                        <input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          value={l.grams}
                          onChange={(e) => update(l.key, { grams: Math.max(0, Number(e.target.value) || 0) })}
                          aria-label={`Grams of ${v.name}`}
                        />
                        <span>g</span>
                      </label>
                      <button onClick={() => nudge(l, 1)} aria-label={`More ${v.name}`}>
                        +
                      </button>
                      <button className="bb-remove" onClick={() => remove(l.key)} aria-label={`Remove ${v.name}`} title="Remove">
                        ×
                      </button>
                    </span>
                  </div>
                  )}

                  {/* Packaged food: which brand, or numbers from the bag. */}
                  {l.id === "kibble" && (
                    <div className="bb-brand">
                      <select
                        value={l.bag ? "bag" : l.brand}
                        onChange={(e) =>
                          e.target.value === "bag"
                            ? update(l.key, { bag: { protein: 25, fat: 14, fibre: 3, moisture: 10 }, brand: undefined })
                            : update(l.key, { brand: e.target.value, bag: undefined })
                        }
                        aria-label="Brand of packaged food"
                      >
                        {BRANDS.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                        <option value="bag">Enter from the bag</option>
                      </select>
                      {l.bag && (
                        <div className="bb-bag">
                          {(["protein", "fat", "fibre", "moisture"] as const).map((k) => (
                            <label key={k}>
                              <span>{k[0].toUpperCase() + k.slice(1)} %</span>
                              <input
                                type="number"
                                inputMode="decimal"
                                min={0}
                                max={100}
                                value={l.bag![k]}
                                onChange={(e) => update(l.key, { bag: { ...l.bag!, [k]: Math.max(0, Number(e.target.value) || 0) } })}
                              />
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
          {lines.length === 0 && <li className="bb-empty">The bowl is empty. Add what they eat in a day.</li>}
        </ul>

        <button className="bb-add" onClick={() => setAdding(!adding)} aria-expanded={adding}>
          {adding ? "Done adding" : "+ Add to the bowl"}
        </button>
        <AnimatePresence initial={false}>
          {adding && (
            <motion.div className="bb-shelf" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
              {GROUPS.map((g) => (
                <div key={g} className="bb-group">
                  <span className="bb-group-name">{g}</span>
                  <div className="bb-chips">
                    {FOODS.filter((f) => f.group === g).map((f) => (
                      <button key={f.id} className="chip" onClick={() => add(f.id)}>
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Anything else, typed in. */}
              <div className="bb-group bb-own">
                <span className="bb-group-name">Something else</span>
                <div className="bb-own-row">
                  <input
                    className="bb-own-name"
                    placeholder="e.g. boiled aloo"
                    value={own.name}
                    onChange={(e) => setOwn((o) => ({ ...o, name: e.target.value, kind: o.touched ? o.kind : guessKind(e.target.value) }))}
                    onKeyDown={(e) => e.key === "Enter" && addOwn()}
                    aria-label="What else they eat"
                  />
                  <label className="bb-grams">
                    <input type="number" inputMode="decimal" min={0} placeholder="0" value={own.grams} onChange={(e) => setOwn((o) => ({ ...o, grams: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && addOwn()} aria-label="Grams" />
                    <span>g</span>
                  </label>
                </div>
                <div className="bb-own-row">
                  <select value={own.kind} onChange={(e) => setOwn((o) => ({ ...o, kind: e.target.value as Kind, touched: true }))} aria-label="What it mostly is">
                    {(Object.keys(KINDS) as Kind[]).map((k) => (
                      <option key={k} value={k}>
                        Mostly {KINDS[k].label.toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <button className="pill" onClick={addOwn} disabled={!own.name.trim() || !Number(own.grams)}>
                    Add
                  </button>
                </div>
                <span className="bb-own-note">We use typical values for that kind of food, so it&apos;s an approximation.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* How it stacks up */}
      <div className="bb-out" aria-live="polite">
        <p className="bb-label">How it stacks up</p>
        <div className="bb-kcal">
          <strong>{r.kcal}</strong>
          <span>
            calories a day, {kcalNote}. {who === "your dog" ? "They need" : `${who} needs`} about {need}.
          </span>
        </div>

        <Bar label="Protein" grams={r.grams.protein} goal={goals.protein} share={r.protein} />
        <Bar label="Fat" grams={r.grams.fat} goal={goals.fat} share={r.fat} />
        <Bar label="Starch" grams={r.grams.starch} goal={goals.starch} share={r.starch} limit />
        <p className="bb-goal-note">Goals for {who === "your dog" ? "your dog" : who}: about half the calories from protein and half from fat, with starch under a tenth.</p>

        {r.missing.length > 0 ? (
          <div className="bb-missing">
            <span className="bb-sub">Missing or low</span>
            <ul>
              {r.missing.map((n) => {
                const fix = fixesFor(n);
                return (
                  <li key={n}>
                    <strong>{NUTRIENTS[n].label}</strong>
                    <span>{NUTRIENTS[n].why}</span>
                    <div className="bb-fix">
                      <span className="bb-fix-label">Fix it</span>
                      <button className="bb-fix-home" onClick={() => add(fix.home.id)}>
                        <span>+ Add {fix.home.name.toLowerCase().replace(/ \(.*\)/, "")}</span>
                        <small>from your kitchen</small>
                      </button>
                      {fix.ready.map((p) => (
                        <div key={p.id} className={`bb-fix-item ${p.soldOut ? "is-out" : ""}`}>
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image} alt="" loading="lazy" />
                          ) : (
                            <span className="bb-fix-noimg" aria-hidden />
                          )}
                          <span className="bb-fix-name">
                            <strong>{p.name}</strong>
                            <small>
                              {STORES[p.store].name} · {p.price}
                              {p.soldOut && " · check stock"}
                            </small>
                          </span>
                          <button className="bb-fix-add" onClick={() => addProduct(p.id)}>
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="bb-good">No key nutrient gaps that we can see.</p>
        )}

        {r.swaps.length > 0 && (
          <div className="bb-swaps">
            <span className="bb-sub">Easy fixes</span>
            <ol>
              {r.swaps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        )}
        {picked.length > 0 && (
          <div className="bb-list">
            <span className="bb-sub">Your shopping list</span>
            <ul>
              {picked.map((p) => (
                <li key={p.id}>
                  <span>
                    <strong>{p.name}</strong>
                    <small>
                      {STORES[p.store].name} · {p.price}
                      {p.dose && ` · ${doseFor(p.dose, kg)}`}
                    </small>
                  </span>
                  <a className="pill" href={STORES[p.store].url + p.path} target="_blank" rel="noreferrer">
                    Buy <span className="arrow" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {lines.some((l) => l.id === "kibble") && (
          <p className="bb-fine">Packaged food is fortified, so it covers the basic nutrients on paper. The starch and the heavy processing are what fresh food fixes.</p>
        )}
      </div>

      <p className="bb-fine bb-foot">
        A rough guide from typical food values and brand labels, not a recipe. Brands change their recipes, so check your bag. For a complete home-made diet, use a formulated recipe or ask a canine nutritionist.
      </p>
    </div>
  );
}
