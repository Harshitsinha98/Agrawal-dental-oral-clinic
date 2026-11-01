"use client";

/**
 * Before/after comparison. Drag the handle (or use the arrow keys, since it is a
 * real range input underneath) to reveal more of either photo.
 */

import { useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import type { BeforeAfter as Pair } from "@/lib/types";
import { SanityImage } from "@/components/ui/sanity-image";

export function BeforeAfterSlider({ pair }: { pair: Pair }) {
  const [pos, setPos] = useState(50);
  return (
    <figure>
      <div className="relative aspect-[4/3] select-none overflow-hidden rounded-3xl bg-white shadow-soft">
        <SanityImage image={pair.after} aspect={4 / 3} alt={`${pair.title}, after`} sizes="(min-width: 768px) 50vw, 100vw" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <SanityImage image={pair.before} aspect={4 / 3} alt={`${pair.title}, before`} sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-semibold text-white">Before</span>
        <span className="absolute right-3 top-3 rounded-full bg-mint-500 px-3 py-1 text-xs font-semibold text-white">After</span>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-brand-700 shadow-lift">
            <ChevronsLeftRight className="size-5" />
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare before and after: ${pair.title}`}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-3 font-semibold text-ink">{pair.title}</figcaption>
    </figure>
  );
}
