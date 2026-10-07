import type { BreedId } from "@/lib/flow";

// The five dog breeds, all in one hand-painted picture-book style: a tall
// neck, a domed head, two small dot eyes set high, an oversized nose and a
// grin that runs right across the muzzle. Every painted shape gets a chalky
// speckle on top (a tiled pattern, so it is free to animate).
// Parts use the shared class names (tail, head, ear, eye, tongue, bounce)
// that globals.css animates.

const INK = "#211e1c";
const CORAL = "#ee5f3f";
const CREAM = "#f8efe2";
const PINK = "#eda493";

type Dog = Exclude<BreedId, "indie-cat">;

const mouth = { fill: "none", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

// A painted shape: the flat colour, then the chalk speckle over it.
function P({ d, fill, ...rest }: { d: string; fill: string } & React.SVGProps<SVGPathElement>) {
  return (
    <>
      <path d={d} fill={fill} {...rest} />
      <path d={d} fill="url(#chalk)" {...rest} />
    </>
  );
}

// Scattered light and dark flecks for the chalk tile. Integer maths only,
// so the server and the browser always produce the same scatter.
const FLECKS = (() => {
  let seed = 7;
  const next = (n: number) => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed >> 8) % n;
  };
  return Array.from({ length: 70 }, (_, i) => ({
    x: next(96),
    y: next(96),
    w: 1 + next(3) * 0.6,
    h: 0.8 + next(3) * 0.5,
    turn: next(180),
    light: i % 4 !== 0,
  }));
})();

export function Chalk() {
  return (
    <defs>
      <pattern id="chalk" width="96" height="96" patternUnits="userSpaceOnUse">
        {FLECKS.map((f, i) => (
          <rect key={i} x={f.x} y={f.y} width={f.w} height={f.h} fill={f.light ? "#fff" : INK} opacity={f.light ? 0.32 : 0.1} transform={`rotate(${f.turn} ${f.x} ${f.y})`} />
        ))}
      </pattern>
    </defs>
  );
}

type Look = {
  coat: string;
  shade: string; // darker coat tone, for brush marks and toe lines
  front: string; // muzzle, bib and paws
  back?: string; // haunches and outer torso, when different from the coat
  blaze?: boolean;
  ear: "long" | "feather" | "up" | "fold" | "hair";
  earColor: string;
  collar?: string;
  tail: "whip" | "plume" | "curl" | "bush" | "puff";
  tailColor?: string;
  tailTip?: string;
  nose?: string;
  patch?: string; // eye patch
  knot?: boolean;
  tongue?: boolean;
  wave?: boolean;
  narrow?: boolean;
  round?: boolean; // small round head with no long neck
  pointed?: boolean; // face tapers to a narrow snout
  furry?: boolean; // extra tufts, ruff and feathering
};

const LOOKS: Record<Dog, Look> = {
  beagle: { coat: "#c9773c", shade: "#a85c26", front: "#ffffff", blaze: true, ear: "long", earColor: "#4a2a1c", collar: CORAL, tail: "whip", tailTip: "#ffffff" },
  golden: { coat: "#f2aa3c", shade: "#d98b22", front: "#f9d58d", ear: "feather", earColor: "#d98b22", collar: "#1f4fa3", tail: "plume", tailColor: "#d98b22", tongue: true, wave: true, furry: true },
  gsd: { coat: "#d98a4a", shade: "#b86b30", front: "#efb27a", back: INK, ear: "up", earColor: INK, collar: CORAL, tail: "bush", tailColor: INK, nose: "#2b2624", patch: "#3a2a22", tongue: true },
  indie: { coat: "#e0a469", shade: "#c4854a", front: CREAM, blaze: true, ear: "fold", earColor: "#e0a469", tail: "curl", patch: "#c4854a", narrow: true, pointed: true },
  shihtzu: { coat: "#ffffff", shade: "#d9cfc1", front: "#ffffff", ear: "hair", earColor: "#8a4b22", tail: "puff", patch: "#b9743f", knot: true, tongue: true, round: true },
};

const TAILS: Record<Look["tail"], string> = {
  whip: "M168 244 C204 238 214 204 206 176 C198 200 188 216 166 226 Z",
  plume: "M168 244 C204 246 234 226 232 194 C222 210 210 214 198 212 C206 222 194 232 172 228 Z",
  bush: "M168 246 C206 250 232 232 232 204 C220 218 204 222 192 216 C198 228 188 236 170 232 Z",
  curl: "M166 226 C204 228 216 186 194 172 C178 162 164 176 174 188 C180 194 190 190 190 182",
  puff: "M170 232 C204 226 224 198 208 172 C204 188 194 196 184 198 C192 206 186 222 170 224 Z",
};

