import type { BreedId } from "@/lib/flow";

// Stand-in characters drawn in code. Each one is split into named parts
// (tail, head, ear, eye, tongue) that globals.css animates. To use real
// artwork, replace the SVG inside a component and keep the part class names.

const INK = "#211e1c";

type DogLook = {
  coat: string;
  head?: string;
  ear: "floppy" | "pointy";
  earColor: string;
  snout: string;
  saddle?: string;
  spots?: string;
  tail: "straight" | "plume" | "curl";
  tailColor?: string;
  tailTip?: string;
  topknot?: boolean;
  size: number;
};

const DOGS: Record<Exclude<BreedId, "indie-cat">, DogLook> = {
  golden: { coat: "#f5b041", ear: "floppy", earColor: "#dd9226", snout: "#fbd78f", tail: "plume", size: 1 },
  gsd: { coat: "#d98a4a", ear: "pointy", earColor: INK, snout: INK, saddle: INK, tail: "plume", tailColor: INK, size: 1.04 },
  beagle: { coat: "#ffffff", head: "#d9813a", ear: "floppy", earColor: INK, snout: "#ffffff", saddle: INK, spots: "#d9813a", tail: "straight", tailColor: "#d9813a", tailTip: "#ffffff", size: 0.8 },
  indie: { coat: "#e9805a", ear: "pointy", earColor: "#cf6540", snout: "#f7c9ac", tail: "curl", size: 0.9 },
  shihtzu: { coat: "#ffffff", ear: "floppy", earColor: "#bcd6e2", snout: "#ffffff", saddle: "#bcd6e2", tail: "curl", tailColor: "#bcd6e2", topknot: true, size: 0.64 },
};

const TAILS = {
  straight: "M52 98 Q34 80 38 52",
  plume: "M52 98 Q28 82 36 48",
  curl: "M52 98 Q26 86 32 62 Q38 44 54 56",
};

function Dog({ look }: { look: DogLook }) {
  const head = look.head ?? look.coat;
  const tail = look.tailColor ?? look.coat;
  const id = `clip-${look.coat.slice(1)}-${look.ear}-${look.tail}`;
  return (
    <svg viewBox="0 0 220 180" className="pet-svg" style={{ width: `${look.size * 100}%` }} aria-hidden>
      <ellipse className="shadow" cx="110" cy="165" rx="66" ry="6" />
      <g className="bounce">
        <g className="tail" style={{ transformOrigin: "52px 98px" }}>
          <path d={TAILS[look.tail]} fill="none" stroke={tail} strokeWidth={look.tail === "plume" ? 17 : 11} strokeLinecap="round" />
          {look.tailTip && <path d="M36.5 62 Q35.5 56 38 52" fill="none" stroke={look.tailTip} strokeWidth="11" strokeLinecap="round" />}
        </g>
        <rect x="58" y="116" width="15" height="48" rx="7.5" fill={look.coat} />
        <rect x="132" y="116" width="15" height="48" rx="7.5" fill={look.coat} />
        <clipPath id={id}>
          <rect x="44" y="78" width="124" height="58" rx="29" />
        </clipPath>
        <rect x="44" y="78" width="124" height="58" rx="29" fill={look.coat} />
        <g clipPath={`url(#${id})`}>
          {look.saddle && <ellipse cx="98" cy="76" rx="44" ry="24" fill={look.saddle} />}
          {look.spots && <circle cx="140" cy="122" r="13" fill={look.spots} />}
        </g>
        <rect x="76" y="118" width="15" height="46" rx="7.5" fill={look.coat} />
        <rect x="150" y="118" width="15" height="46" rx="7.5" fill={look.coat} />
        <g className="head" style={{ transformOrigin: "160px 84px" }}>
          <ellipse cx="166" cy="60" rx="30" ry="27" fill={head} />
          <rect x="170" y="56" width="42" height="26" rx="13" fill={look.snout} />
          <ellipse className="tongue" cx="192" cy="84" rx="6" ry="9" fill="#ee5f3f" />
          <circle cx="208" cy="63" r="5.5" fill={look.snout === INK ? "#3a3a3f" : INK} />
          <g className="eye" style={{ transformOrigin: "176px 54px" }}>
            <circle cx="176" cy="54" r="7" fill="#fff" />
            <circle cx="177.5" cy="54" r="3.6" fill={INK} />
          </g>
          {look.topknot && (
            <g>
              <circle cx="160" cy="32" r="9" fill={look.earColor} />
              <circle cx="160" cy="40" r="4" fill="#ee5f3f" />
            </g>
          )}
          <g className="ear" style={{ transformOrigin: look.ear === "floppy" ? "150px 46px" : "156px 40px" }}>
            {look.ear === "floppy" ? (
              <ellipse cx="148" cy="68" rx="12" ry="25" fill={look.earColor} transform="rotate(10 148 46)" />
            ) : (
              <polygon points="142,44 150,6 170,36" fill={look.earColor} strokeLinejoin="round" stroke={look.earColor} strokeWidth="4" />
            )}
          </g>
        </g>
      </g>
    </svg>
  );
}

