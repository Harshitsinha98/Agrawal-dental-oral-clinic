"use client";

/**
 * Home hero on a dark aurora. The heading rises in word by word with the highlighted
 * words in champagne gold; a second line rotates through the specialities. The photo
 * sits in an arch and drifts slower than the page; floating cards carry a silent clip
 * (laser treatment), the doctors' credentials and the years of practice. A strip of
 * credentials scrolls along the bottom edge.
 */

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { GraduationCap, MapPin, Phone, Star } from "lucide-react";
import type { DayHours, Homepage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DentalIcon } from "@/components/ui/icons";
import { SanityImage } from "@/components/ui/sanity-image";
import { OpenStatus } from "@/components/layout/open-status";
import { Aurora } from "@/components/fx/aurora";
import { WordRotate } from "@/components/fx/word-rotate";
import { Marquee } from "@/components/fx/marquee";
import { AutoVideo } from "@/components/fx/auto-video";
import { hasImg, imgUrl } from "@/lib/image";
import { formatPhone, telHref } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

function splitHeading(title: string, highlight?: string | null) {
  const i = highlight ? title.indexOf(highlight) : -1;
  if (!highlight || i < 0) return [{ text: title, hl: false }];
  return [
    { text: title.slice(0, i), hl: false },
    { text: highlight, hl: true },
    { text: title.slice(i + highlight.length), hl: false },
  ].filter((p) => p.text);
}

type Props = {
  hero: Homepage["hero"];
  hours: DayHours[];
  phone?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  reviewsUrl?: string | null;
  specialities: string[];
  credentials: string[];
  years?: number | null;
  doctorCount: number;
};

