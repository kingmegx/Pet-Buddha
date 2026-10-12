"use client";

import { useEffect, useState } from "react";

// One praying animal in its niche: Meghna's picture at `src` (in
// public/art). The drawing passed as `children` shows until the picture
// has loaded, and stays if it is ever missing.
export function NicheArt({ src, children }: { src: string; children: React.ReactNode }) {
  const [found, setFound] = useState(false);

  useEffect(() => {
    const probe = new Image();
    probe.onload = () => setFound(true);
    probe.src = src;
  }, [src]);

  // eslint-disable-next-line @next/next/no-img-element
  return found ? <img className="bust-img" src={src} alt="" draggable={false} /> : <>{children}</>;
}
