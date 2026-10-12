// The picture on the "What's their name?" step: a collar with a bone-shaped
// tag hanging from it. The tag starts blank and shows the name as it is
// typed, shrinking the letters so a long name still fits. Flat shapes, no
// outlines. Motion is in globals.css under ".nametag".

const BONE = "M86 178 a22 22 0 1 1 22 -22 h104 a22 22 0 1 1 22 22 a22 22 0 1 1 -22 22 h-104 a22 22 0 1 1 -22 -22 Z";

export function NameTag({ name }: { name: string }) {
  const shown = name.trim();
  const size = Math.min(34, 190 / Math.max(1, shown.length * 0.62));
  return (
    <div className="nametag" aria-hidden>
      <svg viewBox="0 0 320 250">
        {/* back of the collar, then the front band over it */}
        <ellipse cx="160" cy="66" rx="118" ry="40" fill="none" stroke="#c94a2e" strokeWidth="24" />
        <path d="M42 66 A118 40 0 0 0 278 66" fill="none" stroke="#ee5f3f" strokeWidth="24" strokeLinecap="round" />
        <rect x="222" y="76" width="30" height="34" rx="7" fill="#e3a44a" transform="rotate(-24 237 93)" />
        <rect x="229" y="84" width="16" height="18" rx="3" fill="#ee5f3f" transform="rotate(-24 237 93)" />
        {[92, 112, 132].map((x, i) => (
          <circle key={x} cx={x} cy={96 + i * 4} r="3.4" fill="#f7f1e3" />
        ))}
        <g className="tag-swing">
          <circle cx="160" cy="122" r="15" fill="none" stroke="#e3a44a" strokeWidth="6" />
          {/* re-made on every keystroke, which replays the little bump */}
          <g key={shown} className="tag-bump">
            <path d={BONE} fill="#f2cd8e" />
            <circle cx="160" cy="146" r="5" fill="#9cc3c0" />
            <text x="160" y="178" textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight="800" fill="#211e1c">
              {shown}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