function Ears({ k }: { k: Look }) {
  if (k.ear === "up" || k.ear === "fold") {
    return (
      <>
        <g className="ear" style={{ transformOrigin: "96px 34px" }}>
          <P d="M82 46 C70 22 74 -6 88 -22 C102 -8 112 16 112 36 Z" fill={k.earColor} />
          <path d="M88 36 C82 20 84 2 89 -8 C97 2 103 18 103 30 Z" fill={PINK} />
        </g>
        <g className="ear" style={{ transformOrigin: "144px 34px" }}>
          {k.ear === "fold" ? (
            <>
              <P d="M158 46 C168 30 172 14 172 0 C154 2 136 16 128 36 Z" fill={k.earColor} />
              <P d="M172 0 C186 8 192 26 188 44 C174 38 162 26 156 14 Z" fill={k.shade} />
            </>
          ) : (
            <>
              <P d="M158 46 C170 22 166 -6 152 -22 C138 -8 128 16 128 36 Z" fill={k.earColor} />
              <path d="M152 36 C158 20 156 2 151 -8 C143 2 137 18 137 30 Z" fill={PINK} />
            </>
          )}
        </g>
      </>
    );
  }
  const d =
    k.ear === "long"
      ? "M82 34 C56 44 40 110 46 164 C50 184 72 184 78 164 C86 120 90 70 82 34 Z"
      : k.ear === "hair"
        ? "M82 30 C48 40 34 104 44 156 C48 168 58 164 60 154 C64 170 76 166 78 152 C88 116 92 64 82 30 Z"
        : "M82 30 C54 38 38 86 44 132 C46 144 54 142 57 132 C58 148 68 146 70 134 C72 148 82 144 82 132 C90 104 92 62 82 30 Z";
  const flip = "translate(240 0) scale(-1 1)";
  return (
    <>
      <g className="ear" style={{ transformOrigin: "80px 36px" }}>
        <P d={d} fill={k.earColor} />
      </g>
      <g className="ear" style={{ transformOrigin: "160px 36px" }}>
        <g transform={flip}>
          <P d={d} fill={k.earColor} />
        </g>
      </g>
    </>
  );
}

