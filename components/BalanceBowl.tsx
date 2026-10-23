"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Bowl } from "@/lib/content";
import { BRANDS, FOODS, KINDS, NUTRIENTS, analyse, food, guessKind, lineKey, startingBowl, valuesOf, type Kind, type Line } from "@/lib/balance";

// Balance the bowl: what the dog eats in a day, in grams, checked against
// what a dog needs. Pick from the shelf, type in anything else, and choose
// the brand of packaged food. The maths runs in the page from typical food
// values (lib/balance.ts). A rough guide, not a recipe.

const GROUPS = ["Meat and eggs", "Fish", "Grains and dal", "Dairy", "Veg and fruit", "Fats", "Packaged"] as const;

function Bar({ label, value, target, good }: { label: string; value: number; target: string; good: boolean }) {
  return (
    <div className="bb-bar">
      <div className="bb-bar-top">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="bb-track">
        <motion.span className={good ? "is-good" : "is-off"} initial={false} animate={{ width: `${Math.min(100, value)}%` }} transition={{ type: "spring", stiffness: 160, damping: 24 }} />
      </div>
      <span className="bb-target">{target}</span>
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
  return `≈ ${n} ${n === 1 ? f.unit : `${f.unit}s`}`;
}

export function BalanceBowl({ bowl, need, who }: { bowl: Bowl | null; need: number; who: string }) {
  const [lines, setLines] = useState<Line[]>(() => startingBowl(bowl, need));
  const [adding, setAdding] = useState(false);
  const [own, setOwn] = useState({ name: "", grams: "", kind: "veg" as Kind, touched: false });
  const r = useMemo(() => analyse(lines, need), [lines, need]);

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

        <Bar label="Protein" value={r.protein} target="Aim for about half" good={r.protein >= 35} />
        <Bar label="Fat" value={r.fat} target="Aim for about half" good={r.fat >= 30} />
        <Bar label="Starch" value={r.starch} target="Keep under 10%, up to 20% if very active" good={r.starch <= 20} />

        {r.missing.length > 0 ? (
          <div className="bb-missing">
            <span className="bb-sub">Missing or low</span>
            <ul>
              {r.missing.map((n) => (
                <li key={n}>
                  <strong>{NUTRIENTS[n].label}</strong>
                  <span>{NUTRIENTS[n].why}</span>
                </li>
              ))}
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
