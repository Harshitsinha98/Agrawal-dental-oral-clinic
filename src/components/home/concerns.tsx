import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DentalIcon } from "@/components/ui/icons";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";

type Item = { _key: string; label: string; icon?: string | null; treatmentSlug?: string | null };

/** "What brings you in?": one tap opens the booking form with that treatment filled in. */
export function Concerns({ heading, intro, items }: { heading?: string | null; intro?: string | null; items: Item[] }) {
  if (!items.length) return null;
  return (
    <section className="relative z-10 -mt-2 pb-8">
      <div className="container-page">
        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-10">
          <Reveal className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            {heading && <h2 className="text-2xl font-bold text-ink sm:text-3xl">{heading}</h2>}
            {intro && <p className="max-w-md text-ink-soft sm:text-right">{intro}</p>}
          </Reveal>
          <Stagger as="ul" className="grid grid-cols-2 gap-3 md:grid-cols-4" gap={0.05}>
            {items.map((item) => (
              <StaggerItem as="li" key={item._key}>
                <Link
                  href={item.treatmentSlug ? `/book?treatment=${item.treatmentSlug}` : "/book"}
                  className="group flex h-full flex-col items-start gap-3 rounded-2xl border border-line bg-canvas p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white hover:shadow-soft sm:flex-row sm:items-center"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-soft transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                    <DentalIcon name={item.icon} />
                  </span>
                  <span className="flex-1 text-[0.9375rem] font-semibold leading-snug text-ink">{item.label}</span>
                  <ArrowUpRight className="hidden size-4 shrink-0 text-ink-mute opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 sm:block" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
