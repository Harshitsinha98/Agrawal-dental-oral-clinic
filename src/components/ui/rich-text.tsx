import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import { cn } from "@/lib/utils";

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
};

export function RichText({ value, className }: { value?: PortableTextBlock[] | null; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={cn("prose-clinic", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
