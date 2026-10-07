"use client";

import { useRef, useState } from "react";

type Props = {
  value: number; // 0..1
  onChange: (v: number) => void;
  left: string;
  right: string;
  label: string;
  valueText: string;
  steps?: number;
};

// The fat black slider from the reference: the track sags under the knob
// while it is being dragged.
export default function Slider({ value, onChange, left, right, label, valueText, steps = 20 }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const setFromPointer = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    onChange(Math.min(1, Math.max(0, (clientX - r.left) / r.width)));
  };

  const x = value * 100;
  const sag = dragging ? 9 : 0;

  return (
    <div className="slider">
      <span className="slider-end">{left}</span>
      <div
        ref={track}
        className="slider-track"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(x)}
        aria-valuetext={valueText}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          setFromPointer(e.clientX);
        }}
        onPointerMove={(e) => dragging && setFromPointer(e.clientX)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onKeyDown={(e) => {
          const d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          onChange(Math.min(1, Math.max(0, value + d / steps)));
        }}
      >
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden>
          <path d={`M2 12 Q${x} ${12 + sag * 2} 98 12`} />
        </svg>
        <span className={`slider-knob ${dragging ? "" : "is-gliding"}`} style={{ left: `${x}%`, transform: `translate(-50%, calc(-50% + ${sag}px)) scale(${dragging ? 1.15 : 1})` }} />
      </div>
      <span className="slider-end">{right}</span>
    </div>
  );
}
