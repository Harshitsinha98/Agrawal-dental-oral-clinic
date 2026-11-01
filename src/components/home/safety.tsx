"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Step } from "@/lib/types";
import { DentalIcon } from "@/components/ui/icons";

/** Sterilisation steps on a dark band. The line between steps fills as you scroll past. */
export function Safety({ heading, intro, steps }: { heading?: string | null; intro?: string | null; steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (!steps.length) return null;

  return (
    <section className="py-6 sm:py-10">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-900 px-6 py-16 text-white sm:px-12 sm:py-20">
          <div aria-hidden className="dots absolute inset-0 opacity-[0.15] [background-image:radial-gradient(rgb(255_255_255/0.5)_1px,transparent_1px)]" />
          <div className="relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="eyebrow mb-4 text-mint-300">
                <span className="h-px w-6 bg-mint-300/60" />
                Hygiene
              </p>
              {heading && <h2 className="text-3xl font-bold leading-tight sm:text-[2.5rem]">{heading}</h2>}
              {intro && <p className="mt-5 text-lg leading-relaxed text-white/70">{intro}</p>}
            </div>

            <div ref={ref} className="relative">
              <div aria-hidden className="absolute bottom-6 left-[1.6rem] top-6 w-px bg-white/15">
                <motion.div style={{ height: fill }} className="w-px bg-mint-300" />
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
                    <span className="relative z-10 grid size-[3.25rem] shrink-0 place-items-center rounded-2xl bg-brand-800 text-mint-300 ring-1 ring-white/10">
                      <DentalIcon name={s.icon ?? "shield"} />
                    </span>
                    <div className="flex-1 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
                      <p className="text-xs font-semibold text-mint-300">Step {i + 1}</p>
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
