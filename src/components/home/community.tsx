import { HeartHandshake, School, Users } from "lucide-react";
import type { Img, Video } from "@/lib/types";
import { SanityImage } from "@/components/ui/sanity-image";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { AutoVideo } from "@/components/fx/auto-video";
import { hasImg, imgUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

const icons = [School, Users, HeartHandshake];

/**
 * Free camps: highlights, a silent clip and a photo mosaic. Hovering one tile softens
 * the others ("Focus Cards" pattern from 21st.dev / Aceternity UI).
 */
export function Community({
  heading,
  intro,
  points,
  photos,
  video,
}: {
  heading?: string | null;
  intro?: string | null;
  points: { _key?: string; title: string; text?: string | null }[];
  photos: Img[];
  video?: Video | null;
}) {
  const pics = photos.filter(hasImg).slice(0, video?.url ? 4 : 5);
  return (
    <Section tone="white">
      <SectionHeading eyebrow="In the community" heading={heading} intro={intro} />

      <div className="group/focus grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 lg:grid-cols-4">
        {video?.url && (
          <Reveal className="relative col-span-2 row-span-2 overflow-hidden rounded-[1.75rem] bg-brand-900 transition-[filter] duration-500 group-hover/focus:brightness-75 hover:!brightness-100">
            <AutoVideo src={video.url} poster={imgUrl(video.poster, 1000)} label="Dental awareness camp at a school" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 to-transparent" />
            <span className="glass absolute bottom-4 left-4 rounded-full px-3 py-1.5 text-xs font-semibold text-white">Live from a school camp</span>
          </Reveal>
        )}
        {pics.map((p, i) => (
          <Reveal
            key={p._key ?? i}
            delay={0.05 * i}
            className={cn(
              "group relative overflow-hidden rounded-[1.75rem] bg-mist transition-[filter] duration-500 group-hover/focus:brightness-75 group-hover/focus:blur-[1px] hover:!brightness-100 hover:!blur-none",
              !video?.url && i === 0 && "col-span-2 row-span-2",
            )}
          >
            <SanityImage image={p} sizes="(min-width: 1024px) 25vw, 50vw" className="transition-transform duration-1000 ease-out-soft group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            {(p.caption || p.alt) && <p className="absolute inset-x-4 bottom-4 translate-y-2 text-sm font-medium text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">{p.caption || p.alt}</p>}
          </Reveal>
        ))}
      </div>

      {points.length > 0 && (
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-3">
          {points.map((pt, i) => {
            const Icon = icons[i % icons.length];
            return (
              <StaggerItem key={pt._key ?? i} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold-50 text-gold-700 ring-1 ring-gold-200">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{pt.title}</h3>
                  {pt.text && <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-soft">{pt.text}</p>}
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </Section>
  );
}
