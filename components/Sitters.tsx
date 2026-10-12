import type { FaceId } from "@/lib/flow";
import { COAT, HEADS } from "./Faces";

// The landing-page cast: the same flat heads as the rest of the site, on
// plain sitting bodies that face the viewer. They lean in from the edges
// of the page (see ".edge" in globals.css). One body shape, coloured per
// animal. Heads keep their own motion (see ".face" in globals.css); the
// body adds a tail that sways, and wags under the hand (see ".sit").

type Who = FaceId | "cat";

type Body = {
  coat: string;
  // Haunches, leg lines and tail.
  dark: string;
  // Chest patch and paws, where they differ from the coat.
  bib?: string;
  paws: string;
  tail: "long" | "plume" | "thin";
  tailTip?: string;
};

const BODY: Record<Who, Body> = {
  beagle: { coat: COAT.tan, dark: COAT.brown, bib: COAT.cream, paws: COAT.cream, tail: "long", tailTip: COAT.cream },
  gsd: { coat: COAT.tan, dark: COAT.charcoal, paws: COAT.tan, tail: "plume" },
  golden: { coat: COAT.gold, dark: COAT.honey, bib: "#f2cd8e", paws: COAT.gold, tail: "plume" },
  indie: { coat: COAT.sand, dark: COAT.brown, bib: COAT.cream, paws: COAT.cream, tail: "thin" },
  shihtzu: { coat: COAT.cream, dark: COAT.brown, paws: COAT.cream, tail: "plume" },
  mixed: { coat: COAT.cream, dark: COAT.tan, paws: COAT.cream, tail: "long" },
  cat: { coat: COAT.charcoal, dark: "#2a272e", bib: COAT.cream, paws: COAT.cream, tail: "thin" },
};

const TAILS = {
  long: "M142 296 C176 298 194 266 184 228 C182 218 170 220 171 230 C174 252 164 270 142 272 Z",
  plume: "M140 298 C176 304 200 276 192 236 C190 226 184 232 180 224 C176 236 170 232 170 244 C164 258 156 268 140 270 Z",
  thin: "M142 294 C178 296 196 262 180 226 C176 218 166 222 169 230 C178 252 166 272 142 276 Z",
};

function CatHead() {
  const ear = (
    <>
      <path d="M42 96 L38 26 L92 58 Z" fill={COAT.charcoal} />
      <path d="M50 78 L48 44 L76 60 Z" fill={COAT.pink} />
    </>
  );
  return (
    <>
      <g className="f-ear" style={{ transformOrigin: "60px 70px" }}>
        {ear}
      </g>
      <g transform="translate(200 0) scale(-1 1)">
        <g className="f-ear" style={{ transformOrigin: "60px 70px" }}>
          {ear}
        </g>
      </g>
      <path d="M100 50 C142 50 166 76 166 110 C166 148 138 174 100 174 C62 174 34 148 34 110 C34 76 58 50 100 50 Z" fill={COAT.charcoal} />
      <g className="f-eyes">
        <circle className="f-eye" cx="72" cy="108" r="7" fill={COAT.gold} />
        <circle className="f-eye" cx="128" cy="108" r="7" fill={COAT.gold} />
      </g>
      <path d="M94 130 h12 l-6 7 Z" fill={COAT.pink} />
      <path d="M90 144 q5 5 10 0 q5 5 10 0" fill="none" stroke={COAT.cream} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M62 136 h-26 M62 144 l-24 8 M138 136 h26 M138 144 l24 8" fill="none" stroke={COAT.cream} strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

// `tint` repaints the coat in a bright colour. It is done in globals.css
// (".tint-blue", ".tint-coral") by swapping each coat colour for another.
export function Sitter({ id, bandana, tint, className = "" }: { id: Who; bandana?: string; tint?: "blue" | "coral"; className?: string }) {
  const b = BODY[id];
  const Head = id === "cat" ? CatHead : HEADS[id];
  return (
    <span className={`sit reactive ${tint ? `tint-${tint}` : ""} ${className}`} data-pat>
      <svg viewBox="0 0 200 310" className="sit-svg" aria-hidden>
        <g className="s-tail">
          <path d={TAILS[b.tail]} fill={b.dark === COAT.brown && id !== "shihtzu" ? b.coat : b.dark} />
          {b.tailTip && <path d="M184 228 C182 218 170 220 171 230 C172 238 172 244 171 250 L185 250 C187 243 186 235 184 228 Z" fill={b.tailTip} />}
        </g>
        <ellipse cx="56" cy="270" rx="28" ry="38" fill={b.dark} />
        <ellipse cx="144" cy="270" rx="28" ry="38" fill={b.dark} />
        <path d="M66 150 C46 196 44 262 54 308 L146 308 C156 262 154 196 134 150 Z" fill={b.coat} />
        {b.bib && <path d="M76 160 C68 198 74 236 100 250 C126 236 132 198 124 160 Z" fill={b.bib} />}
        <path d="M72 244 V298 M100 250 V304 M128 244 V298" fill="none" stroke={b.dark} strokeWidth="2.6" strokeLinecap="round" />
        <ellipse cx="85" cy="303" rx="17" ry="8" fill={b.paws} />
        <ellipse cx="115" cy="303" rx="17" ry="8" fill={b.paws} />
        {bandana && (
          <>
            <path d="M58 166 L142 166 L100 232 Z" fill={bandana} />
            {[
              [86, 190],
              [112, 192],
              [100, 210],
            ].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r="3" fill={COAT.cream} />
            ))}
          </>
        )}
        <g className="f-head">
          <Head />
        </g>
      </svg>
    </span>
  );
}
