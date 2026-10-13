"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Breed } from "@/lib/flow";
import { formatAge } from "@/lib/flow";
import { ACTIVITIES, CALM, CHECKED, KINDS, NEUTER_FOR, PROBLEMS, STORES, WHY, neuterNote, pickProducts, type KindId, type ProblemId, type Product, type Sex } from "@/lib/content";
import type { FaceId } from "@/lib/flow";
import { Face } from "./Faces";
import { Doing } from "./Doing";

// The suggestions page teaches first and suggests second:
//   1. Why a walk alone will not calm a dog (tap each activity to compare).
//   2. What to do instead, in three steps.
//   3. What to look for in each kind of toy or chew, with a few picks from
//      different stores. Each pick opens to explain itself.
// The free alternative and the cautions follow. A bar along the top fills
// as you scroll. All the words come from
// lib/content.ts. Styles are in globals.css under ".results".

// Text Claude drafted is still marked `draft: true` in lib/content.ts, for
// Meghna's own review. The tag is not shown on the page.
function Draft(_: { on?: boolean }) {
  return null;
}

// A section that rises into place the first time it is scrolled to.
function Scene({ className = "", id, children }: { className?: string; id?: string; children: React.ReactNode }) {
  return (
    <motion.section id={id} className={`scene ${className}`} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ type: "spring", stiffness: 90, damping: 16 }}>
      {children}
    </motion.section>
  );
}

