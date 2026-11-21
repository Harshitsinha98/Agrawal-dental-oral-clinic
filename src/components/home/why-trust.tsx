import { CheckCircle2 } from "lucide-react";
import type { Img, TrustBox } from "@/lib/types";
import { DentalIcon } from "@/components/ui/icons";
import { SanityImage } from "@/components/ui/sanity-image";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { hasImg } from "@/lib/image";

/** "Why patients trust us": a photo beside boxes of short points. */
export function WhyTrust({ heading, intro, image, boxes }: { heading?: string | null; intro?: string | null; image?: Img; boxes: TrustBox[] }) {
  if (!boxes.length) return null;
  return (
    <Section tone="white">
      <SectionHeading eyebrow="Why choose us" heading={heading} intro={intro} align="center" />
      <div className="grid items-stretch gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {hasImg(image) && (
          <Reveal className="relative min-h-[320px] overflow-hidden rounded-[2rem] bg-mist shadow-lift">
            <SanityImage image={image} sizes="(min-width: 1024px) 45vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 to-transparent" />
          </Reveal>
        )}
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {boxes.map((b, i) => (
            <StaggerItem key={b._key ?? i} className="group rounded-[1.5rem] border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-200 hover:shadow-lift">
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-950 text-gold-200">
                  <DentalIcon name={b.icon ?? "shield"} className="size-5" />
                </span>
                <h3 className="font-display text-xl font-medium text-ink">{b.title}</h3>
              </div>
              {!!b.points?.length && (
                <ul className="mt-4 space-y-2.5">
                  {b.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-[0.9375rem] leading-snug text-ink-soft">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold-500" />
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
