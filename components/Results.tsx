"use client";

import { motion } from "motion/react";
import type { Breed } from "@/lib/flow";
import { BAND_NAME, ageBand, formatAge } from "@/lib/flow";
import { CALM, NEUTER_FOR, PROBLEMS, neuterNote, type ProblemId, type Sex } from "@/lib/content";
import { Face } from "./Faces";

// The page after the questions: one scrolling page of small animated
// explainers. Each scene plays as it scrolls into view. All the words come
// from lib/content.ts; anything Claude drafted carries a "Draft" tag until
// Meghna rewrites it. Styles are in globals.css under ".results".

function Draft({ on }: { on?: boolean }) {
  return on ? <span className="draft">Draft</span> : null;
}

// A section that rises into place the first time it is scrolled to.
function Scene({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.section className={`scene ${className}`} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ type: "spring", stiffness: 90, damping: 16 }}>
      {children}
    </motion.section>
  );
}

// A snuffle mat: fleece strips that ruffle, treats tucked between them, and
// a nose working its way across.
function SnuffleMat() {
  const colours = ["#f5b041", "#1f4fa3", "#f7f1e3", "#ee5f3f"];
  const strips = Array.from({ length: 30 }, (_, i) => ({ x: 22 + (i % 10) * 20, y: 46 + Math.floor(i / 10) * 26, c: colours[(i * 3 + Math.floor(i / 10)) % colours.length], i }));
  return (
    <svg viewBox="0 0 240 150" className="mat" aria-hidden>
      <rect x="10" y="34" width="220" height="96" rx="22" fill="#5c9f9a" />
      {[
        [58, 74],
        [128, 96],
        [190, 66],
      ].map(([x, y], i) => (
        <circle key={i} className="mat-treat" cx={x} cy={y} r="6" fill="#a8552c" style={{ "--i": i } as React.CSSProperties} />
      ))}
      {strips.map((s) => (
        <rect key={s.i} className="mat-strip" x={s.x} y={s.y} width="13" height="30" rx="6.5" fill={s.c} style={{ "--i": s.i, transformOrigin: `${s.x + 6.5}px ${s.y + 28}px` } as React.CSSProperties} />
      ))}
      <g className="mat-nose">
        <path d="M-22 -40 C-22 -64 22 -64 22 -40 L18 -8 C10 4 -10 4 -18 -8 Z" fill="#f7f1e3" />
        <path d="M-15 -12 C-15 -24 15 -24 15 -12 C15 0 7 8 0 8 C-7 8 -15 0 -15 -12 Z" fill="#211e1c" />
      </g>
    </svg>
  );
}

// The sock trick as a four-beat loop: a sock, treats dropping in, the sock
// rolling up, then wobbling as a nose gets to work. The written steps
// underneath light up in time with it.
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

function CalmGuide({ needs, band }: { needs: ProblemId[]; band: ReturnType<typeof ageBand> }) {
  const reasons = needs.map((id) => ({ id, ...CALM.forProblem[id] })).filter((r) => r.text);
  const avoid = CALM.avoid[band];
  return (
    <>
      <Scene className="card card-lead">
        <div className="card-text">
          <h2>{CALM.why.title}</h2>
          <p>{CALM.why.body}</p>
        </div>
        <SnuffleMat />
      </Scene>

      {reasons.length > 0 && (
        <Scene className="reasons">
          {reasons.map((r) => (
            <p key={r.id}>
              <strong>{PROBLEMS.find((p) => p.id === r.id)!.label}.</strong> {r.text} <Draft on={r.draft} />
            </p>
          ))}
        </Scene>
      )}

      {/* Zoomies to settled: the marker drifts across the three stages as the sniffing does its work. */}
      <Scene className="calm">
        <div className="calm-ends" aria-hidden>
          <span>Zoomies</span>
          <span>Settled</span>
        </div>
        <div className="calm-track" aria-hidden>
          <i />
        </div>
        <ol className="calm-steps">
          {CALM.stages.map((s) => (
            <li key={s.word}>
              <strong>{s.word}</strong>
              <span>{s.line}</span>
            </li>
          ))}
        </ol>
      </Scene>

      <Scene className="card">
        <h2>
          Try: {CALM.toy.title.toLowerCase()} <Draft on={CALM.toy.draft} />
        </h2>
        <p>{CALM.toy.plain}</p>
        <ol className="beats">
          {CALM.toy.introduce.map((line, i) => (
            <li key={line} style={{ "--i": i, "--n": CALM.toy.introduce.length } as React.CSSProperties}>
              {line}
            </li>
          ))}
        </ol>
        <p className="caution">
          <strong>Watch out.</strong> {CALM.toy.caution}
        </p>
      </Scene>

      <Scene className="shop">
        <h2>If you want to look</h2>
        <p>
          Snuffle toys from{" "}
          <a href={CALM.shop.url} target="_blank" rel="noreferrer">
            {CALM.shop.store}
          </a>
          . Prices read from their site on {CALM.shop.checked}, so check the store. We earn nothing from these links.
        </p>
        <div className="toys">
          {CALM.shop.items.map((t, i) => (
            <a key={t.name} className="toy" href={CALM.shop.url + t.path} target="_blank" rel="noreferrer" style={{ "--i": i } as React.CSSProperties}>
              <strong>{t.name}</strong>
              <span>{t.price}</span>
              <span className="arrow" aria-hidden />
            </a>
          ))}
        </div>
      </Scene>

      <Scene className="card card-diy card-lead">
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

      <Scene className="reasons">
        <p>
          <strong>Skip for a {BAND_NAME[band]}.</strong> {avoid.text} <Draft on={avoid.draft} />
        </p>
        <p>
          <strong>When to ask for help.</strong> {CALM.professional}
        </p>
      </Scene>
    </>
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
  onRestart,
}: {
  pet: Breed;
  name: string;
  months: number;
  kg: number;
  weightSure: boolean;
  sex: Sex | null;
  needs: ProblemId[];
  onRestart: () => void;
}) {
  const band = ageBand(months);
  const chosen = PROBLEMS.filter((p) => needs.includes(p.id));
  const calm = chosen.filter((p) => p.guide === "calm").map((p) => p.id);
  const waiting = chosen.filter((p) => !p.guide);
  const neuter = chosen.some((p) => NEUTER_FOR.includes(p.id)) ? neuterNote(sex, months) : null;
  const breedName = pet.face === "mixed" && pet.name.startsWith("Mixed") ? "dog" : pet.name;
  const facts = [`${kg} kg${weightSure ? "" : " (a guess)"}`, sex === "boy" ? "Boy" : sex === "girl" ? "Girl" : null].filter(Boolean);

  return (
    <div className="results">
      <header className="results-head">
        <div className="results-pet">
          <Face id={pet.face} className="reactive" />
        </div>
        <div>
          <p className="kicker">{name ? `For ${name}` : "All set"}</p>
          <h1>
            For your {breedName}, {formatAge(months)} old
          </h1>
          <div className="facts">
            {facts.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
        </div>
      </header>

      {calm.length > 0 && <CalmGuide needs={calm} band={band} />}

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

      {calm.length > 0 && (
        <Scene className="next">
          <p>One thing to try</p>
          <h2>{CALM.nextStep}</h2>
        </Scene>
      )}

      <p className="small results-note">General guidance, not a diagnosis. For anything about health, check with your vet. Pet Buddha carries no ads and earns no commission.</p>

      <button className="pill" onClick={onRestart}>
        Start over
      </button>
    </div>
  );
}
