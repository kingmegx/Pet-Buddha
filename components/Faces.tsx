import type { FaceId } from "@/lib/flow";

// Dog heads, flat and front-on: plain shapes, dot eyes, no shading.
// Five breeds have their own head; "mixed" stands in for every other dog.
// Parts are named so globals.css can move them (see ".face"):
//   f-head   – tilts when the dog is happy
//   f-ear    – sways gently, flaps when happy
//   f-eyes   – drift towards the hand; each f-eye blinks
//   f-tongue – tucked away until the dog is happy

export const COAT = {
  ink: "#211e1c",
  tan: "#cf7d4a",
  brown: "#a8552c",
  gold: "#e3a44a",
  honey: "#cf8a30",
  sand: "#d9a06a",
  cream: "#f7f1e3",
  oat: "#efe3cd",
  charcoal: "#3a3640",
  cocoa: "#5a4640",
  pink: "#f08ba0",
};

const ROUND = "M100 34 C142 34 164 62 164 104 C164 148 138 174 100 174 C62 174 36 148 36 104 C36 62 58 34 100 34 Z";
const SLIM = "M100 38 C134 38 156 62 156 98 C156 126 140 152 121 167 C109 177 91 177 79 167 C60 152 44 126 44 98 C44 62 66 38 100 38 Z";

// Draws the left ear, then the same ear mirrored on the right.
function Ears({ children, pivot }: { children: React.ReactNode; pivot: [number, number] }) {
  const origin = { transformOrigin: `${pivot[0]}px ${pivot[1]}px` };
  return (
    <>
      <g className="f-ear" style={origin}>
        {children}
      </g>
      <g transform="translate(200 0) scale(-1 1)">
        <g className="f-ear" style={origin}>
          {children}
        </g>
      </g>
    </>
  );
}

