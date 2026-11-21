import Link from "next/link";
import type { Treatment } from "@/lib/types";
import { DentalIcon } from "@/components/ui/icons";
import { Stagger, StaggerItem } from "@/components/ui/motion";

/** Every treatment as an icon tile, six to a row on large screens. */
export function TreatmentTiles({ treatments }: { treatments: Treatment[] }) {
  return (
    <Stagger as="ul" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6" gap={0.03}>
      {treatments.map((t) => (
        <StaggerItem as="li" key={t.slug}>
          <Link
            href={`/treatments/${t.slug}`}
            className="group relative flex h-full min-h-[10rem] flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-line bg-white p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-lift"
          >
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-gold-300 to-gold-500 transition-transform duration-500 group-hover:scale-x-100" />
            <span className="grid size-16 place-items-center rounded-2xl text-brand-800 transition-colors duration-300 group-hover:bg-brand-950 group-hover:text-gold-200">
              <DentalIcon name={t.icon} className="size-10" strokeWidth={1.2} />
            </span>
            <span className="text-[0.9375rem] font-semibold leading-snug text-ink">{t.title}</span>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
