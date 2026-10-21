"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

// The cat side of the "Who's your buddy?" screen: a cardboard box with a
// letterbox slot cut in the front and a cat hiding inside. The eyes are
// bigger than the slot, so its edges crop them: the cat reads as sitting
// behind the cardboard, not painted on it. The white-and-brown cat is the
// exception: it has climbed up and peeks over the top of its box instead. At
// rest the cats are calm: they look slowly from side to side and blink.
// Hovering a box wakes its cat for 3 seconds: it reaches out and bats.
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
  tuck: { d: "M50 152 C50 152 50 152 50 152", x: 50, y: 152, rotate: 0, scale: 0.3, opacity: 0 },
  curl: { d: "M50 152 C50 152 50 152 50 152", x: 50, y: 152, rotate: 0, scale: 0.3, opacity: 1 },
  hang: { d: "M50 152 C22 148 18 184 24 212", x: 25, y: 216, rotate: 6, scale: 1, opacity: 1 },
  reach: { d: "M50 152 C28 150 10 136 -8 112", x: -10, y: 109, rotate: 143, scale: 1, opacity: 1 },
  swipe: { d: "M50 152 C28 153 6 151 -16 140", x: -19, y: 138, rotate: 118, scale: 1, opacity: 1 },
};

const RIGHT: Record<"tuck" | "curl" | "hang", Pose> = {
  tuck: { d: "M156 152 C156 152 156 152 156 152", x: 156, y: 152, rotate: 0, scale: 0.3, opacity: 0 },
  curl: { d: "M156 152 C156 152 156 152 156 152", x: 156, y: 152, rotate: 0, scale: 0.3, opacity: 1 },
  hang: { d: "M156 152 C182 148 184 184 176 212", x: 175, y: 216, rotate: -8, scale: 1, opacity: 1 },
};