function Painted({ id }: { id: Dog }) {
  const k = LOOKS[id];
  const back = k.back ?? k.coat;
  const tailColor = k.tailColor ?? k.coat;
  const line = k.front === "#ffffff" || k.front === CREAM ? INK : "#3a2a22";
  const squeeze = k.narrow ? "translate(120 0) scale(0.9 1) translate(-120 0)" : undefined;
  // The round head is the same face drawn smaller and lower, on a ball
  // instead of the dome-and-neck column.
  const headFit = k.round ? "translate(120 42) scale(0.8) translate(-120 0)" : undefined;
  const dome = k.round
    ? "M120 -2 C155 -2 182 26 182 60 C182 94 155 122 120 122 C85 122 58 94 58 60 C58 26 85 -2 120 -2 Z"
    : k.pointed
      ? "M120 6 C148 6 164 28 164 56 C164 84 152 104 147 124 L152 170 L88 170 L93 124 C88 104 76 84 76 56 C76 28 92 6 120 6 Z"
      : "M120 6 C150 6 168 30 168 58 L164 170 L76 170 L72 58 C72 30 90 6 120 6 Z";
  const muzzle = k.pointed
    ? "M120 50 C100 50 90 66 90 86 C90 108 104 128 120 136 C136 128 150 108 150 86 C150 66 140 50 120 50 Z M104 118 L104 172 L136 172 L136 118 Z"
    : "M120 50 C94 50 80 70 80 94 C80 114 92 126 96 142 L96 172 L144 172 L144 142 C148 126 160 114 160 94 C160 70 146 50 120 50 Z";
  const grin = k.pointed ? "M96 94 Q120 126 144 94" : "M84 92 Q120 134 156 92";
  const noseFit = k.pointed ? "translate(120 72) scale(0.84) translate(-120 -72)" : undefined;
  return (
    <svg viewBox="0 -24 240 304" className="pet-svg lively" aria-hidden>
      <Chalk />
      <ellipse className="shadow" cx="120" cy="265" rx="92" ry="9" />
      <g className="tail" style={{ transformOrigin: "170px 238px" }}>
        {k.tail === "curl" ? <path d={TAILS.curl} fill="none" stroke={tailColor} strokeWidth="12" strokeLinecap="round" /> : <P d={TAILS[k.tail]} fill={tailColor} />}
        {k.furry && <path d="M186 232 q20 -6 30 -22 M196 220 q14 -6 22 -18 M206 212 q10 -4 16 -12" fill="none" stroke={k.coat} strokeOpacity="0.7" strokeWidth="2.2" strokeLinecap="round" />}
        {k.tailTip && <path d="M207 180 C210 188 210 198 206 206" fill="none" stroke={k.tailTip} strokeWidth="9" strokeLinecap="round" />}
      </g>
      <g className="bounce">
        <g transform={squeeze}>
          <P d="M78 194 C46 194 28 222 34 248 C38 262 62 264 90 262 L90 206 Z" fill={back} />
          <P d="M162 194 C194 194 212 222 206 248 C202 262 178 264 150 262 L150 206 Z" fill={back} />
          {k.furry && (
            <>
              <P d="M40 214 l-12 6 l10 5 l-11 8 l11 4 l-8 10 l14 0 Z" fill={back} />
              <P d="M200 214 l12 6 l-10 5 l11 8 l-11 4 l8 10 l-14 0 Z" fill={back} />
              <path d="M52 216 q-6 14 -2 28 M64 210 q-5 16 -1 34 M188 216 q6 14 2 28 M176 210 q5 16 1 34" fill="none" stroke={k.shade} strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
          <rect x="32" y="248" width="50" height="17" rx="8.5" fill={k.front} />
          <rect x="158" y="248" width="50" height="17" rx="8.5" fill={k.front} />
          <P d="M78 140 C66 168 64 196 70 214 L70 260 L170 260 L170 214 C176 196 174 168 162 140 Z" fill={back} />
          <P d="M96 150 L96 258 L144 258 L144 150 Z" fill={k.front} />
          <g className="tap-l">
            <P d="M94 186 C90 210 92 238 92 252 C92 264 118 264 118 252 C118 238 120 210 116 186 Z" fill={k.back ? k.coat : k.front} />
            <path d="M99 254 v8 M110 254 v8" stroke={k.shade} strokeWidth="1.8" strokeLinecap="round" />
          </g>
          {k.wave ? (
            <g className="wave" style={{ transformOrigin: "142px 186px" }}>
              <path d="M140 186 C158 208 186 190 190 158" fill="none" stroke={k.coat} strokeWidth="24" strokeLinecap="round" />
              <circle cx="191" cy="150" r="15" fill={k.front} />
              <ellipse cx="191" cy="153" rx="6" ry="5" fill={k.shade} />
              <circle cx="182" cy="143" r="2.8" fill={k.shade} />
              <circle cx="191" cy="140" r="2.8" fill={k.shade} />
              <circle cx="200" cy="143" r="2.8" fill={k.shade} />
            </g>
          ) : (
            <g className="tap-r">
              <P d="M124 186 C120 210 122 238 122 252 C122 264 148 264 148 252 C148 238 150 210 146 186 Z" fill={k.back ? k.coat : k.front} />
              <path d="M130 254 v8 M141 254 v8" stroke={k.shade} strokeWidth="1.8" strokeLinecap="round" />
            </g>
          )}
          <path d="M120 196 v52" stroke={INK} strokeOpacity="0.25" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Head and long neck move as one piece, pivoting at the shoulders. */}
        <g className="head" style={{ transformOrigin: "120px 168px" }}>
          <g transform={headFit}>
          <Ears k={k} />
          {k.furry && (
            <>
              <P d="M74 62 l-11 7 l9 5 l-12 9 l10 4 l-11 11 l11 3 l-9 12 l12 1 l-6 13 l12 -4 Z" fill={k.coat} />
              <P d="M166 62 l11 7 l-9 5 l12 9 l-10 4 l11 11 l-11 3 l9 12 l-12 1 l6 13 l-12 -4 Z" fill={k.coat} />
            </>
          )}
          <P d={dome} fill={k.coat} />
          {k.patch && id !== "gsd" && <P d="M128 24 C146 20 160 34 158 52 C150 58 136 54 130 44 C126 38 126 30 128 24 Z" fill={k.patch} />}
          {id === "gsd" && <P d="M86 26 C96 6 144 6 154 26 C142 22 130 32 120 44 C110 32 98 22 86 26 Z" fill={k.patch!} />}
          {id === "shihtzu" && <P d="M112 24 C94 20 80 34 82 52 C90 58 104 54 110 44 C114 38 114 30 112 24 Z" fill={k.patch!} />}
          {k.blaze && <P d="M112 8 C110 24 110 40 106 56 L134 56 C130 40 130 24 128 8 Z" fill={k.front} />}
          {!k.round && <P d={muzzle} fill={k.front} />}
          {!k.round && <path d="M74 80 l-5 14 M166 84 l5 13 M78 132 l-4 16 M162 128 l4 15" stroke={k.coat} strokeWidth="2.4" strokeLinecap="round" />}
          {k.furry && (
            <>
              <P d="M80 146 C96 156 144 156 160 146 L157 170 L149 162 L146 184 L136 172 L131 196 L120 180 L109 196 L104 172 L94 184 L91 162 L83 170 Z" fill={k.front} />
              <path d="M88 24 q-6 14 -5 30 M152 24 q6 14 5 30 M100 148 q-2 14 2 24 M140 148 q2 14 -2 24 M120 150 v22" fill="none" stroke={k.shade} strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
          {k.collar && (
            <>
              <path d="M74 148 C96 158 144 158 166 148 L165 164 C144 174 96 174 75 164 Z" fill={k.collar} />
              <path d="M120 168 v8" stroke="#cfc8bd" strokeWidth="3" strokeLinecap="round" />
              <path d="M108 178 c-6 -4 -10 4 -4 7 c-6 3 -2 11 4 7 h24 c6 4 10 -4 4 -7 c6 -3 2 -11 -4 -7 Z" fill="#cfc8bd" />
            </>
          )}
          {k.tongue && <path className="tongue pant" d="M110 116 C109 140 131 140 130 116 Z" fill={CORAL} />}
          <path d={grin} stroke={line} {...mouth} strokeWidth="3" />
          <path d="M120 96 v20" stroke={line} {...mouth} strokeWidth="2.2" />
          <circle cx="98" cy="108" r="1.5" fill={line} />
          <circle cx="104" cy="113" r="1.5" fill={line} />
          <circle cx="142" cy="108" r="1.5" fill={line} />
          <circle cx="136" cy="113" r="1.5" fill={line} />
          <g transform={noseFit}>
            <path d="M94 62 C94 48 146 48 146 62 C146 82 132 96 120 96 C108 96 94 82 94 62 Z" fill={k.nose ?? INK} />
            <path d="M106 78 q3 -11 12 -6 M134 78 q-3 -11 -12 -6" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="2.4" strokeLinecap="round" />
          </g>
          <g className="eye" style={{ transformOrigin: "120px 38px" }}>
            <circle className="pupil" cx="106" cy="38" r="5.2" fill={INK} />
            <circle className="pupil" cx="134" cy="38" r="5.2" fill={INK} />
          </g>
          {k.knot ? (
            <g className="knot" style={{ transformOrigin: "120px 8px" }}>
              <path d="M110 10 C104 -8 96 -16 86 -20 C98 -22 112 -16 118 -6 C120 -16 126 -22 136 -24 C132 -16 132 -8 134 0 C142 -10 152 -14 162 -12 C148 -4 140 4 136 12 Z" fill="#fff" />
              <path d="M106 12 l14 7 l14 -7 v-12 l-14 6 l-14 -6 Z" fill={CORAL} />
            </g>
          ) : (
            <path d={k.furry ? "M106 6 q-6 -12 -14 -15 M114 4 q-2 -14 -8 -20 M121 3 q0 -15 6 -22 M128 4 q4 -12 12 -16 M134 7 q8 -8 16 -8" : "M112 4 q-3 -10 -9 -13 M120 3 q0 -12 5 -18 M127 4 q5 -8 12 -9"} fill="none" stroke={k.shade} strokeWidth={k.furry ? 2.4 : 1.8} strokeLinecap="round" />
          )}
          </g>
        </g>
      </g>
    </svg>
  );
}

// Beagle asleep on the end of a couch, chin on the armrest. It wakes up
// (eyes open, tail wags, the Zs stop) when hovered.
function BeagleOnCouch() {
  const tan = "#c9773c";
  const sofa = "#1f4fa3";
  const sofaLight = "#3566bd";
  return (
    <svg viewBox="0 0 400 300" className="pet-svg couch" aria-hidden>
      <Chalk />
      <ellipse className="shadow" cx="190" cy="290" rx="200" ry="9" />
      <P d="M-40 290 L-40 96 C10 44 120 50 170 76 C226 44 306 62 310 118 L310 290 Z" fill={sofa} />
      <path d="M170 76 C166 120 168 160 170 196" fill="none" stroke={sofaLight} strokeWidth="3" strokeLinecap="round" />
      <rect x="-40" y="196" width="330" height="58" rx="22" fill={sofaLight} />
      <rect x="-40" y="244" width="400" height="46" fill={sofa} />

      <g className="tail" style={{ transformOrigin: "92px 196px" }}>
        <path d="M94 196 Q66 208 62 236" fill="none" stroke={tan} strokeWidth="13" strokeLinecap="round" />
        <path d="M63 228 Q62 232 62 238" fill="none" stroke="#fff" strokeWidth="13" strokeLinecap="round" />
      </g>
      <g className="breathe" style={{ transformOrigin: "180px 206px" }}>
        <P d="M86 206 C84 164 130 148 190 150 C236 152 268 170 268 206 Z" fill="#fff" />
        <P d="M100 178 C116 152 176 146 216 158 C200 180 150 190 100 178 Z" fill={INK} />
        <path d="M86 206 C84 180 96 168 112 164 C108 182 106 196 110 206 Z" fill={tan} />
        <path d="M150 206 q14 -22 40 -18" fill="none" stroke={INK} strokeOpacity="0.3" strokeWidth="1.8" strokeLinecap="round" />
      </g>

      <rect x="246" y="168" width="124" height="122" rx="34" fill={sofa} />
      <rect x="246" y="168" width="124" height="36" rx="18" fill={sofaLight} />
      <rect x="254" y="186" width="22" height="62" rx="11" fill="#fff" />

      <g className="head" style={{ transformOrigin: "306px 190px" }}>
        <g className="ear" style={{ transformOrigin: "270px 124px" }}>
          <P d="M272 120 C250 130 238 178 244 216 C248 232 266 232 270 216 C278 184 280 150 272 120 Z" fill="#4a2a1c" />
        </g>
        <g className="ear" style={{ transformOrigin: "342px 124px" }}>
          <P d="M340 120 C362 130 374 178 368 216 C364 232 346 232 342 216 C334 184 332 150 340 120 Z" fill="#4a2a1c" />
        </g>
        <P d="M306 98 C338 98 354 122 354 146 C354 174 334 192 306 192 C278 192 258 174 258 146 C258 122 274 98 306 98 Z" fill={tan} />
        <P d="M299 100 C298 114 298 124 294 136 L318 136 C314 124 314 114 313 100 Z" fill="#fff" />
        <P d="M306 130 C282 130 270 146 270 164 C270 182 288 194 306 194 C324 194 342 182 342 164 C342 146 330 130 306 130 Z" fill="#fff" />
        <path d="M276 164 Q306 196 336 164" stroke={INK} {...mouth} strokeWidth="2.8" />
        <path d="M306 168 v13" stroke={INK} {...mouth} />
        <circle cx="288" cy="176" r="1.4" fill={INK} />
        <circle cx="293" cy="181" r="1.4" fill={INK} />
        <circle cx="324" cy="176" r="1.4" fill={INK} />
        <circle cx="319" cy="181" r="1.4" fill={INK} />
        <path d="M285 142 C285 130 327 130 327 142 C327 157 316 168 306 168 C296 168 285 157 285 142 Z" fill={INK} />
        <path d="M295 154 q3 -9 10 -5 M317 154 q-3 -9 -10 -5" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="2.2" strokeLinecap="round" />
        <path className="asleep" d="M287 121 q6.5 -7 13 0 M312 121 q6.5 -7 13 0" stroke={INK} {...mouth} strokeWidth="2.8" />
        <g className="awake">
          <circle cx="294" cy="119" r="4.6" fill={INK} />
          <circle cx="318" cy="119" r="4.6" fill={INK} />
        </g>
        <path d="M300 97 q-3 -9 -8 -12 M306 96 q0 -11 4 -16 M312 97 q4 -7 10 -8" fill="none" stroke="#a85c26" strokeWidth="1.8" strokeLinecap="round" />
      </g>
      <g className="zzz" fill={INK} fontWeight="800" fontFamily="inherit">
        <text x="352" y="96" fontSize="22">z</text>
        <text x="370" y="72" fontSize="17">z</text>
        <text x="384" y="54" fontSize="13">z</text>
      </g>
    </svg>
  );
}

export function BreedArt({ id, couch, happy, className = "" }: { id: Dog; couch?: boolean; happy?: boolean; className?: string }) {
  return (
    <span className={`pet pet-dog sitter sitter-${id} ${happy ? "is-happy" : ""} ${className}`} data-pat>
      {couch && id === "beagle" ? <BeagleOnCouch /> : <Painted id={id} />}
    </span>
  );
}
