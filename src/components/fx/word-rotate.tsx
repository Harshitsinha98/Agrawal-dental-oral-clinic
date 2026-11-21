"use client";

/**
 * Cycles through words with a soft blur-and-rise, letter by letter.
 * Pattern adapted from "Flip Words" on 21st.dev (Aceternity UI).
 */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function WordRotate({ words, interval = 2600, className }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (words.length < 2 || reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval, reduce]);

  const word = words[i] ?? "";
  return (
    <span className={cn("relative inline-grid", className)}>
      {/* Reserve the width of the longest word so the line doesn't jump. */}
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial="hidden"
          animate="show"
          exit="exit"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.025 } }, exit: { opacity: 0, y: -12, filter: "blur(6px)", transition: { duration: 0.3 } } }}
          aria-live="polite"
        >
          {word.split("").map((ch, j) => (
            <motion.span
              key={j}
              className="inline-block"
              variants={{ hidden: { opacity: 0, y: 14, filter: "blur(8px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } }}
            >
              {ch === " " ? "\u00a0" : ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
