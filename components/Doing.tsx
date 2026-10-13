import type { FaceId } from "@/lib/flow";
import { Face } from "./Faces";
import { Sitter } from "./Sitters";
import { WalkingBeagle } from "./Walkers";

// A small picture of what the dog is doing, one per activity in the "why a
// walk is not enough" explainer: out walking, with tennis balls, nose down
// in a snuffle mat, or lying with a chew. Motion is in globals.css under ".doing".

function Ball({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`ball ${className}`} aria-hidden>
      <circle cx="20" cy="20" r="18" fill="#c6ec6a" />
      <path d="M6 9 C16 14 16 26 6 31 M34 9 C24 14 24 26 34 31" fill="none" stroke="#f7f1e3" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

// A snuffle mat: fleece strips that ruffle, treats tucked between them, and
// a nose working its way across.
function SnuffleMat() {
  const colours = ["#f5b041", "#1f4fa3", "#f7f1e3", "#ee5f3f"];
  const strips = Array.from({ length: 30 }, (_, i) => ({ x: 22 + (i % 10) * 20, y: 46 + Math.floor(i / 10) * 26, c: colours[(i * 3 + Math.floor(i / 10)) % colours.length], i }));
  return (
    <svg viewBox="0 0 240 150" className="mat" aria-hidden>
      <rect x="10" y="34" width="220" height="96" rx="22" fill="#68918a" />
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

export function Doing({ what, face }: { what: string; face: FaceId }) {
  if (what === "walk") {
    return (
      <div className="doing doing-walk" aria-hidden>
        <WalkingBeagle />
        <i className="doing-road" />
      </div>
    );
  }
  if (what === "fetch") {
    return (
      <div className="doing doing-fetch" aria-hidden>
        <Sitter id={face} className="is-happy" />
        <Ball className="ball-held" />
        <Ball className="ball-bounce" />
        <Ball className="ball-roll" />
      </div>
    );
  }
  if (what === "sniff") {
    return (
      <div className="doing doing-sniff" aria-hidden>
        <SnuffleMat />
      </div>
    );
  }
  return (
    <div className="doing doing-chew" aria-hidden>
      <Face id={face} className="is-calm" />
      <svg viewBox="0 0 200 70" className="chew-bit">
        <g className="chew-stick">
          <rect x="48" y="18" width="104" height="26" rx="13" fill="#f2cd8e" />
          <path d="M64 24 v14 M80 24 v14" stroke="#d9a85c" strokeWidth="2.4" strokeLinecap="round" />
        </g>
        <ellipse cx="52" cy="44" rx="26" ry="15" fill="#f7f1e3" />
        <ellipse cx="148" cy="44" rx="26" ry="15" fill="#f7f1e3" />
        <path d="M44 46 v8 M54 47 v8 M140 47 v8 M150 46 v8" stroke="#d8cdb8" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
