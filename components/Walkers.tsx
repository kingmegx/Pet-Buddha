// The "curating" loading scene: a white card with a line of beagles walking
// over a black zebra crossing that fans out in perspective. Hovering it makes
// the hand cursor say "The Beagles" (see data-say and HandCursor).
//
// The beagles match the beagle head used everywhere else on the site: flat
// tan and cream, one big brown ear, a dot eye and a large nose. No
// outlines, no shading, no extra marks.
//
// They really travel from left to right and loop round, each holding its
// head and tail differently. Every leg has a thigh and a shin, so paws lift
// and fold on the way forward. The motion is in globals.css under ".poster".

const INK = "#211e1c";
const TAN = "#cf7d4a";
const TAN_DEEP = "#a8552c";
const EAR = "#b96a3c";
const WHITE = "#f7f1e3";
const FAR_WHITE = "#e6dcc6";
const RED = "#d8392b";

const BODY = "M58 92 C56 76 66 66 86 64 C112 61 150 60 176 64 C194 67 204 80 204 96 C204 110 196 122 182 126 C168 129 150 122 132 120 C112 118 92 122 78 118 C64 114 58 104 58 92 Z";
// From the head down to well inside the shoulders. It is drawn behind the
// body, so however the head tilts, its base never shows.
const NECK = "M176 104 C172 74 190 48 212 40 L232 70 C230 94 216 112 198 118 Z";
const EAR_SHAPE = "M218 20 C194 22 180 56 186 90 C190 106 212 106 218 90 C228 68 230 42 226 24 Z";

// A flat shape. No shading or texture.
function P({ d, fill }: { d: string; fill: string }) {
  return <path d={d} fill={fill} />;
}

function Leg({ x, y, beat, hind, far }: { x: number; y: number; beat: 1 | 2; hind?: boolean; far?: boolean }) {
  const upper = far ? TAN_DEEP : TAN;
  const lower = far ? FAR_WHITE : WHITE;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={`w-thigh w-beat-${beat}`}>
        <path d={hind ? "M-14 -10 C-18 8 -10 24 -6 36 L7 36 C10 22 16 8 14 -10 Z" : "M-9 -10 C-10 8 -8 22 -6 36 L6 36 C8 22 10 8 9 -10 Z"} fill={upper} />
        <g transform="translate(0 32)">
          <g className={`w-shin w-beat-${beat}`}>
            <path d="M-6 0 C-7 12 -5 22 -5 32 C-8 34 -8 41 -2 41 L10 41 C15 41 15 35 10 33 C8 30 7 22 7 12 L6 0 Z" fill={lower} />
            {!far && <path d="M3 37 v3.5 M8 37 v3.5" fill="none" stroke={FAR_WHITE} strokeWidth="1.4" strokeLinecap="round" />}
          </g>
        </g>
      </g>
    </g>
  );
}

// Also used on its own in the suggestions page, to show "a walk".
export function WalkingBeagle() {
  return (
    <svg viewBox="0 0 296 190" className="walker" aria-hidden>
      <defs>
        <clipPath id="beagle-body">
          <path d={BODY} />
        </clipPath>
      </defs>
      <ellipse cx="134" cy="181" rx="90" ry="6" fill="rgba(33,30,28,0.12)" />
      <g className="w-body">
        <g className="w-tail" style={{ transformOrigin: "64px 84px" }}>
          <path d="M60 92 C44 74 38 46 46 18 C49 9 58 12 57 21 C54 44 60 64 78 80 Z" fill={TAN} />
          <path d="M46 18 C49 9 58 12 57 21 C56 28 55 34 55 41 L43 39 C43 31 44 24 46 18 Z" fill={WHITE} />
        </g>

        <Leg x={92} y={106} beat={2} hind far />
        <Leg x={172} y={112} beat={1} far />

        {/* neck first, behind the body */}
        <g className="w-head" style={{ transformOrigin: "192px 88px" }}>
          <P d={NECK} fill={WHITE} />
          <path d="M176 104 C172 74 190 48 212 40 C208 62 198 86 186 106 Z" fill={TAN} />
        </g>

        {/* A tan back and a cream belly, so the dog stands out on the white card. */}
        <P d={BODY} fill={TAN} />
        <g clipPath="url(#beagle-body)">
          <path d="M96 132 C104 106 150 104 176 110 C192 114 204 104 210 92 V134 Z" fill={WHITE} />
        </g>

        <Leg x={78} y={104} beat={1} hind />
        <Leg x={186} y={110} beat={2} />

        {/* head, collar and ear in front */}
        <g className="w-head" style={{ transformOrigin: "192px 88px" }}>
          <path d="M188 70 C196 80 208 86 220 88" fill="none" stroke={RED} strokeWidth="8" strokeLinecap="round" />
          <P d="M204 46 C204 26 220 14 238 16 C252 18 260 30 260 42 C260 56 248 66 234 66 C218 66 204 60 204 46 Z" fill={TAN} />
          <path d="M242 17 C247 24 247 30 244 37 L234 36 C237 29 237 23 238 16 Z" fill={WHITE} />
          <P d="M232 36 C248 30 274 36 278 50 C280 62 268 72 252 72 C238 72 226 64 226 52 C226 44 228 39 232 36 Z" fill={WHITE} />
          <ellipse cx="274" cy="48" rx="11" ry="9.5" fill={INK} />
          <circle cx="240" cy="35" r="4.2" fill={INK} />
          <g className="w-ear" style={{ transformOrigin: "216px 28px" }}>
            <P d={EAR_SHAPE} fill={EAR} />
          </g>
        </g>
      </g>
    </svg>
  );
}

// Each dog: its size, and how it carries its head and tail (degrees).
const PACK = [
  { size: 1, head: 6, tail: -46 },
  { size: 0.94, head: -22, tail: -8 },
  { size: 0.82, head: -12, tail: -34 },
  { size: 1.04, head: -2, tail: -22 },
];

export function Walkers() {
  return (
    <div className="poster" data-say="The Beagles">
      <svg className="zebra" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden>
        <polygon points="21,0 28,0 12,30 -2,30" />
        <polygon points="34,0 41,0 34,30 20,30" />
        <polygon points="46.5,0 53.5,0 57,30 43,30" />
        <polygon points="59,0 66,0 80,30 66,30" />
        <polygon points="72,0 79,0 102,30 88,30" />
      </svg>
      <div className="walk-line">
        {PACK.map((dog, i) => (
          <span
            key={i}
            className="walk-spot"
            style={{ "--size": dog.size, "--head": `${dog.head}deg`, "--tail": `${dog.tail}deg`, "--lap": `${(-12.8 * i) / PACK.length}s` } as React.CSSProperties}
          >
            <WalkingBeagle />
          </span>
        ))}
      </div>
    </div>
  );
}
