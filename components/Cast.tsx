import type { BreedId } from "@/lib/flow";

// The landing-page cast. Each character is drawn in the style of the
// illustration references: one flat painted shape per body, long necks,
// a few thin ink lines, and a dry-brush grain over the top.
// Animated parts are marked with class names that globals.css drives:
// head, ear, eye, pupil, tongue, tail, paw, jaw, mouth, bark.

const INK = "#211e1c";
const CORAL = "#ee5f3f";
const CREAM = "#f8efe2";
const line = { fill: "none", stroke: INK, strokeWidth: 2.4, strokeLinecap: "round" as const };

// The two big dogs sit in the bottom corners, chunky and content, turned
// in towards the title: a white dog with a black ear and tail and a red
// bandana, and a golden with a collar.

function Shepherd() {
  return (
    <svg viewBox="0 0 300 360" className="pet-svg" aria-hidden>
      <g className="bounce" filter="url(#grain)">
        <g className="tail" style={{ transformOrigin: "92px 300px" }}>
          <path d="M100 318 C44 332 0 292 8 234 C20 250 34 254 46 246 C36 224 46 204 64 194 C70 216 86 238 104 262 Z" fill={INK} />
        </g>
        <path d="M214 150 C240 205 234 292 210 400 L66 400 C40 300 44 214 78 170 C102 140 156 130 214 150 Z" fill="#fff" />
        <path d="M186 400 v-124 M154 400 v-108" {...line} />
        <path d="M112 144 L216 144 L174 220 Z" fill={CORAL} />
        <path d="M114 146 l-36 -12 l10 23 l-22 12 Z" fill={CORAL} />
        <circle cx="154" cy="160" r="2.6" fill={CREAM} />
        <circle cx="180" cy="162" r="2.6" fill={CREAM} />
        <circle cx="167" cy="180" r="2.6" fill={CREAM} />
        <circle cx="194" cy="152" r="2.6" fill={CREAM} />
        <circle cx="172" cy="200" r="2.6" fill={CREAM} />
        <circle cx="138" cy="152" r="2.6" fill={CREAM} />
        <g className="head" style={{ transformOrigin: "164px 150px" }}>
          <circle cx="150" cy="48" r="13" fill="#fff" />
          <circle cx="170" cy="44" r="13" fill="#fff" />
          <ellipse cx="166" cy="98" rx="62" ry="56" fill="#fff" />
          <g transform="rotate(10 166 110)">
            <g className="jaw" style={{ transformOrigin: "176px 122px" }}>
              <rect x="172" y="112" width="66" height="24" rx="12" fill="#fff" />
              <rect className="mouth" x="184" y="112" width="46" height="13" rx="6" fill="#8c3a3a" />
            </g>
            <rect x="156" y="88" width="100" height="46" rx="23" fill="#fff" />
            <ellipse cx="242" cy="108" rx="17" ry="14" fill="#8c3a3a" />
            <path d="M176 128 q28 8 52 -2" {...line} />
            <circle cx="206" cy="112" r="1.7" fill={INK} />
            <circle cx="214" cy="118" r="1.7" fill={INK} />
            <circle cx="198" cy="119" r="1.7" fill={INK} />
          </g>
          <g className="eye" style={{ transformOrigin: "178px 94px" }}>
            <ellipse cx="178" cy="94" rx="5.5" ry="7.5" fill={INK} />
            <circle cx="179.8" cy="91" r="1.8" fill="#fff" />
          </g>
          <g className="ear" style={{ transformOrigin: "134px 60px" }}>
            <path d="M134 56 C94 64 84 142 104 190 C128 200 148 162 144 110 Z" fill={INK} />
          </g>
        </g>
        <path className="bark" d="M278 96 l20 -11 M286 130 h22 M278 164 l20 11" {...line} strokeWidth="4.5" />
      </g>
    </svg>
  );
}

