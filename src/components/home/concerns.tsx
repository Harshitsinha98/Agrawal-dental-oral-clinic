import Link from "next/link";
import { DentalIcon } from "@/components/ui/icons";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";

type Item = { _key: string; label: string; icon?: string | null; treatmentSlug?: string | null };

/** "How can we help you today?": icon tiles. One tap opens the booking form with that treatment filled in. */
export function Concerns({ heading, intro, items }: { heading?: string | null; intro?: string | null; items: Item[] }) {
  if (!items.length) return null;
  return (
    <section className="py-10 sm:py-14">
      <div className="container-page">
        <div className="rounded-[2rem] bg-gradient-to-b from-gold-50/80 to-white px-5 py-10 ring-1 ring-gold-100 sm:px-10 sm:py-14">
          <Reveal className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            {heading && <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl">{heading}</h2>}
            {intro && <p className="mt-3 text-ink-soft">{intro}</p>}
          </Reveal>
          <Stagger as="ul" className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4" gap={0.04}>
            {items.map((item) => (
              <StaggerItem as="li" key={item._key}>
                <Link
                  href={item.treatmentSlug ? `/book?treatment=${item.treatmentSlug}` : "/book"}
                  className="group flex h-full min-h-[8.5rem] flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-white p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-lift"
                >
                  <span className="grid size-14 place-items-center rounded-2xl text-brand-800 transition-colors duration-300 group-hover:bg-brand-950 group-hover:text-gold-200">
                    <DentalIcon name={item.icon} className="size-9" strokeWidth={1.3} />
                  </span>
                  <span className="text-[0.9375rem] font-semibold leading-snug text-ink">{item.label}</span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
