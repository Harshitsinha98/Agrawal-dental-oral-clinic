import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DentalIcon } from "@/components/ui/icons";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";

type Item = { _key: string; label: string; icon?: string | null; treatmentSlug?: string | null };

/** "What brings you in?": one tap opens the booking form with that treatment filled in. */
export function Concerns({ heading, intro, items }: { heading?: string | null; intro?: string | null; items: Item[] }) {
  if (!items.length) return null;
  return (
    <section className="relative z-10 pt-16 sm:pt-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2.25rem] border border-line bg-pearl p-6 shadow-lift sm:p-10">
          <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(221_190_120/0.25),transparent_70%)]" />
          <Reveal className="relative mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            {heading && <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl">{heading}</h2>}
            {intro && <p className="max-w-md text-ink-soft sm:text-right">{intro}</p>}
          </Reveal>
          <Stagger as="ul" className="relative grid grid-cols-2 gap-3 md:grid-cols-4" gap={0.05}>
            {items.map((item) => (
              <StaggerItem as="li" key={item._key}>
                <Link
                  href={item.treatmentSlug ? `/book?treatment=${item.treatmentSlug}` : "/book"}
                  className="group flex h-full min-h-[44px] flex-col items-start gap-3 rounded-2xl border border-line bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-200 hover:shadow-soft sm:flex-row sm:items-center"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-900 group-hover:text-gold-200">
                    <DentalIcon name={item.icon} />
                  </span>
                  <span className="flex-1 text-[0.9375rem] font-semibold leading-snug text-ink">{item.label}</span>
                  <ArrowUpRight className="hidden size-4 shrink-0 text-gold-500 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 sm:block" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
