"use client";

/**
 * "Step inside the clinic". On large screens the section pins while you scroll and the
 * photos glide sideways, like walking through the clinic; each photo also drifts a
 * little inside its frame. On phones, with reduced motion, or with very few photos,
 * it's a plain swipeable strip.
 * Pattern adapted from "Horizontal Scroll Carousel" / "Hero Parallax" on 21st.dev.
 */

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Img } from "@/lib/types";
import { SanityImage } from "@/components/ui/sanity-image";
import { imgRatio } from "@/lib/image";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
}

export function ClinicTour({ photos, header }: { photos: Img[]; header: ReactNode }) {
  const list = photos.filter(Boolean) as NonNullable<Img>[];
  const reduce = useReducedMotion();
  const wide = useWide();
  const pinned = wide && !reduce && list.length >= 4;

  if (!list.length) return null;
  return pinned ? <Pinned photos={list} header={header} /> : <Strip photos={list} header={header} />;
}

function Pinned({ photos, header }: { photos: NonNullable<Img>[]; header: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useIsoLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth + 80));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [photos.length]);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={outer} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container-page">{header}</div>
        <motion.div ref={track} style={{ x }} className="flex gap-6 pl-[max(1.25rem,calc((100vw-1240px)/2))] will-change-transform">
          {photos.map((p, i) => (
            <Frame key={p._key ?? i} photo={p} index={i} progress={scrollYProgress} count={photos.length} />
          ))}
          <Link href="/gallery" className="group grid h-[58vh] w-[22rem] shrink-0 place-items-center rounded-[2rem] border border-dashed border-gold-300 bg-gold-50/50 text-center">
            <span>
              <span className="font-display block text-3xl text-ink">See every photo</span>
              <span className="mt-3 inline-flex items-center gap-2 font-semibold text-gold-700">
                Open the gallery
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        </motion.div>
        <div className="container-page mt-10">
          <div className="h-px w-full bg-line">
            <motion.div style={{ width: bar }} className="h-px bg-gold-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame({ photo, index, progress, count }: { photo: NonNullable<Img>; index: number; progress: MotionValue<number>; count: number }) {
  const ratio = Math.min(1.6, Math.max(0.75, imgRatio(photo, 1.33)));
  const start = index / count;
  const shift = useTransform(progress, [Math.max(0, start - 0.3), Math.min(1, start + 0.3)], ["-6%", "6%"]);
  return (
    <figure className="group relative h-[58vh] shrink-0 overflow-hidden rounded-[2rem] bg-mist shadow-soft" style={{ aspectRatio: ratio }}>
      <motion.div style={{ x: shift }} className="absolute -inset-x-[8%] inset-y-0">
        <SanityImage image={photo} sizes="60vw" className="transition-transform duration-1000 ease-out-soft group-hover:scale-105" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent opacity-80" />
      {(photo.caption || photo.alt) && <figcaption className="absolute inset-x-5 bottom-5 text-sm font-medium text-white/90">{photo.caption || photo.alt}</figcaption>}
    </figure>
  );
}

function Strip({ photos, header }: { photos: NonNullable<Img>[]; header: ReactNode }) {
  return (
    <div>
      <div className="container-page">{header}</div>
      <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:px-[max(1.25rem,calc((100vw-1240px)/2))]">
        {photos.map((p, i) => (
          <li key={p._key ?? i} className={cn("relative h-[52vh] max-h-[460px] shrink-0 snap-center overflow-hidden rounded-[1.75rem] bg-mist")} style={{ aspectRatio: Math.min(1.4, Math.max(0.75, imgRatio(p, 1.33))) }}>
            <SanityImage image={p} sizes="85vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent" />
            {(p.caption || p.alt) && <p className="absolute inset-x-4 bottom-4 text-sm font-medium text-white/90">{p.caption || p.alt}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
