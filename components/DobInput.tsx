"use client";

import { useRef, useState } from "react";

// Date of birth as three small boxes: DD / MM / YYYY. Typing moves on to the
// next box by itself, Backspace in an empty box goes back, and the date only
// counts once it is complete and real (a four-digit year, not in the
// future). Until then `onChange` gets "" so the age slider stays in charge.

function valid(d: string, m: string, y: string) {
  if (d.length < 1 || m.length < 1 || y.length !== 4) return "";
  const dd = Number(d);
  const mm = Number(m);
  const yy = Number(y);
  const now = new Date();
  if (yy < 1990 || yy > now.getFullYear() || mm < 1 || mm > 12 || dd < 1) return "";
  const date = new Date(yy, mm - 1, dd);
  // Rejects 31 Feb and the like, and dates still to come.
  if (date.getMonth() !== mm - 1 || date > now) return "";
  return `${y}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

export function DobInput({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const [y0, m0, d0] = value ? value.split("-") : ["", "", ""];
  const [d, setD] = useState(d0 ?? "");
  const [m, setM] = useState(m0 ?? "");
  const [y, setY] = useState(y0 ?? "");
  const day = useRef<HTMLInputElement>(null);
  const month = useRef<HTMLInputElement>(null);
  const year = useRef<HTMLInputElement>(null);

  const update = (nd: string, nm: string, ny: string) => {
    setD(nd);
    setM(nm);
    setY(ny);
    onChange(valid(nd, nm, ny));
  };
  const digits = (v: string, n: number) => v.replace(/\D/g, "").slice(0, n);

  const back = (e: React.KeyboardEvent<HTMLInputElement>, prev: React.RefObject<HTMLInputElement | null>) => {
    if (e.key === "Backspace" && !e.currentTarget.value) prev.current?.focus();
  };

  return (
    <span className="dob-boxes" role="group" aria-label="Date of birth">
      <input
        ref={day}
        inputMode="numeric"
        placeholder="DD"
        aria-label="Day"
        value={d}
        onChange={(e) => {
          const v = digits(e.target.value, 2);
          update(v, m, y);
          // Two digits, or a day that can only be one digit (4 to 9), moves on.
          if (v.length === 2 || (v.length === 1 && Number(v) > 3)) month.current?.focus();
        }}
      />
      <span aria-hidden>/</span>
      <input
        ref={month}
        inputMode="numeric"
        placeholder="MM"
        aria-label="Month"
        value={m}
        onChange={(e) => {
          const v = digits(e.target.value, 2);
          update(d, v, y);
          if (v.length === 2 || (v.length === 1 && Number(v) > 1)) year.current?.focus();
        }}
        onKeyDown={(e) => back(e, day)}
      />
      <span aria-hidden>/</span>
      <input
        ref={year}
        className="dob-year"
        inputMode="numeric"
        placeholder="YYYY"
        aria-label="Year"
        value={y}
        onChange={(e) => update(d, m, digits(e.target.value, 4))}
        onKeyDown={(e) => back(e, month)}
      />
    </span>
  );
}
