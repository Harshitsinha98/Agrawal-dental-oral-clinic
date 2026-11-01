/**
 * Line icons drawn for this site (teeth, implant, dentures…), plus brand glyphs
 * that lucide no longer ships. All 24×24, stroke = currentColor.
 */

import type { SVGProps } from "react";
import { Droplets, HandHeart, Package, ShieldCheck, ThermometerSun, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TOOTH =
  "M8 3.5c-2.6 0-4.5 1.9-4.5 4.6 0 1.6.5 2.9 1.1 4.3.6 1.5.9 3.2 1.2 5 .3 1.9.8 3.1 1.9 3.1 1.3 0 1.6-1.5 1.9-3.1.3-1.5.7-3 2.4-3s2.1 1.5 2.4 3c.3 1.6.6 3.1 1.9 3.1 1.1 0 1.6-1.2 1.9-3.1.3-1.8.6-3.5 1.2-5 .6-1.4 1.1-2.7 1.1-4.3 0-2.7-1.9-4.6-4.5-4.6-1.6 0-2.6.8-4 .8s-2.4-.8-4-.8Z";

type P = SVGProps<SVGSVGElement>;

function Svg({ className, children, ...rest }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("size-6", className)} {...rest}>
      {children}
    </svg>
  );
}

const Tooth = ({ t }: { t?: string }) => <path d={TOOTH} transform={t} />;
const Sparkle = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <path d={`M${x} ${y - 2 * s}v${4 * s}M${x - 2 * s} ${y}h${4 * s}`} />
);

const drawn: Record<string, (p: P) => React.ReactElement> = {
  tooth: (p) => (
    <Svg {...p}>
      <Tooth />
    </Svg>
  ),
  pain: (p) => (
    <Svg {...p}>
      <Tooth t="translate(-1.5 2) scale(0.85)" />
      <path d="M20.5 1.5 18.6 4.6h2.6l-1.9 3.1" />
    </Svg>
  ),
  implant: (p) => (
    <Svg {...p}>
      <path d="M6.5 2.5h11a2 2 0 0 1 2 2v.5a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-.5a2 2 0 0 1 2-2Z" />
      <path d="M10 8v2h4V8" />
      <path d="M8.6 10h6.8l-.9 10.2a1 1 0 0 1-1 .8h-3a1 1 0 0 1-1-.8Z" />
      <path d="M8.4 13h7.2M8.7 16h6.6M9 19h6" />
    </Svg>
  ),
  gums: (p) => (
    <Svg {...p}>
      <Tooth />
      <path d="M2 11.5c1.7 1.4 3.3 1.4 5 0s3.3-1.4 5 0 3.3 1.4 5 0 3.3-1.4 5 0" />
    </Svg>
  ),
  rootCanal: (p) => (
    <Svg {...p}>
      <Tooth />
      <path d="M9.5 8.5h5M10 9.5l-.9 6.5M14 9.5l.9 6.5" />
    </Svg>
  ),
  crown: (p) => (
    <Svg {...p}>
      <Tooth t="translate(1.8 3.2) scale(0.85)" />
      <path d="m5 5.5 2.4-3 2.3 2 2.3-2.5 2.3 2.5 2.3-2 2.4 3" />
    </Svg>
  ),
  denture: (p) => (
    <Svg {...p}>
      <path d="M3 7.5c0 7 4 11 9 11s9-4 9-11" />
      <path d="M6.5 9c.4 4.5 2.6 6.5 5.5 6.5s5.1-2 5.5-6.5" />
      <path d="M5.4 12.6 7.8 11.6M8 15.6l1.7-1.8M12 16.6v-1.3M16 15.6l-1.7-1.8M18.6 12.6l-2.4-1" />
    </Svg>
  ),
  child: (p) => (
    <Svg {...p}>
      <Tooth t="translate(1 4) scale(0.75)" />
      <path d="m18.5 1.8.7 1.6 1.7.2-1.3 1.1.4 1.7-1.5-.9-1.5.9.4-1.7-1.3-1.1 1.7-.2Z" />
    </Svg>
  ),
  cleaning: (p) => (
    <Svg {...p}>
      <Tooth t="translate(-1 2.4) scale(0.85)" />
      <Sparkle x={19.5} y={4} s={1.1} />
    </Svg>
  ),
  whitening: (p) => (
    <Svg {...p}>
      <Tooth t="translate(1.8 3) scale(0.85)" />
      <Sparkle x={4} y={4} s={1} />
      <Sparkle x={20} y={3} s={0.8} />
    </Svg>
  ),
  extraction: (p) => (
    <Svg {...p}>
      <Tooth t="translate(2.4 5.4) scale(0.8)" />
      <path d="M12 6V1.5M9.8 3.6 12 1.4l2.2 2.2" />
    </Svg>
  ),
  filling: (p) => (
    <Svg {...p}>
      <Tooth />
      <circle cx="12" cy="9.4" r="2" fill="currentColor" stroke="none" />
    </Svg>
  ),
  braces: (p) => (
    <Svg {...p}>
      <Tooth />
      <rect x="9.5" y="7.6" width="5" height="4" rx="1" />
      <path d="M2.5 9.6h7M14.5 9.6h7" />
    </Svg>
  ),
  mouth: (p) => (
    <Svg {...p}>
      <path d="M2.5 12c2.6-3 5-4.6 7-4.6 1.1 0 1.5.7 2.5.7s1.4-.7 2.5-.7c2 0 4.4 1.6 7 4.6-2.6 3.4-5.6 5-9.5 5S5.1 15.4 2.5 12Z" />
      <path d="M2.5 12c3 .9 6.2 1.3 9.5 1.3s6.5-.4 9.5-1.3" />
    </Svg>
  ),
  checkup: (p) => (
    <Svg {...p}>
      <circle cx="15.5" cy="8.5" r="4.5" />
      <path d="M12.3 11.7 3.5 20.5" />
      <path d="M14 6.5a2.3 2.3 0 0 1 2-.6" />
    </Svg>
  ),
};

