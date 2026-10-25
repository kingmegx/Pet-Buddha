"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PRODUCTS, STORES, doseFor, type Bowl } from "@/lib/content";
import { BRANDS, FOODS, KINDS, NUTRIENTS, analyse, fixesFor, goalsFor, levelFor, food, guessKind, lineKey, startingBowl, valuesOf, type Kind, type Line } from "@/lib/balance";

// Balance the bowl: what the dog eats in a day, in grams, checked against
// what a dog needs. Pick from the shelf, type in anything else, and choose
// the brand of packaged food. The maths runs in the page from typical food
// values (lib/balance.ts). A rough guide, not a recipe.

// Store supplements for the shelf: the kinds that go in or on food.
const SUPPLEMENTS = PRODUCTS.filter((p) => ["gaps", "inside", "joints", "gut", "picky", "slim"].includes(p.kind) && !p.soldOut);
// Grouped by what they're for, so the shelf stays easy to scan.
const SUPPLEMENT_GROUPS: [string, string[]][] = [
  ["Supplements: everyday gaps", ["gaps"]],
  ["Supplements: skin and coat", ["inside"]],
  ["Supplements: joints", ["joints"]],
  ["Supplements: gut", ["gut"]],
  ["Supplements: fussy eaters and weight", ["picky", "slim"]],
];

// Foods people count rather than weigh: [one, many].
const BY_COUNT: Record<string, [string, string]> = { egg: ["egg", "eggs"], roti: ["roti", "rotis"] };

const GROUPS = ["Meat and eggs", "Fish", "Grains and dal", "Dairy", "Veg and fruit", "Fats", "Packaged"] as const;

// One nutrient against its daily goal, in grams, like a food label for
// people. The bar fills towards the goal and changes colour: red when far
// off, amber when close, green once it's met. Starch is a limit: green
// while under it.
type Fix = { label: string; run: () => void };