const LOOP = 14; // seconds for one full idle cycle
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
  // The white-and-brown cat looks out over the top instead of through a slot.
  const peek = coat === "spotted";
  const [mode, setMode] = useState<Mode>("idle");
  const firstRun = useRef(true);
  const lively = useRef(0);

  const a = useMemo(() => {
    const wait = firstRun.current ? delay : 0;
    const loop = (times: number[]) => ({ duration: LOOP, times, repeat: Infinity, ease: "easeInOut" as const, delay: wait });
    const quick = { duration: mode === "settle" ? 0.34 : 0.24, ease: "easeOut" as const };
    const swing = { duration: 0.27, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const };

    // Calm by request: arms stay inside the box and the cat no longer ducks
    // away. It only looks slowly from side to side and blinks.
    if (mode === "idle") {
      return {
        left: still(LEFT.tuck),
        leftT: quick,
        right: still(RIGHT.tuck),
        rightT: quick,
        face: { y: 0 },
        faceT: quick,
        look: { x: [0, -4, -4, 4, 4, 0, 0] },
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
      face: { y: peek && mode !== "settle" ? -12 : 0 },
      faceT: quick,
      look: { x: 0 },
      lookT: quick,
      blink: { scaleY: 1 },
      blinkT: quick,
    };
  }, [mode, delay, peek]);

  return (
    <svg
      className="catbox"
      viewBox="0 0 300 250"
      data-pat
      aria-hidden
      // Hovering wakes the cat for 3 seconds: it reaches out of the box and
      // bats at the pointer, then settles back. Hovering again wakes it again.
      onPointerEnter={() => {
        firstRun.current = false;
        window.clearTimeout(lively.current);
        setMode("reach");
        lively.current = window.setTimeout(() => setMode("settle"), 3000);
      }}
    >
      <polygon points="40,216 178,236 294,198 252,186" fill="rgba(33,30,28,0.2)" />
      <polygon points="108,62 252,74 232,36 100,28" fill="#f1d9c6" />
      <polygon points="28,84 108,62 252,74 178,96" fill="#2b211c" />
      <polygon points="28,84 108,62 172,67 96,90" fill="#e7c8b0" />
      {peek && (
        // Sits in the opening: drawn after the inside of the box and before its
        // front wall, which hides everything below the rim. Only the top of a
        // wide head shows, with the eyes just clear of the cardboard.
        <motion.g initial={false} animate={a.face} transition={a.faceT} onAnimationComplete={() => setMode((m) => (m === "reach" ? "bat" : m === "settle" ? "idle" : m))}>
          <clipPath id={clip}>
            <ellipse cx="112" cy="84" rx="56" ry="38" />
          </clipPath>
          {/* the tail curls up out of the far end of the box, well clear of the head */}
          <path d="M214 86 C234 68 240 40 224 30 C214 25 207 36 215 43" fill="none" stroke={c.patch} strokeWidth="11" strokeLinecap="round" />
          <path d="M62 70 L66 34 L92 52 Z" fill="#fff" />
          <path d="M132 52 L158 34 L162 70 Z" fill={c.patch} />
          <ellipse cx="112" cy="84" rx="56" ry="38" fill="#fff" />
          <circle cx="140" cy="68" r="30" fill={c.patch} clipPath={`url(#${clip})`} />
          <motion.g initial={false} animate={a.blink} transition={a.blinkT}>
            <circle cx="92" cy="74" r="13" fill="#f2b632" />
            <circle cx="132" cy="74" r="13" fill="#f2b632" />
            <motion.g initial={false} animate={a.look} transition={a.lookT}>
              <circle className="pupil" cx="92" cy="74" r="8" fill={INK} />
              <circle className="pupil" cx="132" cy="74" r="8" fill={INK} />
              <circle cx="95" cy="70" r="2.6" fill="#fff" />
              <circle cx="135" cy="70" r="2.6" fill="#fff" />
            </motion.g>
          </motion.g>
          <path d="M58 78 h-20 M60 85 l-19 5 M166 78 h20 M164 85 l19 5" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        </motion.g>
      )}
      <polygon points="28,84 178,96 178,222 28,202" fill="#d8ab8d" />
      <polygon points="178,96 252,74 252,194 178,222" fill="#c3987c" />
      <polygon points="88,89 114,91 114,112 88,110" fill="#edd3c1" />
      <polygon points="92,190 116,193 116,216 92,212" fill="#edd3c1" />
      <Label brand={brand} />

      {peek ? null : (
        <>
          {/* A long low slot. The arms come out at its two ends; the eyes sit
              together in the middle, between them, and are taller than the
              slot, so the cardboard cuts them off top and bottom. */}
          <clipPath id={clip}>
            <rect x="30" y="130" width="146" height="44" rx="22" />
          </clipPath>
          <rect x="30" y="130" width="146" height="44" rx="22" fill="#1a1412" />
          <g clipPath={`url(#${clip})`}>
            <motion.g initial={false} animate={a.face} transition={a.faceT}>
              <rect x="24" y="118" width="158" height="66" fill={c.fur} />
              <motion.g initial={false} animate={a.blink} transition={a.blinkT}>
                <ellipse cx="82" cy="152" rx="14" ry="27" fill="#fff" />
                <ellipse cx="124" cy="152" rx="14" ry="27" fill="#fff" />
                <motion.g initial={false} animate={a.look} transition={a.lookT}>
                  <ellipse className="pupil" cx="83" cy="152" rx="5" ry="11" fill={INK} />
                  <ellipse className="pupil" cx="123" cy="152" rx="5" ry="11" fill={INK} />
                </motion.g>
              </motion.g>
              <path d="M98.5 147 h9 l-4.5 5 Z" fill={beans} />
              <path d="M96 157 q3.5 4 7 0 q3.5 4 7 0" fill="none" stroke={c.mouth} strokeWidth="1.8" strokeLinecap="round" />
            </motion.g>
          </g>
        </>
      )}

      {!peek && (
        <>
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
        </>
      )}
    </svg>
  );
}
