"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Breed } from "@/lib/flow";
import { formatAge } from "@/lib/flow";
import { ACTIVITIES, BOWLS, CALM, CHECKED, HOUSE_RULES, KINDS, NEUTER_FOR, PROBLEMS, STORES, TOILET, neuterNote, pickProducts, type Bowl, type KindId, type ProblemId, type Product, type Sex } from "@/lib/content";
import { BALANCE, BODY_TIPS, BOWL_NOTE, EXPERTS, FOOD_CREDIT, FOOD_TIPS, GARLIC_CONTEXT, GARLIC_RESEARCH, HOMEMADE_LINKS, HOMEMADE_TIPS, INDIAN_KITCHEN, LADDER, LADDER_START, BIG_DOG_TIPS, PUPPY_NOTE, SENIOR_TIPS, SKIP_INGREDIENTS, SWITCH_TIPS, TOPPERS, TOPPER_AMOUNTS, TOPPER_TIPS, WALK_TIPS, WHEN_TIPS, dailyCalories, expert, garlicCloves, groupsFor, starchGrade, starchPercent, headlineFor, tipsFor, weekPlan, type Expert, type Group, type GroupId, type Tip } from "@/lib/plan";
import { Face } from "./Faces";
import { Logo } from "./Logo";
import { BallIcon, ChewIcon, SniffIcon, WalkIcon } from "./Icons";
import { Squiggle } from "./LandingMore";
import { Sticker, type StickerKind } from "./Stickers";
import { ToiletRoad } from "./ToiletRoad";

// The dog's name set in the italic accent face, like "why *pet buddha*".
function Accent({ text, word }: { text: string; word?: string }) {
  if (!word || !text.includes(word)) return <>{text}</>;
  const parts = text.split(word);
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <em>{word}</em>}
        </span>
      ))}
    </>
  );
}

