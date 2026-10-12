// The landing-page pair: head-and-shoulders portraits in profile, eyes
// closed. Big simple shapes, a collar, no outlines. Drawn for this site in
// the spirit of the reference posters, not traced from them. The ear sways
// (f-ear in globals.css) and the whole portrait bows (".niche").

const INK = "#211e1c";
const RED = "#d8392b";

// Side on, eyes closed, chin up. Head, neck and shoulders are ONE outline,
// so nothing overlaps or shows a seam. It sits in a coloured niche so the
// white muzzle and chest show against the white card.
export function ProfileBust() {
  return (
    <svg viewBox="0 0 300 360" className="bust-svg" aria-hidden>
      <path d="M30 360 L78 190 C70 120 110 62 180 62 C214 62 240 76 254 98 L290 122 C296 134 294 150 284 158 C262 172 236 176 214 172 L220 196 L244 360 Z" fill="#fbd287" />
      <path d="M30 360 L56 268 C92 274 112 304 102 334 C98 348 84 356 72 360 Z" fill={INK} />
      <path d="M196 360 C186 322 204 294 232 284 L244 360 Z" fill="#fffdf8" />
      <path d="M57.7 262 L229.7 262 L232.9 284 L51.5 284 Z" fill={RED} />
      <path d="M210 98 C226 94 242 90 254 98 L290 122 C296 134 294 150 284 158 C262 172 236 176 214 172 C192 160 188 116 210 98 Z" fill="#fffdf8" />
      <path d="M268 108 L290 122 C296 132 294 142 288 146 C276 146 264 132 268 108 Z" fill={INK} />
      <path d="M170 116 q15 13 32 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <g className="f-ear" style={{ transformOrigin: "130px 96px" }}>
        <path d="M112 92 C150 74 174 104 178 152 C180 192 150 208 122 198 C92 186 86 114 112 92 Z" fill="#f0a35a" />
      </g>
    </svg>
  );
}

// The black-and-white one with the tall pointed ear, drawn the same way.
export function CatBust() {
  return (
    <svg viewBox="0 0 300 360" className="bust-svg" aria-hidden>
      <path d="M40 360 L92 196 C84 130 122 78 182 76 C220 74 248 96 256 124 L264 146 C266 158 258 168 248 172 C240 180 232 186 226 196 L250 360 Z" fill="#fffdf8" />
      <path d="M40 360 L68 272 C108 266 150 284 152 314 C150 342 110 352 86 360 Z" fill={INK} />
      <path d="M200 360 C194 326 208 300 240 290 L250 360 Z" fill="#ecebe6" />
      <path d="M69.8 266 L236.2 266 L239.5 288 L62.8 288 Z" fill={RED} />
      <path d="M112 100 C150 82 196 98 214 122 C226 150 200 184 168 196 C140 200 118 178 110 152 Z" fill={INK} />
      <g className="f-ear" style={{ transformOrigin: "130px 110px" }}>
        <path d="M108 152 C96 100 100 40 122 16 C150 30 166 60 168 98 Z" fill={INK} />
        <path d="M124 44 C140 56 152 76 150 96 L126 110 Z" fill="#c98c84" />
      </g>
      <path d="M176 138 q14 12 30 0" fill="none" stroke="#9a9a9a" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="258" cy="142" rx="8" ry="6.5" fill={INK} />
    </svg>
  );
}
