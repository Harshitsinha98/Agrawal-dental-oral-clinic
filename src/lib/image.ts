import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";
import type { Img } from "./types";

const builder = createImageUrlBuilder({ projectId, dataset });

/** True when the image can be rendered (Sanity asset or bundled photo). */
export const hasImg = (image: Img | undefined): image is NonNullable<Img> => Boolean(image?.asset?._id || image?.local?.src);

/** width ÷ height, from Sanity metadata or the bundled photo. */
export function imgRatio(image: Img | undefined, fallback = 1) {
  if (image?.asset?.metadata?.dimensions?.aspectRatio) return image.asset.metadata.dimensions.aspectRatio;
  if (image?.local) return image.local.width / image.local.height;
  return fallback;
}

/** A plain URL for places that can't use next/image, such as a video poster. */
export function imgUrl(image: Img | undefined, width = 800) {
  if (image?.asset?._id) return builder.image(image).width(width).auto("format").url();
  return image?.local?.src;
}
