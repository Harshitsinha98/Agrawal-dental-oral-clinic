"use client";

/**
 * Floating header. Transparent with white text over the dark page tops, becomes a
 * frosted white pill once you scroll.
 * The active page is marked with a sliding pill (shared layout animation).
 * On phones the menu opens as a full sheet with links that stagger in.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatPhone, telHref } from "@/lib/utils";
import type { Img } from "@/lib/types";
import { NAV } from "@/lib/nav";
import { Logo } from "./logo";

export function Header({ name, logo, phone }: { name: string; logo?: Img; phone?: string | null }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const dark = !scrolled && !open;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
        <div
          className={cn(
            "mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 rounded-full px-3 pl-4 transition-all duration-500 ease-out-soft sm:pl-5",
            dark ? "border border-transparent" : "border border-white/70 bg-white/85 shadow-soft backdrop-blur-xl",
          )}
        >
          <Link href="/" aria-label={`${name}, home`} className="shrink-0">
            <Logo logo={logo} name={name} invert={dark} />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn("relative rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors", isActive(item.href) ? (dark ? "text-white" : "text-brand-800") : dark ? "text-white/70 hover:text-white" : "text-ink-soft hover:text-ink")}
                  >
                    {isActive(item.href) && <motion.span layoutId="nav-pill" className={cn("absolute inset-0 -z-10 rounded-full", dark ? "bg-white/10 ring-1 ring-white/15" : "bg-gold-50 ring-1 ring-gold-200")} transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {phone && (
              <a href={telHref(phone)} className={cn("hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors xl:flex", dark ? "text-white/80 hover:text-white" : "text-ink-soft hover:text-brand-700")}>
                <Phone className={cn("size-4", dark ? "text-gold-300" : "text-gold-500")} />
                {formatPhone(phone)}
              </a>
            )}
            <Button href="/book" size="md" variant={dark ? "gold" : "primary"} className="hidden sm:inline-flex" magnetic>
              Book a visit
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn("grid size-11 place-items-center rounded-full lg:hidden", dark ? "glass text-white" : "bg-white text-ink shadow-soft")}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={open ? "x" : "m"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  {open ? <X className="size-5" /> : <Menu className="size-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-canvas/95 pt-24 backdrop-blur-xl lg:hidden"
          >
            <motion.nav aria-label="Mobile" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }} className="container-page">
              <ul className="divide-y divide-line">
                {NAV.map((item) => (
                  <motion.li key={item.href} variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}>
                    <Link href={item.href} className={cn("font-display flex items-center justify-between py-4 text-3xl font-medium", isActive(item.href) ? "text-gold-600" : "text-ink")}>
                      {item.label}
                      {isActive(item.href) && <span className="size-2 rounded-full bg-gold-400" />}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="mt-8 grid gap-3">
                <Button href="/book" size="lg">
                  Book a visit
                </Button>
                {phone && (
                  <Button href={telHref(phone)!} variant="outline" size="lg" icon={<Phone className="size-4" />}>
                    Call {formatPhone(phone)}
                  </Button>
                )}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
