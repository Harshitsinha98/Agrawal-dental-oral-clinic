"use client";

/**
 * Patient video reviews as a row of phone-shaped cards. Hovering a card (desktop)
 * plays a silent preview; clicking opens the full video with sound in a player.
 * Nothing is downloaded until a card is hovered or opened.
 * Pattern adapted from "Animated Testimonials" / "Focus Cards" on 21st.dev (Aceternity UI).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Play, Star, X } from "lucide-react";
import type { Video } from "@/lib/types";
import { imgUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

export function VideoReviews({ videos }: { videos: Video[] }) {
  const list = videos.filter((v) => v.url);
  const [open, setOpen] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);

  useEffect(() => {
    if (open === null) return;
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
  }, [open, close, step]);

  if (!list.length) return null;
  const current = open !== null ? list[open] : null;

  return (
    <>
      <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible">
        {list.map((v, i) => (
          <motion.li
            key={v._key ?? i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={cn("w-[62vw] max-w-[260px] shrink-0 snap-center lg:w-auto lg:max-w-none", i % 2 === 1 && "lg:translate-y-10")}
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
              onPointerLeave={() => setHover(null)}
              aria-label={`Play video review${v.name ? ` from ${v.name}` : ` ${i + 1}`}`}
              className={cn(
                "group relative block aspect-[9/16] w-full overflow-hidden rounded-[1.75rem] bg-brand-900 text-left shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] ring-1 ring-white/15 transition-all duration-500 ease-out-soft",
                hover !== null && hover !== i ? "lg:scale-[0.97] lg:opacity-60 lg:blur-[1px]" : "lg:hover:-translate-y-2",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgUrl(v.poster, 520)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-1000 ease-out-soft group-hover:scale-105" />
              {hover === i && <video src={v.url!} muted autoPlay loop playsInline className="absolute inset-0 size-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/10 to-transparent" />
              <span className="absolute bottom-4 right-4 grid size-12 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/40 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-300 group-hover:text-brand-950">
                <Play className="ml-0.5 size-5" fill="currentColor" />
              </span>
              <span className="absolute bottom-4 left-4 right-20 text-white">
                <span className="flex gap-0.5 text-gold-300" aria-hidden>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="size-3.5" fill="currentColor" />
                  ))}
                </span>
                <span className="mt-1 block text-sm font-semibold">{v.name || "Patient review"}</span>
                {v.caption && <span className="block text-xs text-white/70">{v.caption}</span>}
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Video review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-950/95 p-4 backdrop-blur-md"
            onClick={close}
          >
            <motion.div
              key={current.url}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-[9/16] h-[min(86vh,820px)] max-w-full overflow-hidden rounded-[2rem] bg-black ring-1 ring-white/20"
            >
              <Player src={current.url!} poster={imgUrl(current.poster, 720)} />
            </motion.div>

            <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X className="size-5" />
            </button>
            {list.length > 1 && (
              <>
                <button type="button" onClick={(e) => (e.stopPropagation(), step(-1))} aria-label="Previous video" className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
                  <ChevronLeft className="size-6" />
                </button>
                <button type="button" onClick={(e) => (e.stopPropagation(), step(1))} aria-label="Next video" className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
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

function Player({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    ref.current?.play().catch(() => {});
  }, [src]);
  return <video ref={ref} src={src} poster={poster} controls playsInline className="size-full object-cover" />;
}
