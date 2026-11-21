"use client";

/**
 * Vertical timeline. A gold beam fills the line as you scroll and each milestone's
 * dot lights up as the beam reaches it.
 * Pattern adapted from "Timeline" on 21st.dev (Aceternity UI).
 */

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Milestone } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Timeline({ items, className }: { items: Milestone[]; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <ol ref={ref} className={cn("relative space-y-10 sm:space-y-14", className)}>
      <div aria-hidden className="absolute bottom-2 left-[15px] top-2 w-px bg-line sm:left-[calc(9rem+15px)]">
        <motion.div style={{ height }} className="w-px bg-gradient-to-b from-gold-300 via-gold-400 to-mint-400 shadow-[0_0_12px_rgb(207_166_83/0.8)]" />
      </div>
      {items.map((m, i) => (
        <motion.li
          key={m._key ?? i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid gap-2 pl-12 sm:grid-cols-[9rem_1fr] sm:gap-0 sm:pl-0"
        >
          <p className="font-display text-2xl text-gold-600 sm:pr-10 sm:pt-0.5 sm:text-right sm:text-3xl">{m.year}</p>
          <span aria-hidden className="absolute left-[7px] top-1.5 grid size-[17px] place-items-center rounded-full border border-gold-300 bg-pearl sm:left-[calc(9rem+7px)]">
            <span className="size-[7px] rounded-full bg-gold-400" />
          </span>
          <div className="sm:pl-12">
            <h3 className="text-lg font-bold text-ink sm:text-xl">{m.title}</h3>
            {m.text && <p className="mt-1.5 max-w-xl leading-relaxed text-ink-soft">{m.text}</p>}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
