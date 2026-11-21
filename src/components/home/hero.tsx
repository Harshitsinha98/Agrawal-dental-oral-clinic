"use client";

/**
 * Home banner in the style of large clinic chains: a light slider (text on the left,
 * photo on the right) that moves to the next slide every few seconds, with arrows and
 * dots, and a strip of numbers underneath. Every slide, button and number comes from
 * Sanity (Home page → Top banner). Autoplay pauses on hover and for visitors who prefer
 * reduced motion.
 */

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Phone, Star } from "lucide-react";
import type { Counter, DayHours, HeroSlide, Homepage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DentalIcon } from "@/components/ui/icons";
import { SanityImage } from "@/components/ui/sanity-image";
import { OpenStatus } from "@/components/layout/open-status";
import { AutoVideo } from "@/components/fx/auto-video";
import { imgUrl } from "@/lib/image";
import { cn, formatPhone, telHref } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;
const INTERVAL = 7000;

function Heading({ title, highlight }: { title: string; highlight?: string | null }) {
  const i = highlight ? title.indexOf(highlight) : -1;
  if (!highlight || i < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, i)}
      <em className="italic text-gold-600">{highlight}</em>
      {title.slice(i + highlight.length)}
    </>
  );
}

type Props = {
  hero: Homepage["hero"];
  hours: DayHours[];
  phone?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
};

