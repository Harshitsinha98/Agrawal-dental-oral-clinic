import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import { cn } from "@/lib/utils";
import { SanityImage } from "./sanity-image";
import { imgRatio } from "@/lib/image";
import type { Img } from "@/lib/types";

const components: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = href.startsWith("http");
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  types: {
    // Photos inside an article. The query projects the asset so the size and blur placeholder are known.
    image: ({ value }) => {
      const image = value as NonNullable<Img> & { caption?: string };
      if (!image?.asset?._id) return null;
      return (
        <figure className="not-prose my-8">
          <div className="relative w-full overflow-hidden rounded-3xl bg-mist" style={{ aspectRatio: imgRatio(image, 16 / 10) }}>
            <SanityImage image={image} sizes="(min-width: 768px) 720px, 100vw" />
          </div>
          {image.caption && <figcaption className="mt-2 text-center text-sm text-ink-mute">{image.caption}</figcaption>}
        </figure>
      );
    },
  },
};

export function RichText({ value, className }: { value?: PortableTextBlock[] | null; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={cn("prose-clinic", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
