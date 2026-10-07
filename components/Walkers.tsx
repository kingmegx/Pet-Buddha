import { Chalk } from "./Breeds";

// The "curating" loading scene: a white poster, "THE BEAGLES" in heavy black
// lettering, and a line of beagles walking over a black zebra crossing that
// fans out in perspective.
//
// The beagles are in the same picture-book style as the pick-your-dog
// screen: flat painted shapes with a chalk speckle, a small dot eye, an
// oversized nose, a long dark ear and a coral collar. No outlines.
//
// They really travel from left to right and loop round, each holding its
// head and tail differently. Every leg has a thigh and a shin, so paws lift
// and fold on the way forward. The motion is in globals.css under ".poster".

const INK = "#211e1c";
const TAN = "#c9773c";
const TAN_DEEP = "#a85c26";
const EAR = "#4a2a1c";
const WHITE = "#ffffff";
const FAR_WHITE = "#e6dfd5";
const CORAL = "#ee5f3f";

const BODY = "M58 92 C56 76 66 66 86 64 C112 61 150 60 176 64 C194 67 204 80 204 96 C204 110 196 122 182 126 C168 129 150 122 132 120 C112 118 92 122 78 118 C64 114 58 104 58 92 Z";
// From the head down to well inside the shoulders. It is drawn behind the
// body, so however the head tilts, its base never shows.
const NECK = "M176 104 C172 74 190 48 212 40 L232 70 C230 94 216 112 198 118 Z";
const EAR_SHAPE = "M216 22 C196 26 186 56 192 86 C194 98 210 98 214 86 C222 66 226 42 222 26 Z";

// A painted shape: flat colour, then the chalk speckle over it.
function P({ d, fill }: { d: string; fill: string }) {
  return (
    <>
      <path d={d} fill={fill} />
      <path d={d} fill="url(#chalk)" />
    </>
  );
}

function Leg({ x, y, beat, hind, far }: { x: number; y: number; beat: 1 | 2; hind?: boolean; far?: boolean }) {
  const upper = hind ? (far ? TAN_DEEP : TAN) : far ? FAR_WHITE : WHITE;
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

function Beagle() {
  return (
    <svg viewBox="0 0 296 190" className="walker" aria-hidden>
      <Chalk />
      <defs>
        <clipPath id="beagle-body">
          <path d={BODY} />
        </clipPath>
      </defs>
      <ellipse className="w-shadow" cx="134" cy="180" rx="90" ry="5" />
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

        <P d={BODY} fill={WHITE} />
        <g clipPath="url(#beagle-body)">
          <path d="M40 60 H96 C92 78 94 100 104 124 H40 Z" fill={TAN} />
          <path d="M176 56 H220 V130 H190 C180 110 174 84 176 56 Z" fill={TAN} />
          <P d="M84 56 H182 C180 76 176 90 168 98 C146 104 118 104 98 98 C88 88 84 74 84 56 Z" fill={INK} />
          <path d="M112 118 C140 118 160 130 184 124 C196 120 202 112 204 104 C186 116 150 114 124 110 Z" fill={FAR_WHITE} />
        </g>

        <Leg x={78} y={104} beat={1} hind />
        <Leg x={186} y={110} beat={2} />

        {/* head, collar and ear in front */}
        <g className="w-head" style={{ transformOrigin: "192px 88px" }}>
          <path d="M188 70 C196 80 208 86 220 88" fill="none" stroke={CORAL} strokeWidth="8" strokeLinecap="round" />
          <path d="M203 90 c-4 -2 -6 3 -3 5 c-3 2 -1 7 3 5 h9 c4 2 6 -3 3 -5 c3 -2 1 -7 -3 -5 Z" fill="#cfc8bd" />
          <P d="M204 46 C204 26 220 14 238 16 C252 18 260 30 260 42 C260 56 248 66 234 66 C218 66 204 60 204 46 Z" fill={TAN} />
          <path d="M242 17 C247 24 247 30 244 37 L234 36 C237 29 237 23 238 16 Z" fill={WHITE} />
          <P d="M232 36 C248 30 274 36 278 50 C280 62 268 72 252 72 C238 72 226 64 226 52 C226 44 228 39 232 36 Z" fill={WHITE} />
          <path d="M236 62 Q256 76 274 60" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="246" cy="58" r="1.1" fill={INK} />
          <circle cx="252" cy="61" r="1.1" fill={INK} />
          <ellipse cx="275" cy="47" rx="9" ry="8" fill={INK} />
          <path d="M270 44 q4 -4 9 -1" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
          <circle cx="238" cy="34" r="3.8" fill={INK} />
          <path d="M226 16 q-3 -8 -8 -10 M233 14 q0 -9 4 -13 M240 15 q4 -6 10 -7" fill="none" stroke={TAN_DEEP} strokeWidth="1.6" strokeLinecap="round" />
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
    <div className="poster">
      <div className="poster-title" aria-label="The Beagles">
        <span>THE</span>
        <strong>
          <b>B</b>EAGLES
        </strong>
      </div>
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
            <Beagle />
          </span>
        ))}
      </div>
    </div>
  );
}
