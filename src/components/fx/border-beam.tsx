/**
 * A short gold light that travels around the border of its parent.
 * The parent needs `relative` and a border radius. CSS only.
 * Pattern adapted from "Border Beam" on 21st.dev (Magic UI).
 */

import { cn } from "@/lib/utils";

export function BorderBeam({ size = 180, duration = 8, radius = 40, className }: { size?: number; duration?: number; radius?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 rounded-[inherit] border-[1.5px] border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]", className)}
    >
      <div
        className="absolute aspect-square animate-beam bg-[linear-gradient(to_left,#ddbe78,#f4e2b4,transparent)]"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${radius}px)`,
          ["--beam-duration" as string]: `${duration}s`,
        }}
      />
    </div>
  );
}
