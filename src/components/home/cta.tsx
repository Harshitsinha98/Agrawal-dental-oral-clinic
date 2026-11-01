import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { formatPhone, telHref } from "@/lib/utils";

export function Cta({ heading, intro, buttonLabel, phone }: { heading?: string | null; intro?: string | null; buttonLabel?: string | null; phone?: string | null }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-brand-600 px-7 py-14 text-white sm:px-14 sm:py-20">
          <svg aria-hidden viewBox="0 0 600 300" fill="none" className="absolute -right-24 -top-10 w-[640px] max-w-none text-white/10">
            <path d="M10 40c90 280 490 280 580 0" stroke="currentColor" strokeWidth="2" />
            <path d="M60 46c80 200 400 200 480 0" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 9" />
          </svg>
          <div className="relative max-w-2xl">
            {heading && <h2 className="text-3xl font-bold leading-tight sm:text-5xl">{heading}</h2>}
            {intro && <p className="mt-5 text-lg leading-relaxed text-white/80">{intro}</p>}
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/book" variant="whatsapp" size="lg" magnetic>
                {buttonLabel || "Book on WhatsApp"}
              </Button>
              {phone && (
                <Button href={telHref(phone)!} variant="light" size="lg" icon={<Phone className="size-4" />}>
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
