"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Breed } from "@/lib/flow";
import { formatAge } from "@/lib/flow";
import { ACTIVITIES, CALM, CHECKED, HOUSE_RULES, KINDS, NEUTER_FOR, PROBLEMS, STORES, TOILET, WHY, neuterNote, pickProducts, type KindId, type ProblemId, type Product, type Sex } from "@/lib/content";
import { Face } from "./Faces";
import { Logo } from "./Logo";
import { BallIcon, ChewIcon, SniffIcon, WalkIcon } from "./Icons";

// The suggestions page. It reads like the end of a consultation, in three
// parts that answer the owner's three questions:
//   What's good for my dog?   a one-line answer, then why a walk is not enough
//   What do I need?           three kinds of things, what to look for, a few picks
//   How do I get more help?   edit the profile, what is still being written, shops
// Chewing and nipping also get the house rules; toilet accidents and marking
// get the toilet training guide.
// Only the sock trick animates on its own; everything else responds to taps
// and hovers, and each section fades in once. Styles are in globals.css under ".sugg".

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

// The sock trick on a loop: a flat sock, treats dropping in, then the sock
// rolling up into a ball with the treats inside. The written steps beside
// it light up in time.
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
      {/* the same sock, rolled up */}
      <g className="sock-roll">
        <circle cx="100" cy="96" r="30" fill="#ee5f3f" />
        <path d="M76 82 C88 70 112 70 124 82" fill="none" stroke="#f7f1e3" strokeWidth="5" strokeLinecap="round" />
        <path d="M100 96 m-14 0 a14 14 0 1 1 14 14 a8 8 0 1 1 -8 -8" fill="none" stroke="#c94a2e" strokeWidth="3.5" strokeLinecap="round" />
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
        <span className="product-more">
          {open ? "Close" : "How it helps"} <i className={`chev ${open ? "chev-up" : ""}`} aria-hidden />
        </span>
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
              {/* The sock trick is a home-made snuffle toy, so only those link to it. */}
              {p.kind === "sniff" && (
                <a className="pill pill-quiet" href="#diy">
                  Or make one for free
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// Toilet training: two ways in, picked with a switch, each a short numbered list.
function Toilet({ who, sex, marks }: { who: string; sex: Sex | null; marks: boolean }) {
  const [path, setPath] = useState(TOILET.paths[0].id);
  const chosen = TOILET.paths.find((p) => p.id === path)!;
  // "good boy" or "good girl" in the steps becomes just the right one when we know.
  const praise = (line: string) => (sex === "boy" ? line.replace(' or "good girl"', "") : sex === "girl" ? line.replace('"good boy" or ', "") : line);
  return (
    <Scene id="toilet" className="s-sec">
      <h2>{TOILET.title}</h2>
      <p className="s-lead">{TOILET.lead}</p>
      <div className="s-toilet">
        <div className="s-switch" role="tablist" aria-label={`How ${who} will go`}>
          {TOILET.paths.map((p) => (
            <button key={p.id} role="tab" aria-selected={p.id === path} onClick={() => setPath(p.id)}>
              {p.label}
            </button>
          ))}
        </div>
        <p className="s-muted">{chosen.forWho}</p>
        <AnimatePresence mode="wait">
          <motion.ol key={path} className="s-steps" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {chosen.steps.map((line, i) => (
              <li key={line}>
                <span className="s-num">0{i + 1}</span>
                <span>{praise(line)}</span>
              </li>
            ))}
          </motion.ol>
        </AnimatePresence>
        {marks && <p className="s-toilet-note">{TOILET.mark.text}</p>}
      </div>
      <a className="s-trainer" href={TOILET.trainer.url} target="_blank" rel="noreferrer">
        <span>
          <strong>Learn from a trainer: {TOILET.trainer.name}</strong>
          <span>{TOILET.trainer.line}</span>
        </span>
        <i className="chev chev-right" aria-hidden />
      </a>
    </Scene>
  );
}

const ICONS: Record<string, () => React.ReactNode> = { walk: WalkIcon, fetch: BallIcon, sniff: SniffIcon, chew: ChewIcon };

// Why a longer walk will not fix it: every activity side by side, scored
// on three things, so the answer is visible without tapping anything.
function Compare() {
  const heads = ["Tires the body", "Works the mind", "Calm afterwards"];
  return (
    <div className="s-compare" role="table" aria-label="What each activity does">
      <div className="s-row s-row-head" role="row">
        <span role="columnheader">Activity</span>
        {heads.map((h) => (
          <span key={h} role="columnheader">
            {h}
          </span>
        ))}
      </div>
      {ACTIVITIES.map((a) => {
        const Icon = ICONS[a.id];
        return (
          <div key={a.id} className={`s-row ${a.mood === "down" ? "is-good" : ""}`} role="row">
            <span className="s-act" role="cell">
              <span className="s-icon">
                <Icon />
              </span>
              <span>
                <strong>{a.label}</strong>
                <em>{a.title}</em>
              </span>
            </span>
            {[a.body, a.mind, a.calm].map((n, i) => (
              <span key={i} className="s-dots" role="cell" aria-label={`${heads[i]}: ${n} of 3`}>
                {[1, 2, 3].map((d) => (
                  <i key={d} className={d <= n ? "on" : ""} />
                ))}
              </span>
            ))}
          </div>
        );
      })}
    </div>
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
  const [open, setOpen] = useState<string | null>(null);
  const chosen = PROBLEMS.filter((p) => needs.includes(p.id));
  const calm = chosen.filter((p) => p.guide === "calm");
  const waiting = chosen.filter((p) => !p.guide);
  const toilet = chosen.some((p) => p.guide === "toilet");
  const rules = needs.includes("chew") || needs.includes("nip");
  const neuter = chosen.some((p) => NEUTER_FOR.includes(p.id)) ? neuterNote(sex, months) : null;
  const breedName = pet.face === "mixed" && pet.name.startsWith("Mixed") ? "Mixed breed" : pet.name;
  const who = name || "your dog";
  const Who = name || "Your dog";
  const meta = [`${formatAge(months)} old`, `${kg} kg${weightSure ? "" : " (a guess)"}`, sex === "boy" ? "Boy" : sex === "girl" ? "Girl" : null].filter(Boolean).join(" · ");
  const products = calm.length > 0 ? pickProducts(needs, months) : [];
  // Chewers see chews first; everyone else starts with sniffing.
  const order: KindId[] = needs.includes("chew") ? ["chew", "sniff", "puzzle"] : ["sniff", "puzzle", "chew"];
  const told = chosen.map((p) => p.label.toLowerCase());
  const toldText = told.length > 1 ? `${told.slice(0, -1).join(", ")} and ${told.at(-1)}` : told[0];
  const huft = products.some((p) => p.store === "huft");

  return (
    <div className="results sugg">
      <div className="results-bar">
        <Logo />
        <button className="linklike" onClick={onProfile}>
          {name || "Profile"} <i className="chev" aria-hidden />
        </button>
      </div>

      {/* 1. What's good for my dog: the answer, the dog it is for, and the plan at a glance */}
      <header className="s-top">
        <div className="s-top-text">
          <p className="s-kicker">{name ? `${name}'s plan` : "Your plan"}</p>
          {calm.length > 0 ? (
            <h1>
              {Who} needs work for the <span className="hl">nose</span>, not more for the <span className="dim">legs</span>.
            </h1>
          ) : toilet ? (
            <h1>
              {Who} can learn where to go, one <span className="hl">treat</span> at a time.
            </h1>
          ) : (
            <h1>Here's where we are with {who}.</h1>
          )}
          {toldText && (
            <p className="s-sub">
              You told us {who} {told.length === 1 ? "has this going on" : "has these going on"}: {toldText}.
            </p>
          )}
          <div className="s-top-actions">
            {(calm.length > 0 || toilet) && (
              <a className="pill" href={calm.length > 0 ? "#what" : "#toilet"}>
                {calm.length > 0 ? "See what helps" : "See the steps"} <span className="arrow arrow-down" aria-hidden />
              </a>
            )}
            <button className="linklike" onClick={onProfile}>
              Edit profile
            </button>
          </div>
        </div>
        <div className="s-id">
          <div className="s-id-face">
            <Face id={pet.face} />
          </div>
          <strong>{name || breedName}</strong>
          <span>{name ? breedName : null}</span>
          <span>{meta}</span>
        </div>
      </header>

      {calm.length > 0 && (
        <ol className="s-glance">
          {WHY.plan.map((step, i) => {
            const Icon = [WalkIcon, SniffIcon, ChewIcon][i];
            return (
              <li key={step.word}>
                <span className="s-icon">
                  <Icon />
                </span>
                <span className="s-num">0{i + 1}</span>
                <strong>{step.word}</strong>
                <span>{step.line}</span>
              </li>
            );
          })}
        </ol>
      )}

      {calm.length > 0 && (
        <>
          <Scene className="s-sec">
            <h2>Why a longer walk won't fix it</h2>
            <p className="s-lead">There is more than one kind of tired. A walk tires the body, and a fit dog bounces back. Sniffing and chewing tire the mind, and leave a dog calm.</p>
            <Compare />
          </Scene>

          {/* 2. What do I need */}
          <section className="s-sec" id="what">
            <h2>What will help</h2>
            <p className="s-lead">Three kinds of things. You do not need all of them. Start with one, and add another if it helps.</p>
            {order.map((id, i) => {
              const k = KINDS.find((x) => x.id === id)!;
              const shown = products.filter((p) => p.kind === id);
              if (shown.length === 0) return null;
              return (
                <Scene key={id} className="s-kind">
                  <div className="s-kind-head">
                    <span className="s-num">0{i + 1}</span>
                    <div>
                      <h3>{k.label}</h3>
                      <p>{k.lead}</p>
                    </div>
                    <ul className="s-look">
                      {k.lookFor.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="products">
                    {shown.map((p) => (
                      <ProductCard key={p.id} p={p} open={open === p.id} onToggle={() => setOpen(open === p.id ? null : p.id)} who={who} needs={needs} />
                    ))}
                  </div>
                </Scene>
              );
            })}
            <p className="s-note">
              Photos and prices from each store's own site, read on {CHECKED}. Check the store before you buy. We earn nothing from these links.
            </p>
          </section>

          <Scene id="diy" className="s-free">
            <div>
              <p className="s-kicker">A free DIY option</p>
              <h2>{CALM.diy.title}</h2>
              <ol>
                {CALM.diy.steps.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
              <p className="s-muted">{CALM.diy.caution}</p>
            </div>
            <Sock />
          </Scene>
        </>
      )}

      {rules && (
        <Scene className="s-sec">
          <h2>{HOUSE_RULES.title}</h2>
          <p className="s-lead">{HOUSE_RULES.lead}</p>
          <ol className="s-rules">
            {HOUSE_RULES.rules.map((r, i) => (
              <li key={r.word}>
                <span className="s-num">0{i + 1}</span>
                <strong>{r.word}</strong>
                <span>{r.line}</span>
                {"note" in r && r.note && <em>{r.note}</em>}
              </li>
            ))}
          </ol>
        </Scene>
      )}

      {toilet && <Toilet who={who} sex={sex} marks={needs.includes("mark")} />}

      {/* 3. How do I get more help */}
      <Scene className="s-sec">
        <h2>Need more help?</h2>
        <div className="s-help">
          <div className="s-help-card">
            <h3>Something else going on?</h3>
            <p>Add it to {name ? `${name}'s` : "the"} profile, or change anything we got wrong. The plan updates.</p>
            <button className="pill" onClick={onProfile}>
              Edit profile
            </button>
          </div>
          {waiting.length > 0 && (
            <div className="s-help-card">
              <h3>Coming soon</h3>
              <p>We are still writing guides for {waiting.map((p) => p.label.toLowerCase()).join(", ")}.</p>
            </div>
          )}
          {neuter && (
            <div className="s-help-card">
              <h3>About neutering</h3>
              <p>{neuter.text}</p>
            </div>
          )}
          {huft && (
            <div className="s-help-card">
              <h3>See things in person</h3>
              <p>{STORES.huft.name} has shops in many cities, if you would rather pick toys and chews in hand.</p>
              <a className="linklike" href={STORES.huft.shops} target="_blank" rel="noreferrer">
                Find your nearest <i className="chev chev-right" aria-hidden />
              </a>
            </div>
          )}
        </div>
      </Scene>

      <footer className="s-foot">
        <p>General guidance, not a diagnosis. For anything about health, check with your vet. Pet Buddha carries no ads and earns no commission.</p>
        <button className="linklike" onClick={onRestart}>
          Start over
        </button>
      </footer>
    </div>
  );
}
