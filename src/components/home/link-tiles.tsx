import Link from "next/link";
import type { LinkTile } from "@/lib/types";
import { DentalIcon } from "@/components/ui/icons";
import { Section, SectionHeading } from "@/components/ui/section";
import { Stagger, StaggerItem } from "@/components/ui/motion";

/** "More than a dental clinic": a row of icon tiles linking around the site. */
export function LinkTiles({ heading, intro, items }: { heading?: string | null; intro?: string | null; items: LinkTile[] }) {
  if (!items.length) return null;
  return (
    <Section className="py-16 sm:py-20">
      <div className="rounded-[2rem] bg-gradient-to-b from-gold-50/80 to-white px-5 py-10 ring-1 ring-gold-100 sm:px-10 sm:py-12">
        <SectionHeading heading={heading} intro={intro} align="center" className="mb-8 sm:mb-10" />
        <Stagger as="ul" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" gap={0.05}>
          {items.map((t, i) => {
            const external = /^https?:/.test(t.link);
            const cls = "group flex h-full min-h-[8rem] flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-white p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-lift";
            const inner = (
              <>
                <span className="grid size-12 place-items-center rounded-2xl bg-gold-50 text-gold-700 ring-1 ring-gold-200 transition-colors duration-300 group-hover:bg-brand-950 group-hover:text-gold-200 group-hover:ring-brand-950">
                  <DentalIcon name={t.icon ?? "tooth"} className="size-6" />
                </span>
                <span className="text-[0.9375rem] font-semibold text-ink">{t.label}</span>
              </>
            );
            return (
              <StaggerItem as="li" key={t._key ?? i}>
                {external ? (
                  <a href={t.link} target="_blank" rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link href={t.link} className={cls}>
                    {inner}
                  </Link>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
