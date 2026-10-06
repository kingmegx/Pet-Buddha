"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

// The cat side of the "Who's your buddy?" screen: a cardboard box with a
// letterbox slot cut in the front and a cat hiding inside. On a loop the cat
// looks around, blinks, curls both arms out of the slot, swipes with one of
// them, pulls them back in and ducks out of sight. Hovering a box makes the
// cat reach out and bat at the hand.
//
// Each arm is one thick line that bends between a few poses, so it unfurls
// and swings like a real limb instead of popping in and out.

const INK = "#211e1c";

export type CatCoat = "black" | "orange" | "spotted";
export type BoxBrand = "furex" | "pawmazon" | "plain";

const COATS: Record<CatCoat, { fur: string; leftArm: string; patch?: string; mouth: string }> = {
  black: { fur: "#231c1c", leftArm: "#231c1c", mouth: "#8f8782" },
  orange: { fur: "#f0883a", leftArm: "#f0883a", mouth: INK },
  spotted: { fur: "#ffffff", leftArm: "#9a5b34", patch: "#9a5b34", mouth: INK },
};

function Label({ brand }: { brand: BoxBrand }) {
  // Sits on the side face of the box, sheared to match its slope.
  return (
    <g transform="translate(186 150) skewY(-16.5)">
      {brand === "furex" && (
        <text fontSize="23" fontWeight="800" letterSpacing="-1.2" fontFamily="inherit">
          <tspan fill="#4d148c">Fur</tspan>
          <tspan fill="#f26a1b">Ex</tspan>
        </text>
      )}
      {brand === "pawmazon" && (
        <>
          <text fontSize="12.5" fontWeight="700" letterSpacing="-0.4" fill={INK} fontFamily="inherit" y="-4">
            pawmazon
          </text>
          <path d="M4 3 q26 12 50 0" fill="none" stroke="#f29a1b" strokeWidth="3" strokeLinecap="round" />
          <path d="M49 -1 l7 3 l-4 6" fill="none" stroke="#f29a1b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      <g fill="none" stroke="#8a6650" strokeWidth="1.6" transform={`translate(0 ${brand === "plain" ? -8 : 16})`}>
        <rect x="2" y="0" width="15" height="15" />
        <rect x="22" y="0" width="15" height="15" />
        <rect x="42" y="0" width="15" height="15" />
        <path d="M7 12 v-8 M12 12 v-8 M5 6 l2 -3 l2 3 M10 6 l2 -3 l2 3 M24 8 q5.5 -7 11 0 M29.5 8 v5 M46 10 a4 4 0 1 0 7 0" />
      </g>
    </g>
  );
}

type Pose = { d: string; x: number; y: number; rotate: number; scale: number; opacity: number };

// Left arm (the one that swipes) and right arm, as seen on screen. x / y /
// rotate place the paw on the end of the arm for that pose.
// "tuck" is hidden inside the box; "curl" is the same spot but visible, so
// an arm is fully solid for the whole time it is moving.
const LEFT: Record<"tuck" | "curl" | "hang" | "reach" | "swipe", Pose> = {
  tuck: { d: "M60 152 C60 152 60 152 60 152", x: 60, y: 152, rotate: 0, scale: 0.3, opacity: 0 },
  curl: { d: "M60 152 C60 152 60 152 60 152", x: 60, y: 152, rotate: 0, scale: 0.3, opacity: 1 },
  hang: { d: "M62 152 C28 148 24 184 30 212", x: 31, y: 216, rotate: 6, scale: 1, opacity: 1 },
  reach: { d: "M62 152 C36 150 14 136 -4 112", x: -6, y: 109, rotate: 143, scale: 1, opacity: 1 },
  swipe: { d: "M62 152 C36 153 10 151 -12 140", x: -15, y: 138, rotate: 118, scale: 1, opacity: 1 },
};

const RIGHT: Record<"tuck" | "curl" | "hang", Pose> = {
  tuck: { d: "M146 152 C146 152 146 152 146 152", x: 146, y: 152, rotate: 0, scale: 0.3, opacity: 0 },
  curl: { d: "M146 152 C146 152 146 152 146 152", x: 146, y: 152, rotate: 0, scale: 0.3, opacity: 1 },
  hang: { d: "M144 152 C178 148 182 184 174 212", x: 173, y: 216, rotate: -8, scale: 1, opacity: 1 },
};

const LOOP = 9; // seconds for one full idle cycle
const LEFT_STEPS = ["tuck", "tuck", "curl", "hang", "hang", "reach", "swipe", "reach", "swipe", "hang", "curl", "tuck", "tuck"] as const;
const LEFT_TIMES = [0, 0.455, 0.46, 0.55, 0.6, 0.66, 0.7, 0.74, 0.78, 0.85, 0.905, 0.91, 1];
const RIGHT_STEPS = ["tuck", "tuck", "curl", "hang", "hang", "curl", "tuck", "tuck"] as const;
const RIGHT_TIMES = [0, 0.435, 0.44, 0.53, 0.82, 0.885, 0.89, 1];

type Mode = "idle" | "reach" | "bat" | "settle";

function column<K extends string>(steps: readonly K[], poses: Record<K, Pose>) {
  const pick = <P extends keyof Pose>(key: P) => steps.map((s) => poses[s][key]);
  return {
    arm: { d: pick("d"), opacity: pick("opacity") },
    paw: { x: pick("x"), y: pick("y"), rotate: pick("rotate"), scale: pick("scale"), opacity: pick("opacity") },
  };
}

function still(pose: Pose) {
  const { d, opacity, ...paw } = pose;
  return { arm: { d, opacity }, paw: { ...paw, opacity } };
}

export function CatBox({ coat, brand, delay = 0 }: { coat: CatCoat; brand: BoxBrand; delay?: number }) {
  const c = COATS[coat];
  const clip = `slot-${coat}-${brand}`;
  const beans = "#ff4f9a";
  const [mode, setMode] = useState<Mode>("idle");
  const firstRun = useRef(true);

  const a = useMemo(() => {
    const wait = firstRun.current ? delay : 0;
    const loop = (times: number[]) => ({ duration: LOOP, times, repeat: Infinity, ease: "easeInOut" as const, delay: wait });
    const quick = { duration: mode === "settle" ? 0.34 : 0.24, ease: "easeOut" as const };
    const swing = { duration: 0.27, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const };

    if (mode === "idle") {
      return {
        left: column(LEFT_STEPS, LEFT),
        leftT: loop(LEFT_TIMES),
        right: column(RIGHT_STEPS, RIGHT),
        rightT: loop(RIGHT_TIMES),
        face: { y: [0, 0, 60, 60, 0] },
        faceT: loop([0, 0.92, 0.95, 0.975, 1]),
        look: { x: [0, -6, -6, 6, 6, 0, 0] },
        lookT: loop([0, 0.07, 0.15, 0.23, 0.31, 0.37, 1]),
        blink: { scaleY: [1, 1, 0.08, 1, 1] },
        blinkT: loop([0, 0.395, 0.415, 0.435, 1]),
      };
    }
    const batting = mode === "bat";
    return {
      left: batting ? column(["reach", "swipe"] as const, LEFT) : still(mode === "reach" ? LEFT.reach : LEFT.tuck),
      leftT: batting ? swing : quick,
      right: still(mode === "settle" ? RIGHT.tuck : RIGHT.hang),
      rightT: quick,
      face: { y: 0 },
      faceT: quick,
      look: { x: 0 },
      lookT: quick,
      blink: { scaleY: 1 },
      blinkT: quick,
    };
  }, [mode, delay]);

  return (
    <svg
      className="catbox"
      viewBox="0 0 300 250"
      data-pat
      aria-hidden
      onPointerEnter={() => {
        firstRun.current = false;
        setMode("reach");
      }}
      onPointerLeave={() => setMode("settle")}
    >
      <polygon points="40,216 178,236 294,198 252,186" fill="rgba(33,30,28,0.2)" />
      <polygon points="108,62 252,74 232,36 100,28" fill="#f1d9c6" />
      <polygon points="28,84 108,62 252,74 178,96" fill="#2b211c" />
      <polygon points="28,84 108,62 172,67 96,90" fill="#e7c8b0" />
      <polygon points="28,84 178,96 178,222 28,202" fill="#d8ab8d" />
      <polygon points="178,96 252,74 252,194 178,222" fill="#c3987c" />
      <polygon points="88,89 114,91 114,112 88,110" fill="#edd3c1" />
      <polygon points="92,190 116,193 116,216 92,212" fill="#edd3c1" />
      <Label brand={brand} />

      {/* The slot shows the eyes in the middle with a shoulder at each end,
          so the arms come out beside the face. */}
      <clipPath id={clip}>
        <rect x="36" y="122" width="134" height="58" rx="29" />
      </clipPath>
      <rect x="36" y="122" width="134" height="58" rx="29" fill="#1a1412" />
      <g clipPath={`url(#${clip})`}>
        <motion.g initial={false} animate={a.face} transition={a.faceT}>
          <rect x="30" y="118" width="146" height="66" fill={c.fur} />
          {c.patch && <circle cx="124" cy="142" r="23" fill={c.patch} />}
          <motion.g initial={false} animate={a.blink} transition={a.blinkT}>
            <circle cx="86" cy="144" r="14" fill="#fff" stroke={coat === "spotted" ? INK : "none"} strokeWidth="1.6" />
            <circle cx="120" cy="144" r="14" fill="#fff" />
            <motion.g initial={false} animate={a.look} transition={a.lookT}>
              <ellipse className="pupil" cx="86" cy="144" rx="4.5" ry="7.5" fill={INK} />
              <ellipse className="pupil" cx="120" cy="144" rx="4.5" ry="7.5" fill={INK} />
            </motion.g>
          </motion.g>
          <path d="M98.5 160 h9 l-4.5 5 Z" fill={beans} />
          <path d="M95.5 169 q4 5 7.5 0 q3.5 5 7.5 0" fill="none" stroke={c.mouth} strokeWidth="1.8" strokeLinecap="round" />
        </motion.g>
      </g>

      {/* Right arm: shows the back of the paw, three toes with claws. */}
      <motion.path initial={false} animate={a.right.arm} transition={a.rightT} fill="none" stroke={c.fur} strokeWidth="25" strokeLinecap="round" />
      <motion.g initial={false} animate={a.right.paw} transition={a.rightT}>
        <ellipse cx="0" cy="-2" rx="16" ry="13" fill={c.fur} />
        <circle cx="-10.5" cy="8" r="7" fill={c.fur} />
        <circle cx="0" cy="11.5" r="7.5" fill={c.fur} />
        <circle cx="10.5" cy="8" r="7" fill={c.fur} />
        <path d="M-10.5 14 v5 M0 18 v5 M10.5 14 v5" stroke={c.fur} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M-5 8 v6 M5 8 v6" stroke={coat === "black" ? "#4a3f3d" : "rgba(33,30,28,0.35)"} strokeWidth="1.4" strokeLinecap="round" />
      </motion.g>

      {/* Left arm: palm towards us, pink pad and toe beans. */}
      <motion.path
        initial={false}
        animate={a.left.arm}
        transition={a.leftT}
        onAnimationComplete={() => setMode((m) => (m === "reach" ? "bat" : m === "settle" ? "idle" : m))}
        fill="none"
        stroke={c.leftArm}
        strokeWidth="25"
        strokeLinecap="round"
      />
      <motion.g initial={false} animate={a.left.paw} transition={a.leftT}>
        <ellipse cx="0" cy="-2" rx="16" ry="13" fill={c.leftArm} />
        <circle cx="-10.5" cy="8" r="7" fill={c.leftArm} />
        <circle cx="0" cy="11.5" r="7.5" fill={c.leftArm} />
        <circle cx="10.5" cy="8" r="7" fill={c.leftArm} />
        <path d="M-10.5 14 v5 M0 18 v5 M10.5 14 v5" stroke={c.leftArm} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M0 -9 c5 0 9 4 8 8 c-1 4 -5 4 -8 2 c-3 2 -7 2 -8 -2 c-1 -4 3 -8 8 -8 Z" fill={beans} />
        <circle cx="-10" cy="8" r="3.6" fill={beans} />
        <circle cx="0" cy="11.5" r="3.9" fill={beans} />
        <circle cx="10" cy="8" r="3.6" fill={beans} />
      </motion.g>
    </svg>
  );
}