function Bar({ label, grams, goal, share, limit = false, fixes = [] }: { label: string; grams: number; goal: number; share: number; limit?: boolean; fixes?: Fix[] }) {
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
      {/* One tap to close the gap, sized to it. */}
      {(level === "low" || level === "near" || (limit && level !== "good")) && fixes.length > 0 && (
        <div className="bb-barfix">
          <span>Fix it</span>
          {fixes.map((f) => (
            <button key={f.label} onClick={f.run}>
              {f.label}
            </button>
          ))}
        </div>
      )}
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

  // Add grams of a food: to its line if it's there, or as a new line.
  const addGrams = (id: string, grams: number) =>
    setLines((now) => (now.some((l) => l.id === id) ? now.map((l) => (l.id === id ? { ...l, grams: l.grams + grams } : l)) : [...now, { key: lineKey(), id, grams }]));
  const kcalPerG = (id: string) => {
    const f = food(id);
    return (f.protein * 3.5 + f.fat * 8.5 + (f.starchy ? f.carbs * 3.5 : 0)) / 100;
  };
  const r10 = (x: number) => Math.max(10, Math.round(x / 10) * 10);

  // Fixes for each bar, sized to what's missing.
  const fatShort = Math.max(0, goals.fat - r.grams.fat);
  const proteinShort = Math.max(0, goals.protein - r.grams.protein);
  const breast = lines.find((l) => l.id === "chicken");
  const fatFixes: Fix[] = [
    ...(breast ? [{ label: "Swap chicken breast for thigh", run: () => setLines((now) => now.map((l) => (l.id === "chicken" ? { ...l, id: "thigh" } : l))) }] : []),
    // Whole foods first, then a little ghee.
    { label: "+ Add 1 egg", run: () => addGrams("egg", 50) },
    { label: "+ Add 1 sardine", run: () => addGrams("sardine", 25) },
    { label: `+ Add ${Math.min(3, Math.max(1, Math.ceil(fatShort / 5)))} tsp ghee or coconut oil`, run: () => addGrams("ghee", Math.min(3, Math.max(1, Math.ceil(fatShort / 5))) * 5) },
  ];
  const proteinFixes: Fix[] = [
    { label: `+ Add ${Math.min(300, r10(proteinShort / 0.26))} g chicken thigh`, run: () => addGrams("thigh", Math.min(300, r10(proteinShort / 0.26))) },
    { label: "+ Add 1 egg", run: () => addGrams("egg", 50) },
    { label: `+ Add ${Math.min(300, r10(proteinShort / 0.27))} g mutton`, run: () => addGrams("mutton", Math.min(300, r10(proteinShort / 0.27))) },
  ];
  // Too much starch: halve the biggest starchy food, or swap half of it for
  // the same calories of chicken thigh.
  const starchy = [...lines].filter((l) => l.id !== "product" && valuesOf(l).starchy).sort((a, b) => b.grams - a.grams)[0];
  const starchName = starchy ? (starchy.id === "kibble" ? "packaged food" : valuesOf(starchy).name.toLowerCase().replace(/, cooked/, "")) : "";
  const swapG = starchy && starchy.id !== "kibble" && starchy.id !== "custom" ? r10(((starchy.grams / 2) * kcalPerG(starchy.id)) / kcalPerG("thigh")) : 0;
  const starchFixes: Fix[] = starchy
    ? [
        { label: `Halve the ${starchName}`, run: () => setLines((now) => now.map((l) => (l.key === starchy.key ? { ...l, grams: Math.round(l.grams / 2) } : l))) },
        ...(swapG
          ? [
              {
                label: `Swap half the ${starchName} for ${swapG} g chicken thigh`,
                run: () => {
                  setLines((now) => now.map((l) => (l.key === starchy.key ? { ...l, grams: Math.round(l.grams / 2) } : l)));
                  addGrams("thigh", swapG);
                },
              },
            ]
          : []),
      ]
    : [];

  const update = (key: string, patch: Partial<Line>) => setLines((now) => now.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  const remove = (key: string) => setLines((now) => now.filter((l) => l.key !== key));
  // Counted foods step one at a time; the rest by 10 g (or by their small
  // serving, like eggshell powder). Minus stops at 0; only × removes a row.
  const step = (l: Line) => {
    if (l.id === "kibble" || l.id === "custom") return 10;
    if (BY_COUNT[l.id]) return food(l.id).grams;
    return Math.min(10, food(l.id).grams);
  };
  const nudge = (l: Line, dir: 1 | -1) => update(l.key, { grams: Math.max(0, Math.round((l.grams + dir * step(l)) * 10) / 10) });
  const add = (id: string) =>
    setLines((now) => {
      const there = now.find((l) => l.id === id);
      if (there) return now.map((l) => (l === there ? { ...l, grams: l.grams + (id === "kibble" ? 50 : food(id).grams) } : l));
      return [...now, { key: lineKey(), id, grams: id === "kibble" ? 100 : food(id).grams, ...(id === "kibble" ? { brand: "typical" } : {}) }];
    });
  // A ready-made topper from a store: it counts for its nutrients, not calories.
  // From the shelf: something they already give. From a fix: a suggestion to buy.
  const addProduct = (id: string, suggested = false) => setLines((now) => (now.some((l) => l.product === id) ? now : [...now, { key: lineKey(), id: "product", grams: 1, product: id, suggested }]));
  const picked = lines.filter((l) => l.id === "product" && l.suggested).map((l) => PRODUCTS.find((p) => p.id === l.product)!).filter(Boolean);

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
                      {!BY_COUNT[l.id] && hint(l) && <span>{hint(l)}</span>}
                    </span>
                    <span className="bb-amount">
                      <button onClick={() => nudge(l, -1)} aria-label={`Less ${v.name}`}>
                        −
                      </button>
                      {BY_COUNT[l.id] ? (
                        // Eggs, roti and sardines in pieces, not grams.
                        <label className="bb-grams is-count">
                          <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            value={Math.round(l.grams / food(l.id).grams)}
                            onChange={(e) => update(l.key, { grams: Math.max(0, Math.round(Number(e.target.value) || 0)) * food(l.id).grams })}
                            aria-label={`Number of ${BY_COUNT[l.id][1]}`}
                          />
                          <span>{Math.round(l.grams / food(l.id).grams) === 1 ? BY_COUNT[l.id][0] : BY_COUNT[l.id][1]}</span>
                        </label>
                      ) : (
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
                      )}
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
                      <button key={f.id} className="chip" onClick={() => add(f.id)} aria-pressed={lines.some((l) => l.id === f.id)}>
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Supplements from the stores: they count for their nutrients and go on the shopping list. */}
              {SUPPLEMENT_GROUPS.map(([label, kinds]) => (
                <div key={label} className="bb-group">
                  <span className="bb-group-name">{label}</span>
                  <div className="bb-chips">
                    {SUPPLEMENTS.filter((p) => kinds.includes(p.kind)).map((p) => (
                      <button key={p.id} className="chip" onClick={() => addProduct(p.id)} aria-pressed={lines.some((l) => l.product === p.id)}>
                        {p.name}
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

        <Bar label="Protein" grams={r.grams.protein} goal={goals.protein} share={r.protein} fixes={proteinFixes} />
        <Bar label="Fat" grams={r.grams.fat} goal={goals.fat} share={r.fat} fixes={fatFixes} />
        <Bar label="Starch" grams={r.grams.starch} goal={goals.starch} share={r.starch} limit fixes={starchFixes} />
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
                          <button className="bb-fix-add" onClick={() => addProduct(p.id, true)}>
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
            <span className="bb-sub">To buy, from our suggestions</span>
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