// "In this tab": the tab's numbered sections, listed up front so you can see
// what's coming and jump to any of them. Reads the headings from its own panel.
function PanelIndex() {
  const ref = useRef<HTMLElement>(null);
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    const panel = ref.current?.parentElement;
    if (!panel) return;
    setItems([...panel.querySelectorAll<HTMLElement>(".s-subhead h3")].map((h) => h.dataset.short || h.textContent || ""));
  }, []);
  if (items.length < 2) return <nav ref={ref} className="s-index is-empty" aria-hidden />;
  const go = (i: number) => {
    const heads = ref.current?.parentElement?.querySelectorAll(".s-subhead");
    heads?.[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <nav ref={ref} className="s-index" aria-label="In this tab">
      <span className="s-index-label">in this tab</span>
      <ol>
        {items.map((t, i) => (
          <li key={t}>
            <button onClick={() => go(i)}>
              <span className="s-index-num">{String(i + 1).padStart(2, "0")}</span>
              {t}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Fresh toppers, one soft card per group: a sticker, the group name, and
// the first few as chips. The rest wait behind "+ more", so it scans.
const TOPPER_LOOK: Record<string, { kind: StickerKind; tone: string; ink: string; bg: string }> = {
  Vegetables: { kind: "leaf", tone: "#ffffff", ink: "#1f5c43", bg: "#e6f5c9" },
  Fruit: { kind: "heart", tone: "#ffffff", ink: "#7c2d4a", bg: "#fbe0d2" },
  Protein: { kind: "bone", tone: "#ffffff", ink: "#3a3f8f", bg: "#ddd3f7" },
  "Spice box": { kind: "sparkle", tone: "#ffffff", ink: "#6b3a12", bg: "#fde3b0" },
};

function ToppersGrid() {
  const [all, setAll] = useState<string[]>([]);
  return (
    <div className="tp-grid">
      {TOPPERS.map((grp) => {
        const look = TOPPER_LOOK[grp.group] ?? TOPPER_LOOK.Vegetables;
        const open = all.includes(grp.group);
        const shown = open ? grp.items : grp.items.slice(0, 4);
        const more = grp.items.length - 4;
        return (
          <div key={grp.group} className="tp-card" style={{ background: look.bg }}>
            <span className="tp-sticker" aria-hidden>
              <Sticker kind={look.kind} tone={look.tone} ink={look.ink} />
            </span>
            <h4>{grp.group}</h4>
            <ul>
              {shown.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            {more > 0 && (
              <button className="tp-more" onClick={() => setAll((a) => (open ? a.filter((g) => g !== grp.group) : [...a, grp.group]))}>
                {open ? "Show less" : `+ ${more} more`}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// A line-art sticker for each step of the toilet guides.
const PATH_LOOK: Record<string, { kind: StickerKind; tone: string; ink: string }[]> = {
  pads: [
    { kind: "nose", tone: "#e6f5c9", ink: "#1f5c43" },
    { kind: "sparkle", tone: "#fde3b0", ink: "#6b3a12" },
    { kind: "paw", tone: "#ddd3f7", ink: "#3a3f8f" },
    { kind: "bone", tone: "#fbe0d2", ink: "#7c2d4a" },
    { kind: "heart", tone: "#c9d3ff", ink: "#3a3f8f" },
  ],
  outside: [
    { kind: "bowl", tone: "#fde3b0", ink: "#6b3a12" },
    { kind: "leaf", tone: "#e6f5c9", ink: "#1f5c43" },
    { kind: "bone", tone: "#fbe0d2", ink: "#7c2d4a" },
    { kind: "heart", tone: "#ddd3f7", ink: "#3a3f8f" },
  ],
};

// A line-art sticker for each kind of thing to buy.
const KIND_STICKER: Record<KindId, { kind: StickerKind; tone: string; ink: string }> = {
  chew: { kind: "bone", tone: "#fbe0d2", ink: "#7c2d4a" },
  sniff: { kind: "nose", tone: "#e6f5c9", ink: "#1f5c43" },
  puzzle: { kind: "sparkle", tone: "#ddd3f7", ink: "#3a3f8f" },
};

// "Start with these three" as a small hand of coloured cards, like the
// landing's "why pet buddha".
const WEEK_LOOK: { tone: string; kind: StickerKind; sticker: string; ink: string }[] = [
  { tone: "green", kind: "paw", sticker: "#e6f5c9", ink: "#1f5c43" },
  { tone: "blue", kind: "sparkle", sticker: "#fde3b0", ink: "#3a3f8f" },
  { tone: "orange", kind: "bone", sticker: "#c9d3ff", ink: "#b2431c" },
];

function WeekCards({ tips }: { tips: Tip[] }) {
  return (
    <ol className="wk-cards">
      {tips.map((tip, i) => {
        const look = WEEK_LOOK[i % WEEK_LOOK.length];
        return (
          <motion.li
            key={tip.t}
            className={`wk-card hc-${look.tone}`}
            style={{ rotate: [-3, 2, -1.5][i % 3] }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: "spring", stiffness: 140, damping: 16, delay: i * 0.08 }}
          >
            <span className="wk-sticker">
              <Sticker kind={look.kind} tone={look.sticker} ink={look.ink} />
            </span>
            <span className="wk-num">{String(i + 1).padStart(2, "0")}</span>
            <strong>{tip.t}</strong>
            <span className="wk-text">{tip.d}</span>
          </motion.li>
        );
      })}
    </ol>
  );
}

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

// The tips already shown in "start with these three", so a tab doesn't
// repeat them further down.
const SeenTips = createContext<Set<string>>(new Set());

// Tips as small open cards: the action and its one line, all visible, no
// clicking. Anything already in "start with these three" is left out. When
// nothing was left out, the first card is marked "start here".
function Tips({ tips, start = 0 }: { tips: Tip[]; start?: number }) {
  const seen = useContext(SeenTips);
  const shown = tips.filter((t) => !seen.has(t.t));
  if (shown.length === 0) return null;
  const lead = shown.length === tips.length && shown.length > 1;
  return (
    <ol className={`tc ${lead ? "has-lead" : ""}`}>
      {shown.map((tip, i) => (
        <li key={tip.t} className={lead && i === 0 ? "tc-lead" : ""}>
          {lead && i === 0 && <span className="tl-start">start here</span>}
          <span className="tc-num">{String(start + i + 1).padStart(2, "0")}</span>
          <strong>{tip.t}</strong>
          <p>{tip.d}</p>
          {tip.src && <em className="s-src">From {tip.src}</em>}
        </li>
      ))}
    </ol>
  );
}

// A section of tips with its heading. Called "More to try" when some of its
// tips are already up top, and left out entirely if all of them are.
// `keep` keeps the given title (a topic like "Barking") even when some tips
// are already up top.
function TipSection({ tips, title = "First steps", keep = false }: { tips: Tip[]; title?: string; keep?: boolean }) {
  const seen = useContext(SeenTips);
  const left = tips.filter((t) => !seen.has(t.t)).length;
  if (left === 0) return null;
  return (
    <>
      <Sub>{left < tips.length && !keep ? "More to try" : title}</Sub>
      <Tips tips={tips} />
    </>
  );
}

// One person or brand we recommend: who, what they offer, and where to find them.
// Each kind of person has its own soft colour.
const KIND_CLASS: Record<string, string> = {
  Nutritionist: "k-food",
  "Fresh food": "k-food",
  Supplements: "k-food",
  Vet: "k-food",
  Treats: "k-food",
  Trainer: "k-trainer",
  "Skin and bath": "k-care",
  "Holistic care": "k-care",
  Adoption: "k-adopt",
};

function ExpertCard({ e, hideKind = false, pick = null }: { e: Expert; hideKind?: boolean; pick?: string | null }) {
  return (
    <article className={`s-expert ${KIND_CLASS[e.kind] ?? ""} ${pick ? "is-pick" : ""}`}>
      {pick && <span className="s-pick-tag">good fit for you</span>}
      {pick && (
        <span className="s-pick-sticker" aria-hidden>
          <Sticker kind="heart" tone="#fbe0d2" ink="#7c2d4a" />
        </span>
      )}
      {!hideKind && <span className="s-expert-kind">{e.kind}</span>}
      <strong>{e.name}</strong>
      <span className="s-expert-what">{e.what}</span>
      {pick && <span className="s-pick-why">{pick}</span>}
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
// The tab's people, best fit first. The first one with a reason for the
// owner's first problem is highlighted, with that reason on the card.
function Experts({ ids, needs }: { ids: string[]; needs: ProblemId[] }) {
  const [all, setAll] = useState(false);
  const reason = (id: string) => {
    const e = expert(id);
    const p = needs.find((x) => e.goodFor?.[x]);
    return p ? e.goodFor![p]! : null;
  };
  const rank = (id: string) => {
    const i = needs.findIndex((x) => expert(id).goodFor?.[x]);
    return i === -1 ? 99 : i;
  };
  const ordered = [...ids].sort((a, b) => rank(a) - rank(b));
  const pick = ordered.find((id) => reason(id));
  const shown = all ? ordered : ordered.slice(0, 4);
  return (
    <>
      <div className="s-experts">
        {shown.map((id) => (
          <ExpertCard key={id} e={expert(id)} pick={id === pick ? reason(id) : null} />
        ))}
      </div>
      {ordered.length > 4 && (
        <button className="linklike s-more" onClick={() => setAll(!all)}>
          {all ? "Show fewer" : `Show ${ordered.length - 4} more`} <i className={`chev ${all ? "chev-up" : ""}`} aria-hidden />
        </button>
      )}
    </>
  );
}

// What not to do, and when to get help: the same two boxes on every tab.
function Careful({ g }: { g: Group }) {
  return (
    <div className="s-careful">
      <div className="cf cf-avoid">
        <span className="cf-tag">please don&apos;t</span>
        <p>{g.avoid}</p>
      </div>
      {g.help && (
        <div className="cf cf-help">
          <span className="cf-tag">see a vet or trainer if</span>
          <p>{g.help}</p>
        </div>
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

// A titled section folded away until asked for.
function Fold({ title, line, open: start = false, children }: { title: string; line: string; open?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(start);
  return (
    <div className={`s-fold ${open ? "is-open" : ""}`}>
      <button className="s-fold-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>
          <strong>{title}</strong>
          <span>{line}</span>
        </span>
        <i className={`chev ${open ? "chev-up" : ""}`} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
            <div className="s-fold-body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Starch in packaged food, worked out from the numbers on the bag.
function StarchCheck() {
  const [v, setV] = useState({ protein: "", fat: "", fibre: "", moisture: "", ash: "" });
  const n = (x: string) => Number(x.replace(",", ".")) || 0;
  const ready = v.protein && v.fat && v.fibre && v.moisture;
  const pct = starchPercent({ protein: n(v.protein), fat: n(v.fat), fibre: n(v.fibre), moisture: n(v.moisture), ash: v.ash ? n(v.ash) : undefined });
  const grade = starchGrade(pct);
  const fields: [keyof typeof v, string][] = [
    ["protein", "Protein"],
    ["fat", "Fat"],
    ["fibre", "Fibre"],
    ["moisture", "Moisture"],
    ["ash", "Ash (if listed)"],
  ];
  return (
    <div className="s-starch">
      <p className="s-muted">Find the "Guaranteed analysis" on the bag and type in the percentages. Dogs need no starch at all.</p>
      <div className="s-starch-fields">
        {fields.map(([k, label]) => (
          <label key={k}>
            <span>{label}</span>
            <span className="s-starch-input">
              <input inputMode="decimal" value={v[k]} placeholder={k === "ash" ? "6" : ""} onChange={(e) => setV({ ...v, [k]: e.target.value })} />%
            </span>
          </label>
        ))}
      </div>
      <div className={`s-starch-result ${ready ? "is-ready" : ""}`} data-grade={ready ? grade : ""}>
        {ready ? (
          <>
            <strong>{pct}% starch</strong>
            <span>{grade === "High in starch" ? "Over 20%. Worth adding fresh food, or looking for a lower-starch brand." : `${grade}. Under ${grade === "Best" ? 10 : grade === "Better" ? 15 : 20}%.`}</span>
          </>
        ) : (
          <span>Good is under 20%, better under 15%, best under 10%.</span>
        )}
      </div>
      <p className="s-skip">
        <strong>Skip foods with:</strong> {SKIP_INGREDIENTS.join(", ")}.
      </p>
    </div>
  );
}

// A heading inside a tab.
// `short` is the label used for it in the tab's index, when the heading is long.
function Sub({ children, note, short }: { children: React.ReactNode; note?: string; short?: string }) {
  return (
    <div className="s-subhead">
      <h3 data-short={short}>{children}</h3>
      <Squiggle className="is-short" />
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
function ProductCard({ p, who, needs, tone }: { p: Product; who: string; needs: ProblemId[]; tone: string }) {
  const warn = p.notFor && needs.includes(p.notFor.problem) ? p.notFor.note : null;
  // Flips over in place to show how it helps, like the fact cards on the
  // landing. Both sides share one grid cell, so the card never changes size.
  const [flipped, setFlipped] = useState(false);
  return (
    <article className={`pcard pc-${tone} ${flipped ? "is-flipped" : ""} ${warn ? "has-warn" : ""}`}>
      <motion.div className="pcard-flip" initial={false} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: "spring", stiffness: 120, damping: 18 }} style={{ transformPerspective: 1400 }}>
        <div className="pcard-face pcard-front" aria-hidden={flipped}>
          <div className="pcard-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={`${p.name}, photo from ${STORES[p.store].name}`} loading="lazy" />
            {/* A round button tucked into the photo's corner, on a ring of page colour. */}
            <span className="pcard-notch">
              <button className="pcard-more" onClick={() => setFlipped(true)} tabIndex={flipped ? -1 : 0} aria-label={`How ${p.name} helps`}>
                How it helps
                <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden>
                  <path d="M10 4v12M4 10h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          </div>
          <div className="pcard-info">
            <strong>{p.name}</strong>
            <span className="pcard-plain">{p.plain}</span>
            <span className="pcard-tags">
              <span className="pcard-tag pt-price">{p.price}</span>
              <span className="pcard-tag pt-store">{STORES[p.store].name}</span>
              {warn && <span className="pcard-tag pt-warn">Read first</span>}
            </span>
          </div>
        </div>
        <div className="pcard-face pcard-back" aria-hidden={!flipped}>
          <strong className="pcard-back-title">
            Why it helps {who} <Draft on={p.draft} />
          </strong>
          <p>{p.why}</p>
          {warn && (
            <p className="pcard-warn">
              <strong>Heads up.</strong> {warn}
            </p>
          )}
          <span className="pcard-label">How to start</span>
          <ol className="pcard-steps">
            {p.start.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
          <p className="pcard-caution">
            <strong>Watch out.</strong> {p.caution}
          </p>
          <div className="pcard-links">
            <a className="pill" href={STORES[p.store].url + p.path} target="_blank" rel="noreferrer" tabIndex={flipped ? 0 : -1}>
              See it at the store <span className="arrow" aria-hidden />
            </a>
            {/* The sock trick is a home-made snuffle toy, so only those link to it. */}
            {p.kind === "sniff" && (
              <a className="linklike" href="#diy" tabIndex={flipped ? 0 : -1}>
                Or make one free
              </a>
            )}
          </div>
          <button className="pcard-circle pcard-close" onClick={() => setFlipped(false)} tabIndex={flipped ? 0 : -1} aria-label="Back to the photo">
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden>
              <path d="M5 5l10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </motion.div>
    </article>
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
function Toilet({ sex, face }: { sex: Sex | null; face: string }) {
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
        {/* Wide screens: the road, with the dog walking it. */}
        <ToiletRoad key={`road-${path}`} titles={chosen.titles} steps={chosen.steps} looks={PATH_LOOK[path] ?? PATH_LOOK.pads} face={face} word={praise} />
        {/* Phones: the steps as a little illustrated path: a sticker for each step, a
            dotted line winding from one to the next. */}
        <motion.ol key={path} className="gp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
          {chosen.steps.map((line, i) => {
            const look = PATH_LOOK[path]?.[i] ?? PATH_LOOK.pads[i % 5];
            const right = i % 2 === 1;
            return (
              <motion.li
                key={line}
                className={right ? "is-right" : ""}
                initial="hide"
                whileInView="show"
                viewport={{ once: true, amount: 0.5 }}
                variants={{ hide: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
              >
                <span className="gp-mark">
                  <span className="gp-sticker">
                    <Sticker kind={look.kind} tone={look.tone} ink={look.ink} />
                  </span>
                  {i < chosen.steps.length - 1 && (
                    <motion.svg
                      className="gp-line"
                      viewBox="0 0 140 100"
                      preserveAspectRatio="none"
                      aria-hidden
                      variants={{ hide: { clipPath: "inset(0 0 100% 0)" }, show: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.7, ease: "easeInOut", delay: 0.25 } } }}
                    >
                      <path
                        d={right ? "M98 0 C98 55 42 45 42 100" : "M42 0 C42 55 98 45 98 100"}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="0.5 9"
                        vectorEffect="non-scaling-stroke"
                      />
                    </motion.svg>
                  )}
                </span>
                <span className="gp-num">{i + 1}</span>
                <p>{praise(line)}</p>
              </motion.li>
            );
          })}
        </motion.ol>
      </AnimatePresence>
    </div>
  );
}

// Why a longer walk won't fix it, folded away until asked for.
function WhyWalk() {
  const [open, setOpen] = useState(false);
  return (
    <div className={`s-fold s-fold-feature ${open ? "is-open" : ""}`}>
      <span className="s-feature-sticker" aria-hidden>
        <Sticker kind="nose" tone="#fde3b0" ink="#3a3f8f" />
      </span>
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

  const week = weekPlan(groups, needs);

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
    // Bring the start of the tab into view if the reader is further down.
    const top = tabsRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.6) tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const told = chosen.map((p) => p.label.toLowerCase());

  return (
    <SeenTips.Provider value={new Set(week.map((t) => t.t))}>
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
          <p className="s-kicker text-sticker ts-lime">{name ? `${name}'s plan` : "Your plan"}</p>
          <h1>
            <Accent text={fill(headlineFor(lead, needs).aha)} word={name || undefined} />
          </h1>
          <Squiggle className="s-squiggle" />
          <p className="s-sub">{headlineFor(lead, needs).why}</p>
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
          <span className="s-id-sticker" aria-hidden>
            <Sticker kind="heart" tone="#fbe0d2" ink="#7c2d4a" />
          </span>
          <span className="s-id-tag text-sticker ts-lilac" aria-hidden>
            good dog
          </span>
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
        <div className="s-head">
          <h2>
            start with <em>these three</em>
          </h2>
          <Squiggle className="is-short" />
        </div>
        <WeekCards tips={week} />
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
                <h2>
                  <Accent text={fill(headlineFor(g, needs).aha)} word={name || undefined} />
                </h2>
                <Squiggle className="s-squiggle" />
                <p>{headlineFor(g, needs).why}</p>
              </div>
            )}
            <PanelIndex />

            {g.id === "energy" && (
              <>
                <TipSection tips={tipsFor(g.tips, needs)} />
                {/* For chewers, the house rules come straight after the first steps. */}
                {rules && (
                  <>
                    <Sub note={HOUSE_RULES.lead} short="chewing rules">{HOUSE_RULES.title}</Sub>
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
                <WhyWalk />

                <Sub note="You don't need all of them. Start with one." short="chews and toys">Chews and toys that help</Sub>
                {order.map((id) => {
                  const k = KINDS.find((x) => x.id === id)!;
                  const shown = products.filter((p) => p.kind === id);
                  if (shown.length === 0) return null;
                  return (
                    <div key={id} className={`s-kind s-kind-${id}`}>
                      <div className="s-kind-head">
                        <div>
                          <span className="s-kind-sticker" aria-hidden>
                            <Sticker kind={KIND_STICKER[id].kind} tone={KIND_STICKER[id].tone} ink={KIND_STICKER[id].ink} />
                          </span>
                          <h3>{k.label}</h3>
                          <p>{k.lead}</p>
                        </div>
                        <ul className="s-look">
                          {k.lookFor.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pcards">
                        {shown.map((p, i) => (
                          <ProductCard key={p.id} p={p} who={who} needs={needs} tone={["lime", "peach", "lilac"][i % 3]} />
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

              </>
            )}

            {g.id === "toilet" && (
              <>
                <Sub note={TOILET.lead} short="step-by-step guide">Pee pads or going outside</Sub>
                <Toilet sex={sex} face={pet.face} />
                <TipSection tips={tipsFor(g.tips, needs)} />
              </>
            )}

            {g.id === "walks" && (
              <>
                {needs.includes("pull") && <TipSection tips={WALK_TIPS.pull!} title="Pulling on the lead" keep />}
                {needs.includes("bark") && <TipSection tips={WALK_TIPS.bark!} title="Barking" keep />}
              </>
            )}

            {g.id === "alone" && (
              <>
                <TipSection tips={tipsFor(WALK_TIPS.alone!, needs)} />
              </>
            )}

            {g.id === "skin" && (
              <>
                <TipSection tips={tipsFor(g.tips, needs)} />
              </>
            )}

            {g.id === "food" && (
              <>
                <Sub note="Whatever is in the bowl now, start here.">Step 1 · Fresh toppers, up to 10%</Sub>
                <Tips tips={TOPPER_TIPS} />
                <ToppersGrid />
                <Fold title="How much of each?" line="Organs, sardines, spices, garlic, and what to do if they're chubby.">
                  <Tips
                    tips={[
                      ...TOPPER_AMOUNTS,
                      {
                        t: "Garlic: fresh and measured",
                        d: garlicCloves(kg)
                          ? `At ${kg} kg, up to ${garlicCloves(kg)} of fresh garlic a day. Fresh only, no pills or powders. Onion is never safe.`
                          : "Very small dogs: skip garlic. Onion is never safe.",
                        src: "The Forever Dog, @backintheday.in, @doggiliciouus",
                      },
                    ]}
                  />
                </Fold>

                <Fold title="Garlic: what the research says" line="The studies behind the garlic advice, in plain words.">
                  <ul className="s-papers">
                    {GARLIC_RESEARCH.map((r) => (
                      <li key={r.url}>
                        <a href={r.url} target="_blank" rel="noreferrer">
                          {r.title}
                        </a>
                        <span className="s-papers-cite">{r.cite}</span>
                        <span>{r.plain}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="s-toilet-note">{GARLIC_CONTEXT}</p>
                </Fold>

                <Sub note={bowl ? BOWL_NOTE[bowl] : "Every bit of fresh food counts. Pick how far you want to go."}>Step 2 · How much of the bowl fresh?</Sub>
                <Ladder start={bowl ? LADDER_START[bowl] : LADDER[0].id} />
                <Fold title="Making it at home" line="What makes a home-made bowl complete, not just fresh." open={bowl === "home" || bowl === "fresh"}>
                  <Tips tips={HOMEMADE_TIPS} />
                  <p className="s-links">
                    {HOMEMADE_LINKS.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                        {l.label} <i className="chev chev-right" aria-hidden />
                      </a>
                    ))}
                  </p>
                </Fold>
                {bowl !== "home" && bowl !== "fresh" && (
                  <Fold title="Check the bag" line="How much starch is in their packaged food? Work it out from the label.">
                    <StarchCheck />
                  </Fold>
                )}

                <Sub note={`${who === "your dog" ? "A grown dog" : Who} at ${kg} kg needs roughly ${dailyCalories(kg)} calories a day, more if very active.`}>When and how much</Sub>
                <Tips tips={WHEN_TIPS} />
                {kg >= 25 && (
                  <div className="s-space">
                    <Tips tips={BIG_DOG_TIPS} />
                  </div>
                )}
                {months < 12 && <p className="s-toilet-note">{PUPPY_NOTE}</p>}

                {months >= 84 && (
                  <>
                    <Sub>For an older dog</Sub>
                    <Tips tips={SENIOR_TIPS} />
                  </>
                )}

                <Sub>Switching food</Sub>
                <Tips tips={SWITCH_TIPS} />

                <Sub note="The habits that most often go wrong at home.">From an Indian kitchen</Sub>
                <Tips tips={INDIAN_KITCHEN} />

                {(["tummy", "picky", "weight"] as ProblemId[])
                  .filter((p) => needs.includes(p))
                  .map((p) => (
                    <div key={p}>
                      <Sub>{PROBLEMS.find((x) => x.id === p)!.label}</Sub>
                      <Tips tips={BODY_TIPS[p]!} />
                    </div>
                  ))}

                <Sub>For every bowl</Sub>
                <Tips tips={FOOD_TIPS} />

                <div className="s-soon">
                  <span className="s-soon-tag">Coming soon</span>
                  <strong>{BALANCE.title}</strong>
                  <span>{BALANCE.line}</span>
                </div>
                <p className="s-note">
                  {FOOD_CREDIT.text}{" "}
                  <a href={FOOD_CREDIT.url} target="_blank" rel="noreferrer">
                    foreverdog.com
                  </a>
                </p>
              </>
            )}

            <Careful g={g} />

            <Sub note="People we trust for this. Follow them, or book them if you need a hand." short="who to follow">People to learn from</Sub>
            <Experts ids={g.experts} needs={needs} />

            {groups.length > 1 && (
              <NextTab groups={groups} current={g.id} onGo={showTab} />
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 4. More help */}
      <Scene className="s-sec">
        <div className="s-head">
          <h2>
            need more <em>help?</em>
          </h2>
          <Squiggle className="is-short" />
        </div>
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
    </SeenTips.Provider>
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
  // Food people sit together under one heading; the rest by their kind.
  const FOOD_KINDS = ["Nutritionist", "Fresh food", "Supplements", "Vet"];
  const groupOf = (e: Expert) => (FOOD_KINDS.includes(e.kind) ? "Fresh food and supplements" : e.kind);
  const kinds = [...new Set(EXPERTS.map(groupOf))];
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
                  {EXPERTS.filter((e) => groupOf(e) === k)
                    // Dr. Becker first: the food advice is built on her book.
                    .sort((a, b) => Number(b.id === "becker") - Number(a.id === "becker"))
                    .map((e) => (
                    <ExpertCard key={e.id} e={e} hideKind={e.kind === k} />
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