const lucide: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  steam: ThermometerSun,
  hygiene: HandHeart,
  sealed: Package,
  water: Droplets,
};

export function DentalIcon({ name, className, ...rest }: { name?: string | null } & Omit<P, "name">) {
  const key = name ?? "tooth";
  const L = lucide[key];
  if (L) return <L className={cn("size-6", className)} strokeWidth={1.6} aria-hidden />;
  const Draw = drawn[key] ?? drawn.tooth;
  return <Draw className={className} {...rest} />;
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-5", className)}>
      <path fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round" d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z" />
      <path
        fill="currentColor"
        d="M8.6 7.9c.2-.4.5-.5.8-.5h.6c.2 0 .4.1.5.4l.8 1.9c.1.2 0 .5-.1.7l-.6.7c-.1.1-.1.3 0 .5.6 1 1.4 1.8 2.5 2.4.2.1.4.1.5-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.3.4.5v.6c0 .4-.2.8-.6 1-1 .5-2.2.5-3.2.1a9.4 9.4 0 0 1-4.5-4.4c-.6-1.2-.7-2.5-.2-3.8Z"
      />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <Svg className={cn("size-5", className)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
    </Svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <Svg className={cn("size-5", className)}>
      <path d="M14.5 21v-7.5H17l.4-3.2h-2.9V8.6c0-.9.3-1.6 1.6-1.6h1.4V4.2a17 17 0 0 0-2.1-.2c-2.1 0-3.6 1.3-3.6 3.7v2.6H9.5v3.2h2.3V21" />
    </Svg>
  );
}

export function YouTubeIcon({ className }: { className?: string }) {
  return (
    <Svg className={cn("size-5", className)}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10.5 9.5 4 2.5-4 2.5Z" fill="currentColor" />
    </Svg>
  );
}
