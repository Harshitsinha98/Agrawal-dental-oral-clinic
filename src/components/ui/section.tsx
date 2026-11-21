import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";
import { Aurora } from "@/components/fx/aurora";

type Tone = "plain" | "white" | "mist" | "navy";

export function Section({ id, children, className, tone = "plain" }: { id?: string; children: ReactNode; className?: string; tone?: Tone }) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 sm:py-28",
        tone === "white" && "bg-pearl",
        tone === "mist" && "bg-mist/60",
        tone === "navy" && "isolate overflow-hidden bg-brand-950 text-white",
        className,
      )}
    >
      {tone === "navy" && <Aurora intensity="soft" className="-z-10" />}
      <div className="container-page">{children}</div>
    </section>
  );
}

/** Splits "Two specialists. One family clinic." so the words in `highlight` are set in gold italic. */
function Heading({ text, highlight, dark }: { text: string; highlight?: string | null; dark?: boolean }) {
  const i = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <em className={cn("italic", dark ? "text-gold" : "text-gold-600")}>{highlight}</em>
      {text.slice(i + highlight.length)}
    </>
  );
}

export function SectionHeading({
  eyebrow,
  heading,
  highlight,
  intro,
  align = "left",
  action,
  className,
  dark = false,
}: {
  eyebrow?: string | null;
  heading?: string | null;
  /** Part of the heading to set in gold italic. */
  highlight?: string | null;
  intro?: string | null;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  if (!heading && !intro) return null;
  return (
    <Reveal className={cn("mb-12 flex flex-col gap-6 sm:mb-16", align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className={cn("eyebrow mb-4", dark && "text-gold-300")}>
            <span className={cn("h-px w-8", dark ? "bg-gold-300/60" : "bg-gold-400")} />
            {eyebrow}
            {align === "center" && <span className={cn("h-px w-8", dark ? "bg-gold-300/60" : "bg-gold-400")} />}
          </p>
        )}
        {heading && (
          <h2 className={cn("font-display text-[2.15rem] font-medium leading-[1.08] sm:text-5xl", dark ? "text-white" : "text-ink")}>
            <Heading text={heading} highlight={highlight} dark={dark} />
          </h2>
        )}
        {intro && <p className={cn("mt-5 text-lg leading-relaxed", dark ? "text-white/70" : "text-ink-soft")}>{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
