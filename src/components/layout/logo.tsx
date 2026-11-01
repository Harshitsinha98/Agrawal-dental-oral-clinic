import Image from "next/image";
import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";
import type { Img } from "@/lib/types";
import { cn } from "@/lib/utils";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Logo from Sanity if uploaded, otherwise a typeset wordmark with the red tooth mark from the clinic's sign. */
export function Logo({ logo, name, className, invert = false }: { logo?: Img; name: string; className?: string; invert?: boolean }) {
  if (logo?.asset?._id) {
    const ratio = logo.asset.metadata?.dimensions?.aspectRatio ?? 3;
    const h = 44;
    return (
      <Image
        src={builder.image(logo).height(h * 2).fit("max").auto("format").url()}
        alt={name}
        width={Math.round(h * ratio)}
        height={h}
        unoptimized
        className={cn("h-10 w-auto", invert && "brightness-0 invert", className)}
      />
    );
  }

  const [first, ...rest] = name.split(" ");
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 32 32" aria-hidden className="size-9 shrink-0">
        <rect width="32" height="32" rx="10" className={invert ? "fill-white/10" : "fill-brand-50"} />
        <path
          d="M11.2 7.5c-2.8 0-4.7 2-4.7 4.9 0 1.7.5 3 1.1 4.5.7 1.6 1 3.4 1.3 5.3.3 2 .9 3.3 2 3.3 1.4 0 1.7-1.6 2-3.3.3-1.6.8-3.2 3.1-3.2s2.8 1.6 3.1 3.2c.3 1.7.6 3.3 2 3.3 1.1 0 1.7-1.3 2-3.3.3-1.9.6-3.7 1.3-5.3.6-1.5 1.1-2.8 1.1-4.5 0-2.9-1.9-4.9-4.7-4.9-1.8 0-2.9.9-4.8.9s-3-.9-4.8-.9Z"
          className="fill-logo-red"
        />
        <path d="M11 12.2c.6-1.3 1.6-1.9 2.8-1.9" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </svg>
      <span className="leading-none">
        <span className={cn("block text-[1.15rem] font-extrabold tracking-tight", invert ? "text-white" : "text-ink")}>{first}</span>
        <span className={cn("mt-1 block text-[0.7rem] font-semibold tracking-wide", invert ? "text-white/70" : "text-ink-mute")}>{rest.join(" ")}</span>
      </span>
    </span>
  );
}