function Golden() {
  const gold = "#e9a03c";
  return (
    <svg viewBox="0 0 300 360" className="pet-svg" aria-hidden>
      <g className="bounce" filter="url(#grain)">
        <g className="tail" style={{ transformOrigin: "212px 300px" }}>
          <path d="M204 314 C262 318 300 270 292 194 C284 214 274 222 262 222 C268 240 258 256 240 258 C236 270 226 276 212 274 Z" fill="#d98a2b" />
        </g>
        <path d="M86 150 C60 205 66 292 90 400 L234 400 C260 300 256 214 222 170 C198 140 144 130 86 150 Z" fill={gold} />
        <path d="M114 400 v-124 M146 400 v-108" {...line} />
        <path d="M176 246 l10 -6 M184 264 l10 -6 M172 282 l10 -6 M150 232 l8 -8" {...line} strokeWidth="1.8" />
        <g className="head" style={{ transformOrigin: "136px 150px" }}>
          <ellipse cx="134" cy="98" rx="62" ry="56" fill={gold} />
          <g transform="rotate(8 134 108)">
            <rect className="tongue" x="74" y="122" width="24" height="28" rx="11" fill={CORAL} />
            <rect x="40" y="86" width="104" height="46" rx="23" fill={gold} />
            <ellipse cx="48" cy="100" rx="9.5" ry="8" fill={INK} />
            <circle cx="72" cy="106" r="1.7" fill={INK} />
            <circle cx="80" cy="112" r="1.7" fill={INK} />
            <circle cx="88" cy="105" r="1.7" fill={INK} />
            <path d="M58 124 q30 12 58 -2" {...line} />
          </g>
          <g className="eye" style={{ transformOrigin: "122px 94px" }}>
            <ellipse cx="122" cy="94" rx="5.5" ry="7.5" fill={INK} />
            <circle cx="123.8" cy="91" r="1.8" fill="#fff" />
          </g>
          <g className="ear" style={{ transformOrigin: "168px 60px" }}>
            <path d="M162 56 C204 62 214 122 202 162 C196 174 188 174 184 164 C180 178 170 178 166 166 C160 174 154 166 156 110 Z" fill="#dd9230" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
          </g>
        </g>
        <rect x="88" y="146" width="106" height="14" rx="7" fill={INK} transform="rotate(-3 140 153)" />
        <circle cx="136" cy="170" r="8" fill={CREAM} />
      </g>
    </svg>
  );
}

function Indie() {
  const red = "#ee6a47";
  return (
    <svg viewBox="0 0 260 380" className="pet-svg" aria-hidden>
      <g className="bounce" filter="url(#grain)">
        <path d="M20 380 C24 290 60 230 84 160 L166 160 C176 240 210 300 214 380 Z" fill={red} />
        <path d="M98 380 v-78 M140 380 v-78" {...line} />
        <g className="head" style={{ transformOrigin: "125px 170px" }}>
          <g className="ear" style={{ transformOrigin: "104px 90px" }}>
            <polygon points="104,88 62,34 126,78" fill="#cf5433" stroke="#cf5433" strokeWidth="6" strokeLinejoin="round" />
          </g>
          <g className="ear" style={{ transformOrigin: "88px 112px" }}>
            <polygon points="92,100 30,84 84,142" fill={red} stroke={red} strokeWidth="6" strokeLinejoin="round" />
            <polygon points="80,110 48,100 78,130" fill="#f4a58c" />
          </g>
          <ellipse cx="128" cy="124" rx="52" ry="45" fill={red} />
          <rect x="130" y="92" width="108" height="42" rx="21" fill={red} transform="rotate(-28 136 113)" />
          <ellipse cx="226" cy="64" rx="10" ry="8" fill={INK} transform="rotate(-28 226 64)" />
          <path d="M160 132 q22 2 40 -20" {...line} />
          <g className="eye" style={{ transformOrigin: "132px 98px" }}>
            <circle cx="118" cy="104" r="9" fill="#fff" />
            <circle cx="146" cy="92" r="9" fill="#fff" />
            <circle className="pupil" cx="121" cy="102" r="4.4" fill={INK} />
            <circle className="pupil" cx="149" cy="90" r="4.4" fill={INK} />
          </g>
        </g>
      </g>
    </svg>
  );
}

function Beagle() {
  // Drawn to hang upside down from the top edge, so the long ears fall
  // "upwards" in this drawing and end up hanging with gravity on screen.
  return (
    <svg viewBox="0 0 240 300" className="pet-svg" aria-hidden>
      <g className="bounce" filter="url(#grain)">
        <g className="ear" style={{ transformOrigin: "52px 136px" }}>
          <ellipse cx="34" cy="56" rx="26" ry="92" transform="rotate(-8 52 136)" fill={INK} />
        </g>
        <g className="ear" style={{ transformOrigin: "188px 136px" }}>
          <ellipse cx="206" cy="56" rx="26" ry="92" transform="rotate(8 188 136)" fill={INK} />
        </g>
        <path d="M48 300 L48 150 C48 70 192 70 192 150 L192 300 Z" fill="#d9813a" />
        <path d="M110 84 h20 v52 C172 138 180 168 178 204 C176 250 152 268 150 300 H90 C88 268 64 250 62 204 C60 168 68 138 110 136 Z" fill="#fff" />
        <g className="eye" style={{ transformOrigin: "120px 122px" }}>
          <ellipse cx="90" cy="122" rx="4.5" ry="7" fill={INK} />
          <ellipse cx="150" cy="122" rx="4.5" ry="7" fill={INK} />
        </g>
        <path d="M100 150 h40 q8 0 4 10 l-16 22 q-8 6 -16 0 l-16 -22 q-4 -10 4 -10 Z" fill={INK} />
        <path d="M70 184 q50 40 100 0 M120 188 v14" {...line} />
        <circle cx="96" cy="196" r="1.6" fill={INK} />
        <circle cx="144" cy="196" r="1.6" fill={INK} />
      </g>
    </svg>
  );
}

