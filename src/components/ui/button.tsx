"use client";

/**
 * Buttons. Two touches borrowed in spirit from React Bits: a magnetic pull towards
 * the cursor (desktop only) and a light sweep across the primary buttons on hover.
 * The arrow chip slides on hover. Everything is off with "reduce motion".
 */

import Link from "next/link";
import { useRef, type ComponentProps, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./icons";

type Variant = "primary" | "whatsapp" | "outline" | "light" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative isolate inline-flex select-none items-center justify-center gap-2.5 overflow-hidden rounded-full font-semibold transition-[background-color,color,box-shadow,border-color] duration-300 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-[0_8px_20px_-8px_rgb(30_90_168/0.7)] hover:bg-brand-700",
  whatsapp: "bg-whatsapp text-[#05391f] shadow-[0_8px_20px_-8px_rgb(18_140_126/0.7)] hover:bg-[#2fe072]",
  outline: "border border-line bg-white text-ink hover:border-brand-300 hover:text-brand-700",
  light: "bg-white text-brand-700 hover:bg-brand-50",
  ghost: "text-brand-700 hover:bg-brand-50",
};

const sizes: Record<Size, string> = {
  md: "h-11 pl-5 pr-5 text-[0.9375rem]",
  lg: "h-14 pl-7 pr-7 text-base",
};

type Common = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  /** Arrow chip at the end. Defaults on for primary. */
  arrow?: boolean;
  /** WhatsApp glyph at the start. Defaults on for the whatsapp variant. */
  wa?: boolean;
  icon?: ReactNode;
  magnetic?: boolean;
};

type AsLink = Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", children, className, arrow, wa, icon, magnetic = false, ...rest } = props;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.3 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.3 });

  const pull = magnetic && !reduce;
  const onMove = (e: React.PointerEvent) => {
    if (!pull || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const showArrow = arrow ?? variant === "primary";
  const showWa = wa ?? variant === "whatsapp";
  const shines = variant === "primary" || variant === "whatsapp";

  const inner = (
    <>
      {shines && (
        <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/3 -z-10 w-1/3 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/35 to-transparent group-hover/btn:animate-shine" />
      )}
      {showWa && <WhatsAppIcon className="size-5" />}
      {icon}
      <span>{children}</span>
      {showArrow && (
        <span aria-hidden className={cn("-mr-2 grid size-7 place-items-center rounded-full transition-transform duration-300 ease-out-soft group-hover/btn:translate-x-1", variant === "primary" ? "bg-white/15" : "bg-brand-50")}>
          <ArrowRight className="size-4" strokeWidth={2.2} />
        </span>
      )}
    </>
  );

  const cls = cn(base, variants[variant], sizes[size], className);

  let el: ReactNode;
  if ("href" in rest && rest.href !== undefined) {
    const { href, external, ...anchor } = rest as AsLink;
    const isExternal = external ?? /^(https?:|tel:|mailto:)/.test(href);
    el = isExternal ? (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...anchor}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={cls} {...anchor}>
        {inner}
      </Link>
    );
  } else {
    const { type = "button", ...button } = rest as AsButton;
    el = (
      <button type={type} className={cls} {...button}>
        {inner}
      </button>
    );
  }

  if (!pull) return el;
  return (
    <motion.span ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className="inline-flex">
      {el}
    </motion.span>
  );
}
