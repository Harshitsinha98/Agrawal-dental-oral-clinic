import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import type { Img } from "@/lib/types";
import { Reveal } from "@/components/ui/motion";
import { SanityImage } from "@/components/ui/sanity-image";
import { Aurora } from "@/components/fx/aurora";
import { hasImg } from "@/lib/image";
import { cn } from "@/lib/utils";

/** Top of every inner page: breadcrumb, serif heading and intro on the dark aurora, optionally over a photo. */
export function PageHero({
  title,
  intro,
  crumbs = [],
  children,
  className,
  image,
  eyebrow,
}: {
  title: string;
  intro?: string | null;
  crumbs?: { href: string; label: string }[];
  children?: ReactNode;
  className?: string;
  image?: Img;
  eyebrow?: string | null;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-brand-950 pb-16 pt-36 text-white sm:pb-24 sm:pt-44", className)}>
      <Aurora className="-z-20" />
      {hasImg(image) && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <SanityImage image={image} sizes="100vw" priority className="opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/80 to-brand-950/30" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-950 to-transparent" />
        </div>
      )}
      <div className="container-page relative">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/55">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.href} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3.5 text-gold-300/70" aria-hidden />
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          {eyebrow && (
            <p className="eyebrow mb-4 text-gold-300">
              <span className="h-px w-8 bg-gold-300/60" />
              {eyebrow}
            </p>
          )}
          <h1 className="font-display max-w-4xl text-[2.6rem] font-medium leading-[1.04] sm:text-6xl lg:text-7xl">{title}</h1>
          {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">{intro}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
