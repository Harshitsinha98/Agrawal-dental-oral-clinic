/**
 * Aurora background for dark sections: slow-drifting navy, aqua and gold glows over a
 * faint grid, with film grain so the gradients don't band.
 * Pattern adapted from the "Aurora Background" / "Background Beams" components on
 * 21st.dev (Aceternity UI), rebuilt with CSS only so it costs no JavaScript.
 */

import { cn } from "@/lib/utils";

export function Aurora({ className, intensity = "normal" }: { className?: string; intensity?: "normal" | "soft" }) {
  const o = intensity === "soft" ? "opacity-60" : "opacity-100";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#13336a_0%,#0b1f45_45%,#081734_100%)]" />
      <div className={cn("absolute -left-[20%] -top-[30%] size-[70vw] max-w-[900px] rounded-full bg-[radial-gradient(circle,rgb(61_186_176/0.28),transparent_60%)] blur-3xl animate-aurora", o)} />
      <div className={cn("absolute -right-[15%] top-[10%] size-[60vw] max-w-[820px] rounded-full bg-[radial-gradient(circle,rgb(47_99_173/0.45),transparent_62%)] blur-3xl animate-aurora [animation-delay:-6s]", o)} />
      <div className={cn("absolute bottom-[-35%] left-[25%] size-[55vw] max-w-[760px] rounded-full bg-[radial-gradient(circle,rgb(207_166_83/0.22),transparent_60%)] blur-3xl animate-aurora [animation-delay:-11s]", o)} />
      <div className="grid-lines absolute inset-0" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
