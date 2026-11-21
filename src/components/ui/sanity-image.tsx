"use client";

/**
 * A photo from Sanity's image CDN at the right size, cropped to the doctor's chosen
 * focus point (hotspot), or a photo bundled with the site (`image.local`) until the
 * slot is filled in Sanity. Without either it shows a soft tile, so empty slots never
 * look broken. The parent must be `relative` with a size.
 */

import Image from "next/image";
import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";
import type { Img } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DentalIcon } from "./icons";

const builder = createImageUrlBuilder({ projectId, dataset });

type Props = {
  image: Img | undefined;
  alt?: string;
  /** width ÷ height. When set, the CDN crops around the hotspot. */
  aspect?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  placeholderIcon?: string;
  /** CSS object-position for bundled photos, e.g. "50% 20%". */
  position?: string;
};

export function SanityImage({ image, alt, aspect, sizes = "100vw", priority, className, placeholderIcon, position }: Props) {
  if (image?.local?.src && !image.asset?._id) {
    const l = image.local;
    return (
      <Image
        fill
        src={l.src}
        alt={alt ?? image.alt ?? ""}
        sizes={sizes}
        priority={priority}
        placeholder={l.blur ? "blur" : "empty"}
        blurDataURL={l.blur}
        style={{ objectPosition: position ?? "50% 50%" }}
        className={cn("object-cover", className)}
      />
    );
  }

  if (!image?.asset?._id) return <ImagePlaceholder icon={placeholderIcon} />;

  const lqip = image.asset.metadata?.lqip;
  const pos = image.hotspot ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%` : (position ?? "50% 50%");

  return (
    <Image
      fill
      src={image.asset._id}
      alt={alt ?? image.alt ?? ""}
      sizes={sizes}
      priority={priority}
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip}
      style={{ objectPosition: pos }}
      className={cn("object-cover", className)}
      loader={({ width, quality }) => {
        let b = builder.image(image).width(width).quality(quality ?? 78).auto("format");
        if (aspect) b = b.height(Math.round(width / aspect)).fit("crop");
        else b = b.fit("max");
        return b.url();
      }}
    />
  );
}

export function ImagePlaceholder({ icon, className }: { icon?: string; className?: string }) {
  return (
    <div aria-hidden className={cn("absolute inset-0 grid place-items-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-mint-50", className)}>
      <div className="dots absolute inset-0 opacity-60" />
      <DentalIcon name={icon ?? "tooth"} className="relative size-14 text-brand-200" strokeWidth={1.2} />
    </div>
  );
}
