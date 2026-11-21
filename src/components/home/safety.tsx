"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Step } from "@/lib/types";
import { DentalIcon } from "@/components/ui/icons";
import { Aurora } from "@/components/fx/aurora";

/** Sterilisation steps on a dark band. The line between steps fills as you scroll past. */
export function Safety({ heading, intro, steps }: { heading?: string | null; intro?: string | null; steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (!steps.length) return null;

  return (
    <section className="py-6 sm:py-10">
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-brand-950 px-6 py-16 text-white sm:px-12 sm:py-20">
          <Aurora intensity="soft" className="-z-10" />
          <div className="relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="eyebrow mb-4 text-gold-300">
                <span className="h-px w-8 bg-gold-300/60" />
                Hygiene
              </p>
              {heading && <h2 className="font-display text-4xl font-medium leading-tight sm:text-5xl">{heading}</h2>}
              {intro && <p className="mt-5 text-lg leading-relaxed text-white/70">{intro}</p>}
            </div>

            <div ref={ref} className="relative">
              <div aria-hidden className="absolute bottom-6 left-[1.6rem] top-6 w-px bg-white/15">
                <motion.div style={{ height: fill }} className="w-px bg-gradient-to-b from-gold-200 to-gold-400 shadow-[0_0_10px_rgb(207_166_83/0.8)]" />
              </div>
              <ol className="space-y-5">
                {steps.map((s, i) => (
                  <motion.li
                    key={s._key ?? i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex gap-5"
                  >
                    <span className="relative z-10 grid size-[3.25rem] shrink-0 place-items-center rounded-2xl bg-brand-900 text-gold-200 ring-1 ring-gold-300/30">
                      <DentalIcon name={s.icon ?? "shield"} />
                    </span>
                    <div className="flex-1 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">Step {i + 1}</p>
                      <h3 className="mt-1 text-lg font-bold">{s.title}</h3>
                      {s.text && <p className="mt-1.5 leading-relaxed text-white/70">{s.text}</p>}
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
