import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import type { Treatment } from "@/lib/types";
import { DentalIcon } from "@/components/ui/icons";
import { SanityImage } from "@/components/ui/sanity-image";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { hasImg } from "@/lib/image";
import { cn } from "@/lib/utils";

/**
 * `feature`: tall dark card with the photo behind the text (first card of the home bento).
 * `photo`: photo on top, text below (rest of the bento and the treatments page).
 */
export function TreatmentCard({ t, feature = false, className }: { t: Treatment; feature?: boolean; className?: string }) {
  const hasImage = hasImg(t.image);

  if (feature) {
    return (
      <SpotlightCard tone="dark" className={cn("h-full rounded-[2.25rem] bg-brand-950 text-white", className)}>
        <Link href={`/treatments/${t.slug}`} className="group relative flex h-full min-h-[460px] flex-col justify-end p-7 sm:p-10">
          {hasImage ? (
            <div className="absolute inset-0 -z-10">
              <SanityImage image={t.image} sizes="(min-width: 1024px) 620px, 100vw" className="opacity-70 transition-transform duration-1000 ease-out-soft group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-brand-950/0" />
            </div>
          ) : (
            <DentalIcon name={t.icon} aria-hidden className="absolute -right-10 -top-6 -z-10 size-80 text-white/[0.06]" strokeWidth={0.8} />
          )}
          <span className="glass mb-auto grid size-14 place-items-center rounded-2xl text-gold-200">
            <DentalIcon name={t.icon} className="size-7" />
          </span>
          <p className="eyebrow mt-16 text-gold-300">Speciality</p>
          <h3 className="font-display mt-3 text-4xl font-medium sm:text-5xl">{t.title}</h3>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-white/75">{t.summary}</p>
          <span className="mt-8 inline-flex items-center gap-2 font-semibold text-gold-200">
            Read about {t.title.toLowerCase()}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </SpotlightCard>
    );
  }

  return (
    <SpotlightCard className={cn("h-full rounded-[1.75rem] border border-line bg-white transition-[box-shadow,transform] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-lift", className)}>
      <Link href={`/treatments/${t.slug}`} className="group relative flex h-full flex-col">
        {hasImage && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-[1.75rem] bg-mist">
            <SanityImage image={t.image} aspect={16 / 10} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="transition-transform duration-1000 ease-out-soft group-hover:scale-[1.06]" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 to-transparent" />
            <span className="absolute bottom-4 left-4 grid size-11 place-items-center rounded-xl bg-white/95 text-brand-800 shadow-soft">
              <DentalIcon name={t.icon} />
            </span>
          </div>
        )}
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          {!hasImage && (
            <span className="mb-6 grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
              <DentalIcon name={t.icon} />
            </span>
          )}
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-2xl font-medium text-ink">{t.title}</h3>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink-mute transition-all duration-300 group-hover:border-brand-900 group-hover:bg-brand-900 group-hover:text-gold-200">
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </div>
          <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{t.summary}</p>
          {t.visits && (
            <p className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-sm font-medium text-ink-mute">
              <Clock className="size-4 text-gold-500" />
              {t.visits}
            </p>
          )}
        </div>
      </Link>
    </SpotlightCard>
  );
}