export function Hero({ hero, hours, phone, rating, reviewCount }: Props) {
  const slides: HeroSlide[] = hero.slides?.length
    ? hero.slides
    : [{ eyebrow: hero.eyebrow, title: hero.title, highlight: hero.highlight, text: hero.text, image: hero.image }];
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setIndex((i) => (i + d + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (slides.length < 2 || paused || reduce) return;
    const id = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(id);
  }, [index, paused, reduce, go, slides.length]);

  const slide = slides[index];
  const video = index === 0 && hero.video?.url ? hero.video : null;

  return (
    <section className="relative overflow-hidden bg-pearl pb-6 pt-24 sm:pt-28">
      <div aria-hidden className="dots pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <div className="container-page relative">
        <div
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-50 via-white to-gold-50 ring-1 ring-line sm:rounded-[2.5rem]"
          onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          aria-roledescription="carousel"
          aria-label="Highlights"
        >
          <div aria-hidden className="absolute -left-24 -top-24 size-80 rounded-full bg-[radial-gradient(circle,rgb(61_186_176/0.18),transparent_70%)]" />
          <div className="grid min-h-[560px] lg:grid-cols-[1.05fr_1fr]">
            {/* Text */}
            <div className="relative z-10 order-2 flex flex-col justify-center px-6 pb-10 pt-8 sm:px-10 lg:order-1 lg:px-14 lg:py-14">
              <AnimatePresence mode="wait" initial={false} custom={dir}>
                <motion.div
                  key={index}
                  custom={dir}
                  initial={{ opacity: 0, x: reduce ? 0 : dir * 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reduce ? 0 : dir * -30 }}
                  transition={{ duration: 0.55, ease }}
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${slides.length}`}
                >
                  <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
                  </div>
                  {index === 0 ? (
                    <h1 className="font-display text-[2.4rem] font-medium leading-[1.04] text-ink sm:text-[3.4rem] lg:text-[3.9rem]">
                      <Heading title={slide.title} highlight={slide.highlight} />
                    </h1>
                  ) : (
                    <p className="font-display text-[2.4rem] font-medium leading-[1.04] text-ink sm:text-[3.4rem] lg:text-[3.9rem]">
                      <Heading title={slide.title} highlight={slide.highlight} />
                    </p>
                  )}
                  {slide.text && <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft sm:text-lg">{slide.text}</p>}
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    {slide.buttonLabel && slide.buttonLink ? (
                      <Button href={slide.buttonLink} size="lg">
                        {slide.buttonLabel}
                      </Button>
                    ) : (
                      <Button href="/book" variant="gold" size="lg" magnetic>
                        {hero.bookLabel || "Book an appointment"}
                      </Button>
                    )}
                    {phone && (
                      <Button href={telHref(phone)!} variant="outline" size="lg" icon={<Phone className="size-4 text-gold-600" />}>
                        {formatPhone(phone)}
                      </Button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <OpenStatus hours={hours} />
                {rating ? (
                  <span className="flex items-center gap-2 text-sm text-ink-soft">
                    <span className="flex text-gold-400" aria-hidden>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} className="size-4" fill={i < Math.round(rating) ? "currentColor" : "none"} />
                      ))}
                    </span>
                    <strong className="font-semibold text-ink">{rating.toFixed(1)}</strong>
                    {reviewCount ? `· ${reviewCount}+ Google reviews` : "on Google"}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Photo */}
            <div className="relative order-1 aspect-[4/3] sm:aspect-[16/10] lg:order-2 lg:aspect-auto">
              <AnimatePresence initial={false}>
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease }}
                  className="absolute inset-0 lg:[mask-image:radial-gradient(130%_100%_at_100%_50%,black_70%,transparent_100%)]"
                >
                  <SanityImage image={slide.image} sizes="(min-width: 1024px) 50vw, 100vw" priority={index === 0} placeholderIcon="tooth" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/25 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

              <AnimatePresence>
                {slide.badge && (
                  <motion.div
                    key={`badge-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease, delay: 0.3 }}
                    className="absolute right-4 top-4 grid size-24 place-items-center rounded-full bg-[conic-gradient(from_200deg,#f4e2b4,#cfa653,#97702d,#e9d5a6,#f4e2b4)] p-[2px] shadow-glow sm:right-6 sm:top-6 sm:size-28"
                  >
                    <div className="grid size-full place-items-center rounded-full bg-brand-950 px-2 text-center">
                      <span>
                        <span className="font-display block text-3xl leading-none text-gold sm:text-4xl">{slide.badge}</span>
                        {slide.badgeText && <span className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/75">{slide.badgeText}</span>}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {video && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.6 }} className="absolute bottom-5 right-5 hidden w-28 sm:block lg:bottom-8 lg:right-8">
                  <div className="animate-float overflow-hidden rounded-2xl border-[3px] border-white bg-brand-900 shadow-lift">
                    <div className="relative aspect-[9/14]">
                      <AutoVideo src={video.url!} poster={imgUrl(video.poster, 300)} label={video.caption ?? "Treatment video"} />
                    </div>
                    {video.caption && (
                      <p className="flex items-center gap-1 bg-white px-2 py-1.5 text-[0.65rem] font-bold text-ink">
                        <DentalIcon name="laser" className="size-3.5 text-mint-600" />
                        {video.caption}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {slides.length > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="absolute left-3 top-[30%] z-20 grid size-11 place-items-center rounded-full bg-white/90 text-ink shadow-soft ring-1 ring-line transition hover:bg-brand-950 hover:text-white lg:top-1/2 lg:-translate-y-1/2">
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next slide" className="absolute right-3 top-[30%] z-20 grid size-11 place-items-center rounded-full bg-white/90 text-ink shadow-soft ring-1 ring-line transition hover:bg-brand-950 hover:text-white lg:top-1/2 lg:-translate-y-1/2">
                <ChevronRight className="size-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 lg:left-14 lg:translate-x-0">
                {slides.map((s, i) => (
                  <button
                    key={s._key ?? i}
                    type="button"
                    onClick={() => (setDir(i > index ? 1 : -1), setIndex(i))}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index}
                    className="grid h-6 place-items-center"
                  >
                    <span className={cn("block h-1.5 rounded-full transition-all duration-500", i === index ? "w-8 bg-gold-500" : "w-3 bg-brand-200 hover:bg-brand-300")} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {!!hero.counters?.length && <Counters items={hero.counters} />}
      </div>
    </section>
  );
}

function Counters({ items }: { items: Counter[] }) {
  return (
    <motion.ul
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } } }}
      className="mt-5 grid grid-cols-2 gap-y-4 rounded-2xl border border-line bg-white px-4 py-4 shadow-soft sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-line"
    >
      {items.map((c, i) => (
        <motion.li key={c._key ?? i} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex items-center justify-center gap-3 px-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-50 text-gold-700 ring-1 ring-gold-200">
            <DentalIcon name={c.icon ?? "tooth"} className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="font-display block text-xl text-ink">{c.value}</span>
            <span className="text-xs font-medium text-ink-mute">{c.label}</span>
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
