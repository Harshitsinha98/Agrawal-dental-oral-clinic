"use client";

/**
 * A statement whose words brighten one by one as you scroll through it.
 * Pattern adapted from "Text Reveal" on 21st.dev (Magic UI).
 */

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function TextReveal({ text, highlight = [], className }: { text: string; highlight?: string[]; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("flex flex-wrap gap-x-[0.28em]", className)}>
      {words.map((w, i) => {
        const hl = highlight.some((h) => w.toLowerCase().replace(/[^a-z]/g, "").startsWith(h.toLowerCase()));
        return (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} reduce={!!reduce} className={hl ? "font-display italic text-gold-600" : undefined}>
            {w}
          </Word>
        );
      })}
    </p>
  );
}

function Word({ children, progress, range, reduce, className }: { children: string; progress: MotionValue<number>; range: [number, number]; reduce: boolean; className?: string }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={reduce ? undefined : { opacity }} className={className}>
      {children}
    </motion.span>
  );
}
