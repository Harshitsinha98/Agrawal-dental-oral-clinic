"use client";

/**
 * Filterable photo grid with a lightbox. Filters slide a pill between tabs; photos
 * re-flow with layout animations; the lightbox supports arrow keys, Esc and swipe.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Img } from "@/lib/types";
import { galleryCategories } from "@/sanity/schemas/options";
import { SanityImage, ImagePlaceholder } from "@/components/ui/sanity-image";
import { cn } from "@/lib/utils";

type Photo = NonNullable<Img>;

export function GalleryGrid({ photos }: { photos: Photo[] }) {
  const [filter, setFilter] = useState("all");
  const [index, setIndex] = useState<number | null>(null);

  const tabs = useMemo(() => {
    const used = new Set(photos.map((p) => p.category ?? "clinic"));
    return [{ value: "all", title: "All" }, ...galleryCategories.filter((c) => used.has(c.value))];
  }, [photos]);

  const shown = filter === "all" ? photos : photos.filter((p) => (p.category ?? "clinic") === filter);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + shown.length) % shown.length)), [shown.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [index, close, step]);

  if (!photos.length) {
    return (
      <div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-3xl">
              <ImagePlaceholder icon={["tooth", "checkup", "cleaning", "sealed", "hygiene", "implant"][i]} />
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-ink-mute">Photos of the clinic will appear here soon.</p>
      </div>
    );
  }

  const current = index !== null ? shown[index] : null;

  return (
    <>
      {tabs.length > 2 && (
        <div role="tablist" aria-label="Filter photos" className="mb-8 inline-flex flex-wrap gap-1 rounded-full border border-line bg-white p-1.5 shadow-soft">
          {tabs.map((t) => (
            <button
              key={t.value}
              role="tab"
              aria-selected={filter === t.value}
              onClick={() => setFilter(t.value)}
              className={cn("relative rounded-full px-4 py-2 text-sm font-semibold transition-colors", filter === t.value ? "text-white" : "text-ink-soft hover:text-ink")}
            >
              {filter === t.value && <motion.span layoutId="gallery-tab" className="absolute inset-0 -z-0 rounded-full bg-brand-600" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
              <span className="relative">{t.title}</span>
            </button>
          ))}
        </div>
      )}

      <motion.ul layout className="columns-2 gap-3 sm:columns-3 sm:gap-4 [&>li]:mb-3 sm:[&>li]:mb-4">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => {
            const ratio = p.asset?.metadata?.dimensions?.aspectRatio ?? 1;
            return (
              <motion.li key={p._key ?? i} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.35 }} className="break-inside-avoid">
                <button type="button" onClick={() => setIndex(i)} className="group relative block w-full overflow-hidden rounded-3xl bg-white" style={{ aspectRatio: ratio }} aria-label={`Open photo: ${p.alt || p.caption || `photo ${i + 1}`}`}>
                  <SanityImage image={p} sizes="(min-width: 640px) 33vw, 50vw" className="transition-transform duration-700 ease-out-soft group-hover:scale-105" />
                  {p.caption && (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 pt-10 text-left text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {p.caption}
                    </span>
                  )}
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-950/92 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <motion.figure
              key={current._key ?? index}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) step(1);
                if (info.offset.x > 80) step(-1);
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-[78vh] w-full max-w-5xl"
            >
              <SanityImage image={current} sizes="100vw" className="!object-contain" />
              <figcaption className="absolute -bottom-10 inset-x-0 text-center text-sm text-white/80">
                {current.caption} <span className="text-white/50">{(index ?? 0) + 1} / {shown.length}</span>
              </figcaption>
            </motion.figure>

            <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X className="size-5" />
            </button>
            {shown.length > 1 && (
              <>
                <button type="button" onClick={(e) => (e.stopPropagation(), step(-1))} aria-label="Previous photo" className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:grid">
                  <ChevronLeft className="size-6" />
                </button>
                <button type="button" onClick={(e) => (e.stopPropagation(), step(1))} aria-label="Next photo" className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:grid">
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
