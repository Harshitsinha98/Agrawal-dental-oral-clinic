"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import type { QA } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Faq({ items, className }: { items: QA[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  if (!items.length) return null;

  return (
    <ul className={cn("divide-y divide-line overflow-hidden rounded-[1.75rem] border border-line bg-white", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item._key ?? i}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-[1.0625rem] font-semibold text-ink transition-colors hover:text-brand-700 sm:px-7"
              >
                {item.question}
                <span className={cn("grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-300", isOpen ? "rotate-45 border-brand-600 bg-brand-600 text-white" : "border-line text-ink-mute")}>
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${id}-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 leading-relaxed text-ink-soft sm:px-7 sm:pr-20">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
