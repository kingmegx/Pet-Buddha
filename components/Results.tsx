"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Breed } from "@/lib/flow";
import { formatAge } from "@/lib/flow";
import { ACTIVITIES, BOWLS, CALM, CHECKED, HOUSE_RULES, KINDS, NEUTER_FOR, PROBLEMS, STORES, TOILET, neuterNote, pickProducts, type Bowl, type KindId, type ProblemId, type Product, type Sex } from "@/lib/content";
import { BALANCE, BODY_TIPS, BOWL_NOTE, EXPERTS, FOOD_CREDIT, FOOD_TIPS, LADDER, LADDER_START, WALK_TIPS, expert, groupsFor, weekPlan, type Expert, type Group, type GroupId, type Tip } from "@/lib/plan";
import { Face } from "./Faces";
import { Logo } from "./Logo";
import { BallIcon, ChewIcon, SniffIcon, WalkIcon } from "./Icons";

// The suggestions page, built to be scanned, top to bottom:
//   1. The "aha": one line that reframes the problem, and the dog it is for.
//   2. Three things to start with.
//   3. The plan, in tabs of related problems (only the tabs that apply,
//      plus Food for everyone). Each tab: the aha, short tips, what not to
//      do, when to get help, and the people to follow for it.
//   4. More help: the profile, shops, adoption, and everyone we recommend.
// Content lives in lib/content.ts (Meghna's own advice, products) and
// lib/plan.ts (the tabs, tips and people). Styles are under ".sugg".

// A section that rises into place the first time it is scrolled to.
function Scene({ className = "", id, children }: { className?: string; id?: string; children: React.ReactNode }) {
  return (
    <motion.section id={id} className={`scene ${className}`} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ type: "spring", stiffness: 90, damping: 16 }}>
      {children}
    </motion.section>
  );
}

// Text Claude drafted is still marked `draft: true` in lib/content.ts, for
// Meghna's own review. The tag is not shown on the page.
function Draft(_: { on?: boolean }) {
  return null;
}

// Short tips: a bold few words, then one line. Numbered, in a grid.
function Tips({ tips, start = 0 }: { tips: Tip[]; start?: number }) {
  return (
    <ol className="s-tips">
      {tips.map((tip, i) => (
        <li key={tip.t} style={{ "--i": i } as React.CSSProperties}>
          <span className="s-num">{String(start + i + 1).padStart(2, "0")}</span>
          <strong>{tip.t}</strong>
          <span>{tip.d}</span>
        </li>
      ))}
    </ol>
  );
}

// One person or brand we recommend: who, what they offer, and where to find them.
function ExpertCard({ e }: { e: Expert }) {
  return (
    <article className="s-expert">
      <span className="s-expert-kind">{e.kind}</span>
      <strong>{e.name}</strong>
      <span className="s-expert-what">{e.what}</span>
      {e.where && <span className="s-expert-where">{e.where}</span>}
      <span className="s-expert-links">
        {e.insta && (
          <a href={e.insta} target="_blank" rel="noreferrer">
            {e.handle}
          </a>
        )}
        {e.site && (
          <a href={e.site} target="_blank" rel="noreferrer">
            {e.insta ? "Website" : e.handle}
          </a>
        )}
      </span>
    </article>
  );
}

