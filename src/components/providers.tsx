"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Animations follow the visitor's "reduce motion" setting. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
