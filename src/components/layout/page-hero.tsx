import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

/** Top of every inner page: breadcrumb, heading and intro on a pale wash. */
export function PageHero({
  title,
  intro,
  crumbs = [],
  children,
  className,
}: {
  title: string;
  intro?: string | null;
  crumbs?: { href: string; label: string }[];
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-gradient-to-b from-brand-50 to-canvas pb-14 pt-32 sm:pb-20 sm:pt-40", className)}>
      <svg aria-hidden viewBox="0 0 800 400" fill="none" className="pointer-events-none absolute -right-48 -top-10 w-[820px] max-w-none text-brand-100">
        <path d="M20 60c120 300 640 300 760 0" stroke="currentColor" strokeWidth="2" />
      </svg>
      <div className="container-page relative">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-mute">
              <li>
                <Link href="/" className="hover:text-brand-700">
                  Home
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.href} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3.5" aria-hidden />
                  <Link href={c.href} className="hover:text-brand-700">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-[-0.025em] text-ink sm:text-6xl">{title}</h1>
          {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">{intro}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