export function Hero({ hero, hours, phone, rating, reviewCount, reviewsUrl, specialities, credentials, years, doctorCount }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 110]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.35]);

  let w = 0;
  const parts = splitHeading(hero.title, hero.highlight);
  const video = hero.video?.url ? hero.video : null;

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-brand-950 pb-10 pt-32 text-white sm:pt-40 lg:min-h-[100svh]">
      <Aurora className="-z-10" />

      <motion.div style={{ opacity: fade }} className="container-page grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-3">
            {hero.eyebrow && (
              <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white/90">
                <MapPin className="size-3.5 text-gold-300" />
                {hero.eyebrow}
              </span>
            )}
            <OpenStatus hours={hours} tone="dark" />
          </motion.div>

          <h1 className="font-display text-[2.7rem] font-medium leading-[1.02] sm:text-6xl lg:text-[4.6rem]">
            {parts.map((p, pi) => (
              <span key={pi} className={p.hl ? "italic text-gold [font-variation-settings:'SOFT'_100]" : undefined}>
                {p.text.split(/(\s+)/).map((word, i) => {
                  if (/^\s+$/.test(word) || !word) return word;
                  const delay = 0.1 + w++ * 0.06;
                  return (
                    <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                      <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.85, ease, delay }}>
                        {word}
                      </motion.span>
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          {specialities.length > 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.55 }} className="mt-6 flex flex-wrap items-baseline gap-x-2 text-lg font-medium text-white/60 sm:text-xl">
              Specialists in
              <WordRotate words={specialities} className="font-semibold text-mint-200" />
            </motion.p>
          )}

          {hero.text && (
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.6 }} className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-white/70 sm:text-lg">
              {hero.text}
            </motion.p>
          )}

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.7 }} className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="/book" variant="gold" size="lg" magnetic>
              {hero.bookLabel || "Book on WhatsApp"}
            </Button>
            {phone ? (
              <Button href={telHref(phone)!} variant="glass" size="lg" icon={<Phone className="size-4 text-gold-300" />}>
                {formatPhone(phone)}
              </Button>
            ) : (
              <Button href="/treatments" variant="glass" size="lg">
                See treatments
              </Button>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {rating ? (
              <a href={reviewsUrl ?? "/reviews"} {...(reviewsUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex items-center gap-3">
                <span className="font-display text-4xl text-white">{rating.toFixed(1)}</span>
                <span className="text-sm leading-tight text-white/60">
                  <span className="flex text-gold-300" aria-hidden>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="size-4" fill={i < Math.round(rating) ? "currentColor" : "none"} />
                    ))}
                  </span>
                  <span className="mt-1 block group-hover:text-white">{reviewCount ? `${reviewCount}+ Google reviews` : "on Google"}</span>
                </span>
              </a>
            ) : null}
            <span aria-hidden className="hidden h-10 w-px bg-white/15 sm:block" />
            <span className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-gold-300/15 text-gold-300 ring-1 ring-gold-300/30">
                <GraduationCap className="size-5" />
              </span>
              <span className="text-sm leading-tight text-white/60">
                <strong className="block text-base font-semibold text-white">{doctorCount > 1 ? `${doctorCount} MDS specialists` : "MDS specialist"}</strong>
                KGMC Lucknow alumni
              </span>
            </span>
          </motion.div>
        </div>

        {/* Photo in an arch, with floating cards. */}
        <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.1, ease, delay: 0.15 }} className="relative mx-auto w-full max-w-[600px]">
          <div aria-hidden className="absolute -inset-4 rounded-t-[999px] rounded-b-[3rem] border border-gold-300/25" />
          <div aria-hidden className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgb(207_166_83/0.25),transparent_65%)] blur-2xl" />
          <motion.div style={{ y: imgY }} className="relative aspect-[16/15] overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] bg-brand-900 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] ring-1 ring-white/15">
            <SanityImage image={hero.image} sizes="(min-width: 1024px) 600px, 92vw" priority placeholderIcon="tooth" position="50% 45%" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent" />
          </motion.div>

          {video && (
            <motion.div
              style={{ y: cardY }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.9 }}
              className="absolute -left-3 top-[18%] w-[7.5rem] sm:-left-12 sm:w-36"
            >
              <div className="animate-float overflow-hidden rounded-3xl border-[3px] border-white/80 bg-brand-900 shadow-lift">
                <div className="relative aspect-[9/14]">
                  <AutoVideo src={video.url!} poster={imgUrl(video.poster, 400)} label={video.caption ?? "Treatment video"} />
                </div>
                {video.caption && (
                  <p className="flex items-center gap-1.5 bg-white px-3 py-2 text-[0.7rem] font-bold text-ink">
                    <DentalIcon name="laser" className="size-4 text-mint-600" />
                    {video.caption}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {years ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease, delay: 1 }}
              className="absolute -right-2 top-[8%] grid size-28 place-items-center rounded-full bg-[conic-gradient(from_200deg,#f4e2b4,#cfa653,#97702d,#e9d5a6,#f4e2b4)] p-[2px] shadow-glow sm:-right-8 sm:size-32"
            >
              <div className="grid size-full place-items-center rounded-full bg-brand-950 text-center">
                <span>
                  <span className="font-display block text-4xl leading-none text-gold">{years}+</span>
                  <span className="mt-1 block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/70">years of care</span>
                </span>
              </div>
            </motion.div>
          ) : null}

          {hasImg(hero.secondImage) && (
            <motion.div style={{ y: cardY }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 1.05 }} className="absolute -bottom-6 -right-2 hidden aspect-[4/3] w-44 overflow-hidden rounded-2xl border-[3px] border-white/80 shadow-lift sm:block lg:-right-10">
              <SanityImage image={hero.secondImage} sizes="176px" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.15 }}
            className="glass absolute -bottom-8 left-4 flex items-center gap-3 rounded-2xl p-3 pr-5 shadow-lift sm:left-8"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-mint-400/20 text-mint-200">
              <DentalIcon name="implant" />
            </span>
            <span className="text-sm leading-tight">
              <strong className="block font-semibold text-white">Implants · Gums · Oral medicine</strong>
              <span className="text-white/60">Specialist care under one roof</span>
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {credentials.length > 0 && (
        <div className="relative mt-24 border-y border-white/10 bg-white/[0.03] py-5 lg:mt-20">
          <Marquee duration={45} gap="3rem">
            {credentials.map((c) => (
              <span key={c} className="flex shrink-0 items-center gap-3 text-sm font-medium tracking-wide text-white/65">
                <DentalIcon name="tooth" className="size-4 text-gold-300" />
                {c}
              </span>
            ))}
          </Marquee>
        </div>
      )}
    </section>
  );
}
