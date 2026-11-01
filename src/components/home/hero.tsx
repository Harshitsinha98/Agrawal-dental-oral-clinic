"use client";

/**
 * Home hero. The heading rises in word by word, the highlighted word gets the
 * smile-curve underline, and the photo drifts slightly slower than the page as
 * you scroll. Floating cards carry the two facts patients look for first:
 * is it open, and do other patients like it.
 */

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Phone, Star } from "lucide-react";
import type { DayHours, Homepage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DentalIcon } from "@/components/ui/icons";
import { SanityImage } from "@/components/ui/sanity-image";
import { SmileUnderline } from "@/components/ui/motion";
import { OpenStatus } from "@/components/layout/open-status";
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
};

export function Hero({ hero, hours, phone, rating, reviewCount, reviewsUrl }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);

  let w = 0;
  const parts = splitHeading(hero.title, hero.highlight);

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 pb-16 sm:pt-36 lg:pb-24">
      {/* Background: a pale wash and a single smile arc. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[85%] bg-gradient-to-b from-brand-50 via-brand-50/60 to-transparent" />
        <svg viewBox="0 0 800 400" className="absolute -right-40 top-24 w-[900px] max-w-none text-brand-100 lg:right-[-8rem]" fill="none">
          <path d="M20 60c120 300 640 300 760 0" stroke="currentColor" strokeWidth="2" />
          <path d="M80 70c110 240 530 240 640 0" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 8" />
        </svg>
      </div>

      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            {hero.eyebrow && <span className="rounded-full border border-brand-100 bg-white px-3.5 py-1.5 text-[0.8125rem] font-semibold text-brand-700 shadow-soft">{hero.eyebrow}</span>}
            <OpenStatus hours={hours} />
          </motion.div>

          <h1 className="text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink sm:text-6xl lg:text-[4.1rem]">
            {parts.map((p, pi) => (
              <span key={pi} className={p.hl ? "relative inline-block whitespace-nowrap text-brand-600" : undefined}>
                {p.text.split(/(\s+)/).map((word, i) => {
                  if (/^\s+$/.test(word) || !word) return word;
                  const delay = 0.08 + w++ * 0.06;
                  return (
                    <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                      <motion.span className="inline-block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.75, ease, delay }}>
                        {word}
                      </motion.span>
                    </span>
                  );
                })}
                {p.hl && <SmileUnderline className="absolute -bottom-2 left-0 h-3 w-full text-mint-400 sm:-bottom-3 sm:h-4" />}
              </span>
            ))}
          </h1>

          {hero.text && (
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.45 }} className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              {hero.text}
            </motion.p>
          )}

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.55 }} className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="/book" size="lg" magnetic>
              {hero.bookLabel || "Book on WhatsApp"}
            </Button>
            {phone ? (
              <Button href={telHref(phone)!} variant="outline" size="lg" icon={<Phone className="size-4" />}>
                {formatPhone(phone)}
              </Button>
            ) : (
              <Button href="/treatments" variant="outline" size="lg">
                See treatments
              </Button>
            )}
          </motion.div>

          {rating && (
            <motion.a
              href={reviewsUrl ?? "/reviews"}
              {...(reviewsUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="mt-10 inline-flex items-center gap-3 text-sm text-ink-soft hover:text-ink"
            >
              <span className="flex text-amber-400" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="size-4" fill={i < Math.round(rating) ? "currentColor" : "none"} />
                ))}
              </span>
              <span>
                <strong className="font-bold text-ink">{rating.toFixed(1)}</strong> on Google{reviewCount ? ` from ${reviewCount} patient reviews` : ""}
              </span>
            </motion.a>
          )}
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease, delay: 0.15 }} className="relative mx-auto w-full max-w-[540px]">
          <motion.div style={{ y: imgY }} className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] rounded-tl-[9rem] bg-white shadow-lift ring-1 ring-black/5">
            <SanityImage image={hero.image} aspect={4 / 5} sizes="(min-width: 1024px) 540px, 92vw" priority placeholderIcon="tooth" />
          </motion.div>

          {hero.secondImage?.asset && (
            <motion.div style={{ y: cardY }} className="absolute -bottom-8 -left-6 hidden aspect-square w-40 overflow-hidden rounded-3xl border-4 border-white shadow-lift sm:block">
              <SanityImage image={hero.secondImage} aspect={1} sizes="160px" />
            </motion.div>
          )}

          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.8 }}
            className="absolute -right-2 top-10 flex items-center gap-3 rounded-2xl bg-white/95 p-3 pr-5 shadow-lift backdrop-blur sm:-right-8"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-mint-50 text-mint-600">
              <DentalIcon name="implant" />
            </span>
            <span className="text-sm leading-tight">
              <strong className="block font-bold text-ink">Implants & gum care</strong>
              <span className="text-ink-mute">Speciality focus</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.95 }}
            className="absolute -bottom-6 right-6 flex items-center gap-3 rounded-2xl bg-brand-700 p-3 pr-5 text-white shadow-lift"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-white/12">
              <DentalIcon name="child" />
            </span>
            <span className="text-sm leading-tight">
              <strong className="block font-bold">For the whole family</strong>
              <span className="text-white/70">Kids to grandparents</span>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
