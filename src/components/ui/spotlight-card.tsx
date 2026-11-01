"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A card with a soft light that follows the cursor (desktop only). */
export function SpotlightCard({ children, className, tone = "light" }: { children: ReactNode; className?: string; tone?: "light" | "dark" }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--x", `${e.clientX - r.left}px`);
        ref.current.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={cn("group/spot relative isolate overflow-hidden", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background:
            tone === "dark"
              ? "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgb(127 213 191 / 0.18), transparent 60%)"
              : "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgb(30 90 168 / 0.08), transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}
