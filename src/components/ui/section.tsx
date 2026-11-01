import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

export function Section({ id, children, className, tone = "plain" }: { id?: string; children: ReactNode; className?: string; tone?: "plain" | "white" | "mist" }) {
  return (
    <section
      id={id}
      className={cn("relative py-20 sm:py-28", tone === "white" && "bg-white", tone === "mist" && "bg-mist/60", className)}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  heading,
  intro,
  align = "left",
  action,
  className,
}: {
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
}) {
  if (!heading && !intro) return null;
  return (
    <Reveal className={cn("mb-12 flex flex-col gap-6 sm:mb-14", align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className="eyebrow mb-3">
            <span className="h-px w-6 bg-brand-300" />
            {eyebrow}
          </p>
        )}
        {heading && <h2 className="text-3xl font-bold leading-[1.1] text-ink sm:text-[2.6rem]">{heading}</h2>}
        {intro && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
