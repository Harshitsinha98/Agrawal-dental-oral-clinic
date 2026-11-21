import { Award } from "lucide-react";
import type { Img } from "@/lib/types";
import { SanityImage } from "@/components/ui/sanity-image";
import { SectionHeading } from "@/components/ui/section";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/motion";
import { Aurora } from "@/components/fx/aurora";
import { hasImg } from "@/lib/image";
import { cn } from "@/lib/utils";

/** Honours on a dark band: a list with gold medals beside a collage of the award cabinets. */
export function Awards({ heading, intro, honours, photos }: { heading?: string | null; intro?: string | null; honours: string[]; photos: Img[] }) {
  const pics = photos.filter(hasImg).slice(0, 5);
  if (!honours.length && !pics.length) return null;

  return (
    <section id="awards" className="relative isolate scroll-mt-20 overflow-hidden bg-brand-950 py-24 text-white sm:py-32">
      <Aurora intensity="soft" className="-z-10" />
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow="Awards & honours" heading={heading} intro={intro} dark className="mb-10 sm:mb-12" />
          {honours.length > 0 && (
            <Stagger as="ul" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" gap={0.06}>
              {honours.map((h) => (
                <StaggerItem as="li" key={h} className="group flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors duration-300 hover:border-gold-300/40 hover:bg-white/[0.07]">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[conic-gradient(from_200deg,#f4e2b4,#cfa653,#97702d,#e9d5a6,#f4e2b4)] text-brand-950 shadow-glow">
                    <Award className="size-5" />
                  </span>
                  <span className="pt-2 text-[0.9375rem] font-medium leading-snug text-white/85">{h}</span>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>

        {pics.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {[pics.filter((_, i) => i % 2 === 0), pics.filter((_, i) => i % 2 === 1)].map((col, c) => (
              <div key={c} className={cn("space-y-4 sm:space-y-5", c === 1 && "pt-14")}>
                {col.map((p, i) => (
                  <Reveal key={p._key ?? i} delay={0.08 * (i + c)} className={cn("group relative overflow-hidden rounded-[1.75rem] p-[1.5px]", "bg-[linear-gradient(160deg,rgb(244_226_180/0.7),rgb(207_166_83/0.15)_40%,rgb(244_226_180/0.5))]")}>
                    <div className={cn("relative overflow-hidden rounded-[calc(1.75rem-1.5px)] bg-brand-900", i === 0 && c === 0 ? "aspect-[3/4]" : "aspect-[4/5]")}>
                      <SanityImage image={p} sizes="(min-width: 1024px) 300px, 45vw" className="transition-transform duration-1000 ease-out-soft group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 to-transparent" />
                    </div>
                  </Reveal>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
