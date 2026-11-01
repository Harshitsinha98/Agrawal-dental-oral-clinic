"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type HTMLMotionProps } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children into view once. */
export function Reveal({ children, delay = 0, y = 24, className, ...rest }: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Children wrapped in <StaggerItem> appear one after another. */
export function Stagger({ children, className, gap = 0.07, as = "div" }: { children: ReactNode; className?: string; gap?: number; as?: "div" | "ul" | "ol" }) {
  const Comp = as === "ul" ? motion.ul : as === "ol" ? motion.ol : motion.div;
  return (
    <Comp
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
      className={className}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }} className={className}>
      {children}
    </Comp>
  );
}

/** Counts up from 0 when scrolled into view. */
export function CountUp({ value, decimals = 0, className }: { value: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? value : 0);
  const text = useTransform(mv, (v) => v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }));

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(mv, value, { duration: 1.6, ease });
    return () => controls.stop();
  }, [inView, reduce, value, mv]);

  return <motion.span ref={ref} className={className}>{text}</motion.span>;
}

/** The smile-curve underline, drawn in when it comes into view. */
export function SmileUnderline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 18" preserveAspectRatio="none" aria-hidden className={className}>
      <motion.path
        d="M3 6 C 50 17, 150 17, 197 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease, delay: 0.5 }}
      />
    </svg>
  );
}
