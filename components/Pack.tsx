// The dog side of the "Who's your buddy?" screen: a pack of dogs in profile,
// overlapping, all on leashes and all looking across at the cats.
// data-mood on the <svg> drives the animation in globals.css:
//   idle  – tails sway, eyes blink
//   sniff – noses quiver
//   wag   – every tail wags
// While the hand is near, aimPack() turns each head to point at it.

const INK = "#211e1c";
const CORAL = "#ee5f3f";
const COBALT = "#1f4fa3";
const SUN = "#f5b041";
const CLAY = "#b5532f";
const PEACH = "#f7c9ac";
const CREAM = "#f8efe2";

export type PackMood = "idle" | "sniff" | "wag";

type Hound = {
  x: number;
  y: number;
  scale: number;
  coat: string;
  ear: "pointy" | "floppy" | "fluffy";
  earColor: string;
  collar: string;
  delay: number;
};

// Back row first, so the smaller dogs at the front overlap the big ones.
const HOUNDS: Hound[] = [
  { x: 170, y: 26, scale: 1.5, coat: CORAL, ear: "pointy", earColor: CORAL, collar: COBALT, delay: 0 },
  { x: 356, y: 64, scale: 1.45, coat: COBALT, ear: "fluffy", earColor: "#ffffff", collar: CORAL, delay: -0.3 },
  { x: 70, y: 150, scale: 1.02, coat: PEACH, ear: "pointy", earColor: "#f4a58c", collar: INK, delay: -0.7 },
  { x: 318, y: 212, scale: 1.32, coat: CLAY, ear: "floppy", earColor: INK, collar: SUN, delay: -0.15 },
  { x: 34, y: 286, scale: 1.02, coat: "#ffffff", ear: "floppy", earColor: INK, collar: CORAL, delay: -0.5 },
  { x: 196, y: 306, scale: 0.98, coat: SUN, ear: "pointy", earColor: "#dd9226", collar: COBALT, delay: -0.85 },
  { x: 408, y: 340, scale: 0.9, coat: INK, ear: "fluffy", earColor: CREAM, collar: SUN, delay: -0.4 },
];

function HoundShape({ h }: { h: Hound }) {
  const mark = h.coat === INK ? CREAM : INK;
  const ink = { fill: "none", stroke: mark, strokeWidth: 2.2, strokeLinecap: "round" as const };
  return (
    <g transform={`translate(${h.x} ${h.y}) scale(${h.scale})`} style={{ "--d": `${h.delay}s` } as React.CSSProperties}>
      <path className="p-tail" d="M172 162 Q206 132 192 84" fill="none" stroke={h.coat} strokeWidth="13" strokeLinecap="round" />
      <path d="M50 70 L106 62 C114 110 152 122 180 150 C196 170 196 230 196 460 L36 460 C36 300 60 200 50 70 Z" fill={h.coat} filter="url(#grain)" />
      <path d="M108 94 C200 136 320 110 760 158" fill="none" stroke={h.collar} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="80" cy="64" r="31" fill={h.coat} />
      <rect x="47" y="88" width="66" height="13" rx="6.5" fill={h.collar} transform="rotate(-7 80 94)" />
      <g className="p-head">
        {h.ear === "pointy" && <polygon className="p-ear" points="84,32 97,-10 110,36" fill={h.earColor} stroke={h.earColor} strokeWidth="4" strokeLinejoin="round" />}
        <ellipse cx="78" cy="52" rx="35" ry="29" fill={h.coat} />
        <path d="M72 27 L-6 45 C-13 49 -11 59 -3 61 L76 78 Z" fill={h.coat} />
        <ellipse className="p-nose" cx="-5" cy="52" rx="6.5" ry="5.5" fill={mark} />
        <path d="M4 61 q22 7 42 3" {...ink} />
        <circle cx="20" cy="50" r="1.3" fill={mark} />
        <circle cx="27" cy="54" r="1.3" fill={mark} />
        <g className="p-eye">
          <ellipse cx="60" cy="45" rx="3.6" ry="4.8" fill={mark} />
        </g>
        {h.ear === "floppy" && <ellipse className="p-ear" cx="100" cy="76" rx="17" ry="36" fill={h.earColor} transform="rotate(-8 100 44)" />}
        {h.ear === "fluffy" && (
          <path className="p-ear" d="M84 38 c8 -14 32 -12 38 2 c14 4 14 22 0 26 c0 10 -12 14 -18 6 c-6 10 -20 6 -20 -4 c-12 -2 -12 -24 0 -30 Z" fill={h.earColor} />
        )}
      </g>
    </g>
  );
}

export function Pack({ mood }: { mood: PackMood }) {
  return (
    <svg className="pack" viewBox="0 0 640 470" preserveAspectRatio="xMaxYMax meet" data-mood={mood} aria-hidden>
      {HOUNDS.map((h, i) => (
        <HoundShape key={i} h={h} />
      ))}
    </svg>
  );
}

// Turn every head towards a point on screen (or back to rest with null).
// The dogs face left, so the turn is measured from "pointing left" and
// capped so no neck bends too far.
export function aimPack(root: Element, at: { x: number; y: number } | null) {
  root.querySelectorAll<SVGGElement>(".p-head").forEach((head) => {
    if (!at) return head.style.setProperty("--aim", "0deg");
    const dog = head.parentElement as unknown as SVGGElement;
    const matrix = dog.getScreenCTM();
    if (!matrix) return;
    const neck = new DOMPoint(104, 80).matrixTransform(matrix);
    let turn = (Math.atan2(at.y - neck.y, at.x - neck.x) * 180) / Math.PI - 180;
    if (turn < -180) turn += 360;
    head.style.setProperty("--aim", `${Math.max(-24, Math.min(24, turn)).toFixed(1)}deg`);
  });
}