function Cat({ box }: { box?: boolean }) {
  const coat = "#262221";
  const stripe = "#f8efe2";
  return (
    <svg viewBox="0 0 160 200" className="pet-svg" aria-hidden>
      <ellipse className="shadow" cx="80" cy="190" rx={box ? 66 : 48} ry="6" />
      {box && <path d="M22 122 L4 104 L48 100 L60 122 Z M138 122 L156 104 L112 100 L100 122 Z" fill="#B98546" />}
      <clipPath id="cat-box-clip">
        <rect x="-40" y="-40" width="240" height="230" />
      </clipPath>
      <g clipPath={box ? "url(#cat-box-clip)" : undefined}>
        <g className={box ? "cat-rig in-box" : "cat-rig"}>
          <g className="bounce">
            <g className="tail" style={{ transformOrigin: "112px 176px" }}>
              <path d="M110 176 Q152 178 144 132" fill="none" stroke={coat} strokeWidth="11" strokeLinecap="round" />
            </g>
            <ellipse cx="80" cy="146" rx="38" ry="42" fill={coat} />
            <path d="M64 118 q16 12 32 0 q6 34 -16 50 q-22 -16 -16 -50 Z" fill={stripe} />
            <ellipse cx="66" cy="184" rx="11" ry="7" fill={stripe} />
            <ellipse cx="92" cy="184" rx="11" ry="7" fill={stripe} />
            <g className="head" style={{ transformOrigin: "80px 100px" }}>
              <polygon className="ear" points="52,74 54,40 78,62" fill={coat} stroke={coat} strokeWidth="4" strokeLinejoin="round" />
              <polygon className="ear" points="108,74 106,40 82,62" fill={coat} stroke={coat} strokeWidth="4" strokeLinejoin="round" />
              <circle cx="80" cy="88" r="31" fill={coat} />
              <g className="eye" style={{ transformOrigin: "80px 86px" }}>
                <circle cx="67" cy="86" r="8" fill="#f3b43f" />
                <circle cx="93" cy="86" r="8" fill="#f3b43f" />
                <ellipse cx="67" cy="86" rx="2.8" ry="6" fill={INK} />
                <ellipse cx="93" cy="86" rx="2.8" ry="6" fill={INK} />
              </g>
              <path d="M76 97 h8 l-4 5 Z" fill="#9a918c" />
              <path d="M50 98 l-16 -3 M50 104 l-16 3 M110 98 l16 -3 M110 104 l16 3" stroke={stripe} strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </g>
      {box && <rect x="22" y="122" width="116" height="70" rx="4" fill="#D3A262" />}
      {box && <rect x="68" y="122" width="24" height="16" fill="#E7C592" />}
    </svg>
  );
}

export function Pet({ id, happy, box, className = "" }: { id: BreedId; happy?: boolean; box?: boolean; className?: string }) {
  return (
    <span className={`pet ${id === "indie-cat" ? "pet-cat" : "pet-dog"} ${happy ? "is-happy" : ""} ${className}`} data-pat>
      {id === "indie-cat" ? <Cat box={box} /> : <Dog look={DOGS[id]} />}
    </span>
  );
}