function Cat() {
  const fur = "#231c1c";
  return (
    <svg viewBox="0 0 260 220" className="pet-svg" aria-hidden>
      <g filter="url(#grain)">
        <g className="tail" style={{ transformOrigin: "214px 214px" }}>
          <path d="M210 216 Q264 192 244 118" fill="none" stroke={fur} strokeWidth="22" strokeLinecap="round" />
        </g>
        <g className="paw" style={{ transformOrigin: "40px 216px" }}>
          <rect x="22" y="72" width="36" height="150" rx="18" fill={fur} />
          <rect x="19" y="50" width="42" height="54" rx="19" fill={CREAM} />
          <ellipse cx="40" cy="84" rx="8.5" ry="7" fill={fur} />
          <circle cx="28" cy="68" r="3.6" fill={fur} />
          <circle cx="40" cy="63" r="3.6" fill={fur} />
          <circle cx="52" cy="68" r="3.6" fill={fur} />
        </g>
        <g className="bounce">
          <g className="head" style={{ transformOrigin: "140px 216px" }}>
            <g className="ear" style={{ transformOrigin: "104px 90px" }}>
              <polygon points="78,98 86,24 132,72" fill={fur} stroke={fur} strokeWidth="6" strokeLinejoin="round" />
              <polygon points="91,84 95,48 117,74" fill="#6b3838" />
            </g>
            <g className="ear" style={{ transformOrigin: "176px 90px" }}>
              <polygon points="202,98 194,24 148,72" fill={fur} stroke={fur} strokeWidth="6" strokeLinejoin="round" />
              <polygon points="189,84 185,48 163,74" fill="#6b3838" />
            </g>
            <path d="M52 150 C52 90 96 62 140 62 C184 62 228 90 228 150 C228 190 200 226 140 226 C80 226 52 190 52 150 Z" fill={fur} />
            <path d="M58 146 l-22 14 l24 10 Z M222 146 l22 14 l-24 10 Z" fill={fur} />
            <g className="eye" style={{ transformOrigin: "140px 138px" }}>
              <circle cx="108" cy="138" r="21" fill="#f3b43f" />
              <circle cx="172" cy="138" r="21" fill="#f3b43f" />
              <circle className="pupil" cx="108" cy="138" r="10" fill={INK} />
              <circle className="pupil" cx="172" cy="138" r="10" fill={INK} />
              <circle cx="115" cy="130" r="3.6" fill="#fff" />
              <circle cx="179" cy="130" r="3.6" fill="#fff" />
            </g>
            <path d="M133 161 h14 l-7 8 Z" fill="#8f8782" />
            <path d="M140 169 v6" fill="none" stroke="#8f8782" strokeWidth="2" strokeLinecap="round" />
            <path d="M98 168 l-58 -12 M98 176 l-60 6 M182 168 l58 -12 M182 176 l60 6" stroke="#fffaf2" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M96 226 l10 -20 l8 12 l10 -18 l10 16 l12 -16 l10 18 l8 -12 l10 20 Z" fill={CREAM} />
          </g>
        </g>
      </g>
    </svg>
  );
}

const DRAWINGS: Partial<Record<BreedId, () => React.JSX.Element>> = {
  gsd: Shepherd,
  golden: Golden,
  indie: Indie,
  beagle: Beagle,
  "indie-cat": Cat,
};

export function Toon({ id, className = "" }: { id: BreedId; className?: string }) {
  const Drawing = DRAWINGS[id];
  if (!Drawing) return null;
  return (
    <span className={`pet toon reactive ${id === "indie-cat" ? "" : "pet-dog"} ${className}`} data-pat>
      <Drawing />
    </span>
  );
}

// The dry-brush speckle shared by every character.
export function CastDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <filter id="grain" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.5 0 0 0 -0.92" result="specks" />
        <feComposite in="specks" in2="SourceGraphic" operator="in" result="brush" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="brush" />
        </feMerge>
      </filter>
    </svg>
  );
}
