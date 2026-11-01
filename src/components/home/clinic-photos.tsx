import type { Img } from "@/lib/types";
import { SanityImage } from "@/components/ui/sanity-image";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

const layout = ["col-span-2 row-span-2", "", "", "col-span-2 sm:col-span-1", "hidden sm:block"];
const icons = ["tooth", "checkup", "sealed", "cleaning", "hygiene"];

/** A five-photo mosaic. Empty slots show a soft tile until photos are uploaded. */
export function ClinicPhotos({ photos }: { photos: Img[] }) {
  const slots = Array.from({ length: 5 }, (_, i) => photos[i] ?? null);
  return (
    <Stagger className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:grid-cols-4 sm:gap-4">
      {slots.map((p, i) => (
        <StaggerItem key={p?._key ?? i} className={cn("group relative overflow-hidden rounded-3xl bg-white", layout[i])}>
          <SanityImage image={p} sizes={i === 0 ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 25vw, 50vw"} placeholderIcon={icons[i]} className="transition-transform duration-700 ease-out-soft group-hover:scale-105" />
          {p?.caption && <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">{p.caption}</span>}
        </StaggerItem>
      ))}
    </Stagger>
  );
}
