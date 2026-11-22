"use client";

/**
 * Before/after comparison. Drag anywhere on the photo (mouse or finger), or focus it
 * and use the arrow keys, since a real range input sits underneath. The first time it
 * scrolls into view, the divider sweeps left and right once so visitors see it moves.
 */

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BeforeAfter as Pair } from "@/lib/types";
import { SanityImage } from "@/components/ui/sanity-image";
import { cn } from "@/lib/utils";

export function BeforeAfterSlider({ pair, className }: { pair: Pair; className?: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();
  const sweep = useMotionValue(50);

  useEffect(() => {
    if (!inView || reduce) return;
    const off = sweep.on("change", (v) => {
      if (!touched.current) setPos(v);
    });
    const c = animate(sweep, [50, 22, 78, 50], { duration: 2.4, ease: "easeInOut", delay: 0.3 });
    return () => {
      c.stop();
      off();
    };
  }, [inView, reduce, sweep]);

  const set = (v: number) => {
    touched.current = true;
    setPos(v);
  };

  return (
    <figure className={className}>
      <div ref={ref} className="group relative aspect-[4/3] select-none overflow-hidden rounded-[1.75rem] bg-white shadow-lift ring-1 ring-line">
        <SanityImage image={pair.after} aspect={4 / 3} alt={`${pair.title}, after treatment`} sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <SanityImage image={pair.before} aspect={4 / 3} alt={`${pair.title}, before treatment`} sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw" />
        </div>

        <span className={cn("absolute left-3 top-3 rounded-full bg-brand-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur transition-opacity", pos < 12 && "opacity-0")}>Before</span>
        <span className={cn("absolute right-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-xs font-semibold text-brand-950 transition-opacity", pos > 88 && "opacity-0")}>After</span>

        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_12px_rgb(0_0_0/0.35)]" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 flex h-10 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand-900 shadow-lift ring-1 ring-black/5 transition-transform group-active:scale-95">
            <ChevronLeft className="size-4" strokeWidth={2.5} />
            <ChevronRight className="size-4" strokeWidth={2.5} />
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => set(Number(e.target.value))}
          onPointerDown={() => (touched.current = true)}
          aria-label={`Compare before and after: ${pair.title}`}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-3">
        <span className="font-display text-lg text-ink">{pair.title}</span>
        <span className="shrink-0 whitespace-nowrap text-xs font-medium text-ink-mute">Drag to compare</span>
      </figcaption>
    </figure>
  );
}
