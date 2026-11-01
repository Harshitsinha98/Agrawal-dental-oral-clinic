import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Treatment } from "@/lib/types";
import { DentalIcon } from "@/components/ui/icons";
import { SanityImage } from "@/components/ui/sanity-image";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";

export function TreatmentCard({ t, feature = false, className }: { t: Treatment; feature?: boolean; className?: string }) {
  const hasImage = Boolean(t.image?.asset?._id);

  if (feature) {
    return (
      <SpotlightCard tone="dark" className={cn("h-full rounded-[2rem] bg-brand-800 text-white", className)}>
        <Link href={`/treatments/${t.slug}`} className="group relative flex h-full min-h-[420px] flex-col justify-end p-7 sm:p-9">
          {hasImage && (
            <div className="absolute inset-0 -z-10">
              <SanityImage image={t.image} sizes="(min-width: 1024px) 600px, 100vw" className="opacity-60 transition-transform duration-700 ease-out-soft group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-900/70 to-brand-900/10" />
            </div>
          )}
          {!hasImage && (
            <DentalIcon name={t.icon} aria-hidden className="absolute -right-10 -top-6 -z-10 size-80 text-white/[0.06]" strokeWidth={0.8} />
          )}
          <span className="mb-auto grid size-14 place-items-center rounded-2xl bg-white/10 text-mint-300 backdrop-blur">
            <DentalIcon name={t.icon} className="size-7" />
          </span>
          <h3 className="mt-16 text-3xl font-bold sm:text-4xl">{t.title}</h3>
          <p className="mt-3 max-w-md text-lg leading-relaxed text-white/75">{t.summary}</p>
          <span className="mt-7 inline-flex items-center gap-2 font-semibold text-mint-300">
            Read about {t.title.toLowerCase()}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </SpotlightCard>
    );
  }

  return (
    <SpotlightCard className={cn("h-full rounded-[1.75rem] border border-line bg-white transition-shadow duration-300 hover:shadow-lift", className)}>
      <Link href={`/treatments/${t.slug}`} className="group relative flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between">
          <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-mint-50 group-hover:text-mint-600">
            <DentalIcon name={t.icon} />
          </span>
          <span className="grid size-9 place-items-center rounded-full border border-line text-ink-mute transition-all duration-300 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white">
            <ArrowRight className="size-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
          </span>
        </div>
        <h3 className="mt-8 text-xl font-bold text-ink">{t.title}</h3>
        <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{t.summary}</p>
        {t.visits && (
          <p className="mt-5 flex items-center gap-2 text-sm font-medium text-ink-mute">
            <Clock className="size-4" />
            {t.visits}
          </p>
        )}
      </Link>
    </SpotlightCard>
  );
}
