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

function Features({ eyeX = 28, eyeY = 102, eye = 5.5, noseY = 132, line = COAT.ink }: { eyeX?: number; eyeY?: number; eye?: number; noseY?: number; line?: string }) {
  return (
    <>
      <g className="f-eyes">
        <circle className="f-eye" cx={100 - eyeX} cy={eyeY} r={eye} fill={COAT.ink} />
        <circle className="f-eye" cx={100 + eyeX} cy={eyeY} r={eye} fill={COAT.ink} />
      </g>
      <g className="f-tongue" style={{ transformOrigin: `100px ${noseY + 15}px` }}>
        <path d={`M91 ${noseY + 14} h18 v11 a9 9 0 0 1 -18 0 Z`} fill={COAT.pink} />
      </g>
      <path d={`M87 ${noseY + 13} q6.5 7 13 0 q6.5 7 13 0`} fill="none" stroke={line} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="100" cy={noseY} rx="12.5" ry="9" fill={COAT.ink} />
    </>
  );
}

// Each breed has its own outline, so they read as different dogs even in silhouette.

// Narrow oval face, long ears that hang below the chin, a white blaze.
function Beagle() {
  return (
    <>
      <Ears pivot={[58, 58]}>
        <path d="M54 56 C22 58 6 112 16 160 C22 190 56 190 62 160 C68 124 66 86 64 58 Z" fill={COAT.brown} />
      </Ears>
      <path d="M100 30 C134 30 152 58 152 100 C152 146 132 178 100 178 C68 178 48 146 48 100 C48 58 66 30 100 30 Z" fill={COAT.tan} />
      <path d="M92 30 C92 62 80 90 74 120 C68 154 82 178 100 178 C118 178 132 154 126 120 C120 90 108 62 108 30 Z" fill={COAT.cream} />
      <Features eyeX={26} eyeY={100} noseY={136} />
    </>
  );
}

// Wide head with fluffy cheeks and feathered ears.
function Golden() {
  return (
    <>
      <Ears pivot={[56, 62]}>
        <path d="M50 62 C24 66 12 106 18 146 C21 158 28 150 33 161 C39 172 47 160 54 169 C64 164 66 142 66 120 C66 96 64 78 62 62 Z" fill={COAT.honey} />
      </Ears>
      <path
        d="M100 32 C140 32 166 58 166 98 C166 112 162 122 168 134 C160 136 158 146 160 156 C150 154 144 162 142 170 C132 164 118 178 100 178 C82 178 68 164 58 170 C56 162 50 154 40 156 C42 146 40 136 32 134 C38 122 34 112 34 98 C34 58 60 32 100 32 Z"
        fill={COAT.gold}
      />
      <ellipse cx="100" cy="142" rx="32" ry="26" fill="#f2cd8e" />
      <Features eyeX={29} eyeY={100} noseY={134} />
    </>
  );
}

// A wedge: tall pointed ears, cheek points, a dark cap and a dark muzzle.
function Shepherd() {
  return (
    <>
      <Ears pivot={[66, 62]}>
        <path d="M46 78 L40 2 C62 14 86 36 94 58 Z" fill={COAT.charcoal} />
        <path d="M54 64 L50 22 C62 32 76 46 82 56 Z" fill={COAT.pink} />
      </Ears>
      <path
        d="M100 36 C128 36 150 50 158 76 C164 96 160 112 166 124 C152 126 146 138 136 152 C126 168 114 180 100 180 C86 180 74 168 64 152 C54 138 48 126 34 124 C40 112 36 96 42 76 C50 50 72 36 100 36 Z"
        fill={COAT.tan}
      />
      <path d="M56 54 C76 38 124 38 144 54 C134 70 118 76 108 78 L100 92 L92 78 C82 76 66 70 56 54 Z" fill={COAT.charcoal} />
      <path d="M100 106 C120 106 132 124 130 146 C128 166 114 180 100 180 C86 180 72 166 70 146 C68 124 80 106 100 106 Z" fill={COAT.cocoa} />
      <Features eyeX={29} eyeY={98} noseY={138} />
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