// A tab's people: four at first, the rest on request, so the list stays scannable.
function Experts({ ids }: { ids: string[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? ids : ids.slice(0, 4);
  return (
    <>
      <div className="s-experts">
        {shown.map((id) => (
          <ExpertCard key={id} e={expert(id)} />
        ))}
      </div>
      {ids.length > 4 && (
        <button className="linklike s-more" onClick={() => setAll(!all)}>
          {all ? "Show fewer" : `Show ${ids.length - 4} more`} <i className={`chev ${all ? "chev-up" : ""}`} aria-hidden />
        </button>
      )}
    </>
  );
}

// What not to do, and when to get help: the same two boxes on every tab.
function Careful({ g }: { g: Group }) {
  return (
    <div className="s-careful">
      <p className="s-avoid">
        <strong>Don't.</strong> {g.avoid}
      </p>
      {g.help && (
        <p className="s-gethelp">
          <strong>When to get help.</strong> {g.help}
        </p>
      )}
    </div>
  );
}

// The fresh food ladder: four steps from toppers to all fresh. Picking a step
// fills the bar up to it and shows what to do there.
function Ladder({ start }: { start: string }) {
  const [rung, setRung] = useState(start);
  const at = LADDER.findIndex((r) => r.id === rung);
  const r = LADDER[at];
  return (
    <div className="s-ladder">
      <div className="s-rungs" role="tablist" aria-label="How much fresh food">
        <motion.span className="s-rung-fill" initial={false} animate={{ width: `${((at + 1) / LADDER.length) * 100}%` }} transition={{ type: "spring", stiffness: 220, damping: 28 }} />
        {LADDER.map((x, i) => (
          <button key={x.id} role="tab" aria-selected={x.id === rung} className={i <= at ? "is-in" : ""} onClick={() => setRung(x.id)}>
            <strong>{x.share}</strong>
            <span>{x.label}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={rung} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          <Tips tips={r.tips} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// A heading inside a tab.
function Sub({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="s-subhead">
      <h3>{children}</h3>
      {note && <p>{note}</p>}
    </div>
  );
}
// The sock trick on a loop: a flat sock, treats dropping in, then the sock
// rolling up into a ball with the treats inside.
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

// Toilet training: two ways in, picked with a switch, each a short numbered list.
function Toilet({ sex, marks }: { sex: Sex | null; marks: boolean }) {
  const [path, setPath] = useState(TOILET.paths[0].id);
  const chosen = TOILET.paths.find((p) => p.id === path)!;
  // "good boy" or "good girl" in the steps becomes just the right one when we know.
  const praise = (line: string) => (sex === "boy" ? line.replace(' or "good girl"', "") : sex === "girl" ? line.replace('"good boy" or ', "") : line);
  return (
    <div className="s-toilet">
      <div className="s-switch" role="tablist" aria-label="How they will go">
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
  );
}

// Why a longer walk won't fix it, folded away until asked for.
function WhyWalk() {
  const [open, setOpen] = useState(false);
  return (
    <div className={`s-fold ${open ? "is-open" : ""}`}>
      <button className="s-fold-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>
          <strong>Why won't a longer walk fix it?</strong>
          <span>A walk tires the body. Sniffing and chewing tire the mind.</span>
        </span>
        <i className={`chev ${open ? "chev-up" : ""}`} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
            <Compare />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TAB_ICONS: Partial<Record<GroupId, () => React.ReactNode>> = { energy: SniffIcon, walks: WalkIcon };

export function Results({
  pet,
  name,
  months,
  kg,
  weightSure,
  sex,
  needs,
  bowl,
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
  bowl: Bowl | null;
  onProfile: () => void;
  onRestart: () => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const groups = groupsFor(needs);
  const [tab, setTab] = useState<GroupId>(groups[0].id);
  const g = groups.find((x) => x.id === tab) ?? groups[0];
  const tabsRef = useRef<HTMLDivElement>(null);

  const who = name || "your dog";
  const Who = name || "Your dog";
  const fill = (s: string) => s.replaceAll("{who}", Who);
  const lead = groups[0];
  const breedName = pet.face === "mixed" && pet.name.startsWith("Mixed") ? "Mixed breed" : pet.name;
  const meta = [`${formatAge(months)} old`, `${kg} kg${weightSure ? "" : " (a guess)"}`, sex === "boy" ? "Boy" : sex === "girl" ? "Girl" : null].filter(Boolean).join(" · ");
  const bowlName = BOWLS.find((b) => b.id === bowl)?.label;
  const chosen = PROBLEMS.filter((p) => needs.includes(p.id));
  const neuter = chosen.some((p) => NEUTER_FOR.includes(p.id)) ? neuterNote(sex, months) : null;

  // Energy tab: the three kinds of things, chews first for chewers.
  const products = pickProducts(needs, months);
  const order: KindId[] = needs.includes("chew") || needs.includes("nip") ? ["chew", "sniff", "puzzle"] : ["sniff", "puzzle", "chew"];
  const rules = needs.includes("chew") || needs.includes("nip");

  const week = weekPlan(groups, bowl);

  // Keep the chosen tab visible in the tab row when it scrolls sideways (phones).
  useEffect(() => {
    const row = tabsRef.current;
    const btn = row?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!row || !btn) return;
    const left = btn.offsetLeft - row.offsetLeft;
    if (left < row.scrollLeft || left + btn.offsetWidth > row.scrollLeft + row.clientWidth) row.scrollTo({ left: left - 16, behavior: "smooth" });
  }, [tab]);

  const showTab = (id: GroupId) => {
    setTab(id);
    setOpen(null);
    // Bring the start of the tab into view if the reader is further down.
    const top = tabsRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.6) tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const told = chosen.map((p) => p.label.toLowerCase());

  return (
    <div className="results sugg">
      <div className="results-bar">
        <Logo />
        <button className="linklike" onClick={onProfile}>
          {name || "Profile"} <i className="chev" aria-hidden />
        </button>
      </div>

      {/* 1. The aha */}
      <header className="s-top">
        <div className="s-top-text">
          <p className="s-kicker">{name ? `${name}'s plan` : "Your plan"}</p>
          <h1>{fill(lead.aha)}</h1>
          <p className="s-sub">{lead.why}</p>
          <div className="s-top-actions">
            <a className="pill" href="#plan">
              See the plan <span className="arrow arrow-down" aria-hidden />
            </a>
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
          {told.length > 0 && (
            <ul className="s-id-tags">
              {chosen.slice(0, 4).map((p) => (
                <li key={p.id}>{p.label}</li>
              ))}
              {chosen.length > 4 && <li>+{chosen.length - 4} more</li>}
              {bowlName && <li>Eats: {bowlName.toLowerCase()}</li>}
            </ul>
          )}
        </div>
      </header>

      {/* 2. Three things to start with */}
      <section className="s-week" aria-label="Start with these three">
        <h2>Start with these three</h2>
        <Tips tips={week} />
      </section>

      {/* 3. The plan, in tabs */}
      <section id="plan" className="s-plan">
        <div className="s-tabs" ref={tabsRef} role="tablist" aria-label="Plan topics">
          {groups.map((x) => {
            const Icon = TAB_ICONS[x.id];
            return (
              <button key={x.id} role="tab" aria-selected={x.id === g.id} onClick={() => showTab(x.id)}>
                {x.id === g.id && <motion.span layoutId="tab-pill" className="s-tab-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="s-tab-label">
                  {Icon && (
                    <span className="s-tab-icon" aria-hidden>
                      <Icon />
                    </span>
                  )}
                  {x.tab}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={g.id} className="s-panel" role="tabpanel" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            {/* The first tab's aha is already the page headline. */}
            {g.id !== lead.id && (
              <div className="s-panel-head">
                <h2>{fill(g.aha)}</h2>
                <p>{g.why}</p>
              </div>
            )}

            {g.id === "energy" && (
              <>
                <Sub>Do this</Sub>
                <Tips tips={g.tips} />
                <WhyWalk />

                <Sub note="You don't need all of them. Start with one.">What to get</Sub>
                {order.map((id) => {
                  const k = KINDS.find((x) => x.id === id)!;
                  const shown = products.filter((p) => p.kind === id);
                  if (shown.length === 0) return null;
                  return (
                    <div key={id} className="s-kind">
                      <div className="s-kind-head">
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
                    </div>
                  );
                })}
                <p className="s-note">
                  Photos and prices from each store's own site, read on {CHECKED}. Check the store before you buy. We earn nothing from these links.
                </p>

                <div id="diy" className="s-free">
                  <div>
                    <p className="s-kicker">A free DIY option</p>
                    <h3>{CALM.diy.title}</h3>
                    <ol>
                      {CALM.diy.steps.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ol>
                    <p className="s-muted">{CALM.diy.caution}</p>
                  </div>
                  <Sock />
                </div>

                {rules && (
                  <>
                    <Sub note={HOUSE_RULES.lead}>{HOUSE_RULES.title}</Sub>
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
                  </>
                )}
              </>
            )}

            {g.id === "toilet" && (
              <>
                <Sub note={TOILET.lead}>Pick your way</Sub>
                <Toilet sex={sex} marks={needs.includes("mark")} />
              </>
            )}

            {g.id === "walks" && (
              <>
                {needs.includes("pull") && (
                  <>
                    <Sub>Pulling on the lead</Sub>
                    <Tips tips={WALK_TIPS.pull!} />
                  </>
                )}
                {needs.includes("bark") && (
                  <>
                    <Sub>Barking</Sub>
                    <Tips tips={WALK_TIPS.bark!} />
                  </>
                )}
              </>
            )}

            {g.id === "alone" && (
              <>
                <Sub>Do this</Sub>
                <Tips tips={WALK_TIPS.alone!} />
              </>
            )}

            {g.id === "skin" && (
              <>
                <Sub>Do this</Sub>
                <Tips tips={g.tips} />
              </>
            )}

            {g.id === "food" && (
              <>
                <Sub note={bowl ? BOWL_NOTE[bowl] : "Every bit of fresh food counts. Pick how far you want to go."}>How much fresh?</Sub>
                <Ladder start={bowl ? LADDER_START[bowl] : LADDER[0].id} />
                <Sub>For every bowl</Sub>
                <Tips tips={FOOD_TIPS} />
                {(["tummy", "picky", "weight"] as ProblemId[])
                  .filter((p) => needs.includes(p))
                  .map((p) => (
                    <div key={p}>
                      <Sub>{PROBLEMS.find((x) => x.id === p)!.label}</Sub>
                      <Tips tips={BODY_TIPS[p]!} />
                    </div>
                  ))}
                <div className="s-soon">
                  <span className="s-soon-tag">Coming soon</span>
                  <strong>{BALANCE.title}</strong>
                  <span>{BALANCE.line}</span>
                </div>
                <p className="s-note">
                  {FOOD_CREDIT.text}{" "}
                  <a href={FOOD_CREDIT.url} target="_blank" rel="noreferrer">
                    Read more from her
                  </a>
                </p>
              </>
            )}

            <Careful g={g} />

            <Sub note="People we trust for this. Follow them, or book them if you need a hand.">Learn from</Sub>
            <Experts ids={g.experts} />

            {groups.length > 1 && (
              <NextTab groups={groups} current={g.id} onGo={showTab} />
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 4. More help */}
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
          {neuter && (
            <div className="s-help-card">
              <h3>About neutering</h3>
              <p>{neuter.text}</p>
            </div>
          )}
          <div className="s-help-card">
            <h3>See things in person</h3>
            <p>{STORES.huft.name} has shops in many cities, if you would rather pick toys and chews in hand.</p>
            <a className="linklike" href={STORES.huft.shops} target="_blank" rel="noreferrer">
              Find your nearest <i className="chev chev-right" aria-hidden />
            </a>
          </div>
          <div className="s-help-card">
            <h3>Thinking of a second dog?</h3>
            <p>{expert("freagles").what}</p>
            <a className="linklike" href={expert("freagles").insta} target="_blank" rel="noreferrer">
              {expert("freagles").handle} <i className="chev chev-right" aria-hidden />
            </a>
          </div>
        </div>
        <Everyone />
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

// At the bottom of a tab: a nudge to the next one, so nobody misses a tab.
function NextTab({ groups, current, onGo }: { groups: Group[]; current: GroupId; onGo: (id: GroupId) => void }) {
  const i = groups.findIndex((x) => x.id === current);
  const next = groups[(i + 1) % groups.length];
  return (
    <button className="s-next" onClick={() => onGo(next.id)}>
      <span>
        <span className="s-muted">Next</span>
        <strong>{next.tab}</strong>
      </span>
      <span className="arrow" aria-hidden />
    </button>
  );
}

// Everyone we recommend, folded away, sorted by what they help with.
function Everyone() {
  const [open, setOpen] = useState(false);
  const kinds = [...new Set(EXPERTS.map((e) => e.kind))];
  return (
    <div className={`s-fold s-everyone ${open ? "is-open" : ""}`}>
      <button className="s-fold-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>
          <strong>Everyone we recommend</strong>
          <span>
            {EXPERTS.length} nutritionists, trainers, makers and rescuers worth following.
          </span>
        </span>
        <i className={`chev ${open ? "chev-up" : ""}`} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
            {kinds.map((k) => (
              <div key={k} className="s-everyone-group">
                <h3>{k}</h3>
                <div className="s-experts">
                  {EXPERTS.filter((e) => e.kind === k).map((e) => (
                    <ExpertCard key={e.id} e={e} />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
