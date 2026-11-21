import { Phone } from "lucide-react";
import type { Img } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { SanityImage } from "@/components/ui/sanity-image";
import { Aurora } from "@/components/fx/aurora";
import { BorderBeam } from "@/components/fx/border-beam";
import { hasImg } from "@/lib/image";
import { formatPhone, telHref } from "@/lib/utils";

export function Cta({ heading, intro, buttonLabel, phone, image }: { heading?: string | null; intro?: string | null; buttonLabel?: string | null; phone?: string | null; image?: Img }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <Reveal className="relative isolate overflow-hidden rounded-[2.5rem] bg-brand-950 px-7 py-16 text-white sm:px-14 sm:py-24">
          <Aurora className="-z-20" />
          {hasImg(image) && (
            <div aria-hidden className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 lg:block">
              <SanityImage image={image} sizes="50vw" className="opacity-55" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/60 to-transparent" />
            </div>
          )}
          <BorderBeam radius={40} duration={9} />
          <div className="relative max-w-2xl">
            <p className="eyebrow mb-5 text-gold-300">
              <span className="h-px w-8 bg-gold-300/60" />
              Book a visit
            </p>
            {heading && <h2 className="font-display text-4xl font-medium leading-[1.05] sm:text-6xl">{heading}</h2>}
            {intro && <p className="mt-6 text-lg leading-relaxed text-white/75">{intro}</p>}
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/book" variant="gold" size="lg" magnetic>
                {buttonLabel || "Book on WhatsApp"}
              </Button>
              {phone && (
                <Button href={telHref(phone)!} variant="glass" size="lg" icon={<Phone className="size-4 text-gold-300" />}>
                  {formatPhone(phone)}
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