// Tabs for switching between views of the same thing (not filters): plain
// words on a line, with a marker that slides under the chosen one.
function Tabs<T extends string>({ id, items, value, onChange }: { id: string; items: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="tabs" role="tablist">
      {items.map((x) => (
        <button key={x.id} role="tab" aria-selected={x.id === value} className="tab" onClick={() => onChange(x.id)}>
          {x.label}
          {x.id === value && <motion.span layoutId={`tab-${id}`} className="tab-line" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
        </button>
      ))}
    </div>
  );
}

// The sock trick as a four-beat loop, in step with the written steps beside it.
function Sock() {
  return (
    <svg viewBox="0 0 200 150" className="sock" aria-hidden>
      <g className="sock-body">
        <path d="M70 20 h44 v62 c0 10 6 14 16 16 l22 4 c16 3 18 24 2 26 h-58 c-16 0 -26 -10 -26 -26 Z" fill="#ee5f3f" />
        <path d="M70 20 h44 v16 h-44 Z" fill="#f7f1e3" />
        <path d="M70 46 h44 M70 58 h44" stroke="#f7f1e3" strokeWidth="4" />
      </g>
      {[0, 1, 2].map((i) => (
        <circle key={i} className="sock-treat" cx={84 + i * 9} cy="6" r="5" fill="#a8552c" style={{ "--i": i } as React.CSSProperties} />
      ))}
      <g className="sock-nose">
        <ellipse cx="0" cy="0" rx="13" ry="10" fill="#211e1c" />
        <path d="M-22 4 q-7 4 -5 11 M-16 12 q-5 5 -1 10" fill="none" stroke="#211e1c" strokeWidth="2.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// One product. Closed, it is a photo, a name, a price and one line. Tapping it
// opens it across the full width with the reason, the first steps and the caution.
function ProductCard({ p, open, onToggle, who, needs }: { p: Product; open: boolean; onToggle: () => void; who: string; needs: ProblemId[] }) {
  const warn = p.notFor && needs.includes(p.notFor.problem) ? p.notFor.note : null;
  return (
    <motion.article layout className={`product ${open ? "is-open" : ""}`} transition={{ type: "spring", stiffness: 200, damping: 26 }}>
      <motion.button layout="position" className="product-top" onClick={onToggle} aria-expanded={open}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={`${p.name}, photo from ${STORES[p.store].name}`} loading="lazy" />
        <span className="product-name">
          <strong>{p.name}</strong>
          <span>{p.price}</span>
        </span>
        <span className="product-store">{STORES[p.store].name}</span>
        <span className="product-plain">{p.plain}</span>
        <span className="product-more">{open ? "Close" : "How it helps"}</span>
      </motion.button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="product-body" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div>
              <h3>
                Why it helps {who} <Draft on={p.draft} />
              </h3>
              <p>{p.why}</p>
              {warn && (
                <p className="caution">
                  <strong>Heads up.</strong> {warn}
                </p>
              )}
            </div>
            <div>
              <h3>How to start</h3>
              <ol className="beats">
                {p.start.map((line, i) => (
                  <li key={line} style={{ "--i": i, "--n": p.start.length } as React.CSSProperties}>
                    {line}
                  </li>
                ))}
              </ol>
            </div>
            <p className="caution">
              <strong>Watch out.</strong> {p.caution}
            </p>
            <div className="product-links">
              <a className="pill" href={STORES[p.store].url + p.path} target="_blank" rel="noreferrer">
                See it at the store <span className="arrow" aria-hidden />
              </a>
              <a className="pill pill-quiet" href="#diy">
                Or make one for free
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// How much of something, as three pips that fill.
function Pips({ label, level }: { label: string; level: number }) {
  return (
    <div className="pips">
      <span>{label}</span>
      <span className="pips-row" aria-label={`${level} out of 3`}>
        {[1, 2, 3].map((n) => (
          <motion.i key={n} initial={false} animate={{ scale: n <= level ? 1 : 0.55, backgroundColor: n <= level ? "#d9482a" : "rgba(33,30,28,0.14)" }} transition={{ type: "spring", stiffness: 300, damping: 18, delay: n * 0.05 }} />
        ))}
      </span>
    </div>
  );
}

// Why a walk alone will not do it. Tap an activity: the dog reacts, the
// three scales move, and the explanation changes.
function Why({ face }: { face: FaceId }) {
  const [at, setAt] = useState<string>("walk");
  const a = ACTIVITIES.find((x) => x.id === at)!;
  return (
    <section className="why">
      <h2>
        {WHY.title} <Draft on={WHY.draft} />
      </h2>
      <p>{WHY.lead}</p>
      <Tabs id="why" items={ACTIVITIES} value={at} onChange={setAt} />
      <div className={`why-panel is-${a.mood}`}>
        <div className="why-dog">
          <AnimatePresence mode="wait">
            <motion.div key={a.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.22 }}>
              <Doing what={a.id} face={face} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="why-text">
          <AnimatePresence mode="wait">
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </motion.div>
          </AnimatePresence>
          <div className="why-scales">
            <Pips label={WHY.scales[0]} level={a.body} />
            <Pips label={WHY.scales[1]} level={a.mind} />
            <Pips label={WHY.scales[2]} level={a.calm} />
          </div>
        </div>
      </div>
    </section>
  );
}

// What to look for in each kind of thing, then a few picks of that kind.
function Finder({ products, start, who, needs }: { products: Product[]; start: KindId; who: string; needs: ProblemId[] }) {
  const [kind, setKind] = useState<KindId>(start);
  const [open, setOpen] = useState<string | null>(null);
  const k = KINDS.find((x) => x.id === kind)!;
  const shown = products.filter((p) => p.kind === kind);
  const stores = [...new Set(shown.map((p) => p.store))];
  return (
    <section className="shop">
      <h2>What to look for</h2>
      <Tabs
        id="kind"
        items={KINDS}
        value={kind}
        onChange={(v) => {
          setKind(v);
          setOpen(null);
        }}
      />
      <div className="look">
        <div>
          <h3>
            {k.lead} <Draft on={k.draft} />
          </h3>
          <ul className="ticks">
            {k.lookFor.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="shop-note">
        A few that fit, from{" "}
        {stores.map((id, i) => (
          <span key={id}>
            {i > 0 && (i === stores.length - 1 ? " and " : ", ")}
            <a href={STORES[id].url} target="_blank" rel="noreferrer">
              {STORES[id].name}
            </a>
          </span>
        ))}
        . Tap one to see how it helps. Prices read from their sites on {CHECKED}, so check the store. We earn nothing from these links.
      </p>
      <div className="products">
        {shown.map((p) => (
          <ProductCard key={p.id} p={p} open={open === p.id} onToggle={() => setOpen(open === p.id ? null : p.id)} who={who} needs={needs} />
        ))}
      </div>
      {stores.includes("huft") && (
        <p className="shop-note shop-visit">
          Prefer to see things in person? {STORES.huft.name} has shops in many cities.{" "}
          <a href={STORES.huft.shops} target="_blank" rel="noreferrer">
            Find your nearest one
          </a>
          .
        </p>
      )}
    </section>
  );
}

export function Results({
  pet,
  name,
  months,
  kg,
  weightSure,
  sex,
  needs,
  onProfile,
  onRestart,
}: {
  pet: Breed;
  name: string;
  months: number;
  kg: number;
  weightSure: boolean;
  sex: Sex | null;
  needs: ProblemId[];
  onProfile: () => void;
  onRestart: () => void;
}) {
  const chosen = PROBLEMS.filter((p) => needs.includes(p.id));
  const calm = chosen.filter((p) => p.guide === "calm").map((p) => p.id);
  const waiting = chosen.filter((p) => !p.guide);
  const neuter = chosen.some((p) => NEUTER_FOR.includes(p.id)) ? neuterNote(sex, months) : null;
  const breedName = pet.face === "mixed" && pet.name.startsWith("Mixed") ? "dog" : pet.name;
  const who = name || `your ${breedName}`;
  const facts = [`${formatAge(months)} old`, `${kg} kg${weightSure ? "" : " (a guess)"}`, sex === "boy" ? "Boy" : sex === "girl" ? "Girl" : null].filter(Boolean);
  const products = calm.length > 0 ? pickProducts(needs, months) : [];

  return (
    <div className="results">
      <div className="results-bar">
        <span className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/art/buddha.png" alt="" draggable={false} />
          Pet Buddha
        </span>
        <button className="linklike" onClick={onProfile}>
          {name || "Profile"} <i className="chev" aria-hidden />
        </button>
      </div>

      <header className="results-head">
        <div className="results-pet">
          <Face id={pet.face} className="reactive" />
        </div>
        <div>
          <h1>{calm.length > 0 ? `Helping ${who} settle` : `For ${who}`}</h1>
          <div className="facts">
            {facts.map((f) => (
              <span key={f}>{f}</span>
            ))}
            {chosen.map((p) => (
              <span key={p.id} className="fact-need">
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      {calm.length > 0 && (
        <>
          <Why face={pet.face} />

          <Scene className="calm">
            <h2>So what should you do?</h2>
            <div className="calm-ends" aria-hidden>
              <span>Zoomies</span>
              <span>Settled</span>
            </div>
            <div className="calm-track" aria-hidden>
              <i />
            </div>
            <ol className="calm-steps">
              {WHY.plan.map((s) => (
                <li key={s.word}>
                  <strong>{s.word}</strong>
                  <span>{s.line}</span>
                </li>
              ))}
            </ol>
          </Scene>

          <Finder products={products} start={needs.includes("chew") ? "chew" : "sniff"} who={who} needs={needs} />

          <Scene id="diy" className="card card-diy card-lead">
            <div className="card-text">
              <h2>Or make one: {CALM.diy.title.toLowerCase()}</h2>
              <ol className="beats">
                {CALM.diy.steps.map((line, i) => (
                  <li key={line} style={{ "--i": i, "--n": CALM.diy.steps.length } as React.CSSProperties}>
                    {line}
                  </li>
                ))}
              </ol>
              <p className="caution">
                <strong>Watch out.</strong> {CALM.diy.caution}
              </p>
            </div>
            <Sock />
          </Scene>

        </>
      )}

      {neuter && (
        <Scene className="card card-vet">
          <h2>
            About neutering <Draft on={neuter.draft} />
          </h2>
          <p>{neuter.text}</p>
        </Scene>
      )}

      {waiting.length > 0 && (
        <Scene className="card card-soon">
          <h2>Still being written</h2>
          <div className="facts">
            {waiting.map((p) => (
              <span key={p.id}>{p.label}</span>
            ))}
          </div>
        </Scene>
      )}

      <Scene className="more">
        <h2>Need help with something else?</h2>
        <p>Open {name ? `${name}'s` : "the"} profile to tick more, or to change anything we got wrong.</p>
        <div className="row">
          <button className="pill" onClick={onProfile}>
            Open profile <span className="arrow" aria-hidden />
          </button>
          <button className="pill pill-quiet" onClick={onRestart}>
            Start over
          </button>
        </div>
      </Scene>

      <p className="small results-note">General guidance, not a diagnosis. For anything about health, check with your vet. Pet Buddha carries no ads and earns no commission.</p>
    </div>
  );
}