function Features({
  eyeX = 28,
  eyeY = 102,
  eye = 5.5,
  eyeRy,
  noseY = 132,
  noseW = 12.5,
  noseH = 9,
  mouth = true,
  line = COAT.ink,
}: {
  eyeX?: number;
  eyeY?: number;
  eye?: number;
  // Set for flatter, sleepier eyes; round when left out.
  eyeRy?: number;
  noseY?: number;
  noseW?: number;
  noseH?: number;
  // The little "w" under the nose. Some faces are just eyes and a nose.
  mouth?: boolean;
  line?: string;
}) {
  const under = noseY + noseH;
  return (
    <>
      <g className="f-eyes">
        <ellipse className="f-eye" cx={100 - eyeX} cy={eyeY} rx={eye} ry={eyeRy ?? eye} fill={COAT.ink} />
        <ellipse className="f-eye" cx={100 + eyeX} cy={eyeY} rx={eye} ry={eyeRy ?? eye} fill={COAT.ink} />
      </g>
      <g className="f-tongue" style={{ transformOrigin: `100px ${under + 4}px` }}>
        <path d={`M91 ${under + 3} h18 v11 a9 9 0 0 1 -18 0 Z`} fill={COAT.pink} />
      </g>
      {mouth && <path d={`M87 ${under + 4} q6.5 7 13 0 q6.5 7 13 0`} fill="none" stroke={line} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      <path d={`M${100 - noseW} ${noseY - noseH * 0.2} C${100 - noseW} ${noseY - noseH * 1.1} ${100 + noseW} ${noseY - noseH * 1.1} ${100 + noseW} ${noseY - noseH * 0.2} C${100 + noseW} ${noseY + noseH * 0.6} ${100 + noseW * 0.35} ${under} 100 ${under} C${100 - noseW * 0.35} ${under} ${100 - noseW} ${noseY + noseH * 0.6} ${100 - noseW} ${noseY - noseH * 0.2} Z`} fill={COAT.ink} />
    </>
  );
}

// Each breed has its own outline, so they read as different dogs even in silhouette.

// The three below share one build: a rounded head, a muzzle that hangs a
// little below it, leaf-shaped ears, dot eyes and a soft triangular nose.
const DOME = "M100 34 C140 34 158 60 158 98 C158 122 154 140 146 150 C140 156 132 158 124 158 L76 158 C68 158 60 156 54 150 C46 140 42 122 42 98 C42 60 60 34 100 34 Z";

// Big ears that splay out from the sides, a thin blaze widening into a broad cream muzzle.
function Beagle() {
  return (
    <>
      <Ears pivot={[58, 64]}>
        <path d="M54 60 C24 64 4 104 12 150 C16 178 44 182 57 158 C68 136 68 96 66 64 Z" fill="#b96a3c" />
      </Ears>
      <path d={DOME} fill={COAT.tan} />
      <path d="M92 34 C92 66 88 84 76 100 C60 120 58 152 70 170 C80 184 120 184 130 170 C142 152 140 120 124 100 C112 84 108 66 108 34 Z" fill={COAT.cream} />
      <Features eyeX={29} eyeY={100} noseY={144} noseW={17} noseH={13} mouth={false} />
    </>
  );
}

// A tall, soft-cornered face in pale gold, with darker feathered ears that
// hang from the top corners down to the jaw. Just eyes and a wide nose.
function Golden() {
  return (
    <>
      <Ears pivot={[64, 46]}>
        <path
          d="M70 40 C50 32 30 42 23 62 C17 80 19 100 21 114 C21 122 27 120 27 129 C27 139 35 135 35 145 C37 155 45 150 47 158 C54 160 57 150 57 140 L57 80 C57 62 61 50 70 40 Z"
          fill="#d6953f"
        />
      </Ears>
      <path d="M70 40 C80 34 120 34 130 40 C142 46 146 60 146 80 L144 130 C142 160 124 178 100 178 C76 178 58 160 56 130 L54 80 C54 60 58 46 70 40 Z" fill="#f2c56e" />
      <Features eyeX={18} eyeY={98} eye={6} noseY={146} noseW={16} noseH={10} mouth={false} />
    </>
  );
}

// Tall rounded ears with pink insides, a dark mask with tan around the eyes, a grey muzzle.
function Shepherd() {
  return (
    <>
      <Ears pivot={[68, 64]}>
        <path d="M48 80 C38 46 42 14 58 6 C76 22 88 46 92 64 Z" fill={COAT.charcoal} />
        <path d="M56 68 C50 46 52 28 60 22 C70 34 78 48 82 62 Z" fill="#d9a0aa" />
      </Ears>
      <path d={DOME} fill={COAT.tan} />
      <path d="M100 40 C130 40 148 58 148 88 C148 114 128 130 100 130 C72 130 52 114 52 88 C52 58 70 40 100 40 Z" fill={COAT.charcoal} />
      <ellipse cx="74" cy="94" rx="13" ry="11" fill={COAT.tan} />
      <ellipse cx="126" cy="94" rx="13" ry="11" fill={COAT.tan} />
      <path d="M100 106 C122 106 132 124 130 148 C128 170 114 182 100 182 C86 182 72 170 70 148 C68 124 78 106 100 106 Z" fill="#8f8a92" />
      <Features eyeX={26} eyeY={94} noseY={140} noseW={14} noseH={10} />
    </>
  );
}

// Slim and long in the face, with big ears that fold at the tips.
function Indie() {
  return (
    <>
      <Ears pivot={[70, 60]}>
        <path d="M58 70 L26 16 C50 14 80 30 92 54 Z" fill={COAT.sand} />
        <path d="M26 16 C40 16 52 26 58 40 L40 40 Z" fill={COAT.brown} />
      </Ears>
      <path d="M100 40 C128 40 146 60 146 90 C146 116 134 142 120 162 C112 174 106 180 100 180 C94 180 88 174 80 162 C66 142 54 116 54 90 C54 60 72 40 100 40 Z" fill={COAT.sand} />
      <path d="M93 40 C93 66 84 90 80 116 C76 146 88 180 100 180 C112 180 124 146 120 116 C116 90 107 66 107 40 Z" fill={COAT.cream} />
      <Features eyeX={24} eyeY={96} noseY={140} />
    </>
  );
}

// Wide and shaggy: long hair for ears, a top knot, a flat face with a moustache.
function ShihTzu() {
  return (
    <>
      <Ears pivot={[58, 62]}>
        <path d="M52 60 C22 64 8 104 14 150 L22 142 L28 162 L38 148 L46 168 L56 150 L64 160 C70 130 68 90 64 62 Z" fill={COAT.brown} />
      </Ears>
      <path d="M100 48 C92 30 82 24 72 28 C82 32 86 42 88 52 Z M100 48 C100 28 104 18 114 16 C110 26 112 38 110 50 Z M104 50 C114 34 124 32 132 38 C122 40 118 48 114 54 Z" fill={COAT.brown} />
      <path
        d="M100 44 C140 44 166 66 166 102 C166 116 172 124 170 136 L158 134 L160 150 L146 146 L144 162 L130 156 C122 168 112 174 100 174 C88 174 78 168 70 156 L56 162 L54 146 L40 150 L42 134 L30 136 C28 124 34 116 34 102 C34 66 60 44 100 44 Z"
        fill={COAT.cream}
      />
      <ellipse cx="82" cy="138" rx="24" ry="17" fill={COAT.oat} />
      <ellipse cx="118" cy="138" rx="24" ry="17" fill={COAT.oat} />
      <Features eyeX={30} eyeY={104} eye={6.5} noseY={126} />
    </>
  );
}

// One ear up, one ear down, a patch over one eye: nobody's breed in particular.
function Mixed() {
  return (
    <>
      <g className="f-ear" style={{ transformOrigin: "56px 62px" }}>
        <path d="M50 60 C24 62 16 110 28 146 C36 166 60 162 63 140 C66 112 64 84 62 62 Z" fill={COAT.tan} />
      </g>
      <g className="f-ear" style={{ transformOrigin: "136px 60px" }}>
        <path d="M150 70 L162 14 C142 20 120 36 110 56 Z" fill={COAT.tan} />
        <path d="M145 60 L152 30 C140 36 128 46 122 56 Z" fill={COAT.pink} />
      </g>
      <clipPath id="mixed-head">
        <path d={ROUND} />
      </clipPath>
      <path d={ROUND} fill={COAT.cream} />
      <ellipse cx="134" cy="88" rx="34" ry="38" fill={COAT.tan} clipPath="url(#mixed-head)" />
      <Features />
    </>
  );
}

export const HEADS: Record<FaceId, () => React.ReactNode> = { beagle: Beagle, golden: Golden, gsd: Shepherd, indie: Indie, shihtzu: ShihTzu, mixed: Mixed };

export function Face({ id, happy, className = "" }: { id: FaceId; happy?: boolean; className?: string }) {
  const Head = HEADS[id];
  return (
    <span className={`face ${happy ? "is-happy" : ""} ${className}`} data-pat>
      <svg viewBox="0 0 200 200" className="face-svg" aria-hidden>
        <g className="f-head">
          <Head />
        </g>
      </svg>
    </span>
  );
}
