/**
 * Endless horizontal strip that pauses on hover. CSS only.
 * Pattern adapted from "Marquee" on 21st.dev (Magic UI).
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Marquee({ children, className, duration = 40, reverse = false, gap = "2.5rem", fade = true }: { children: ReactNode; className?: string; duration?: number; reverse?: boolean; gap?: string; fade?: boolean }) {
  return (
    <div
      className={cn("group flex overflow-hidden", fade && "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]", className)}
      style={{ ["--marquee-gap" as string]: gap, ["--marquee-duration" as string]: `${duration}s` }}
    >
      <div className={cn("flex w-max shrink-0 items-center animate-marquee group-hover:[animation-play-state:paused]", reverse && "[animation-direction:reverse]")} style={{ gap }}>
        {children}
        <div aria-hidden className="flex shrink-0 items-center" style={{ gap }}>
          {children}
        </div>
      </div>
    </div>
  );
}
