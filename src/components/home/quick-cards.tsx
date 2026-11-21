import Link from "next/link";
import { ArrowRight, Navigation, Star } from "lucide-react";
import type { QuickCard, Settings } from "@/lib/types";
import { OpenStatus } from "@/components/layout/open-status";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { GoogleIcon } from "@/components/ui/icons";

/** Three cards under the banner: Google rating, open-now with directions, and a text card with a button. */
export function QuickCards({ items, settings }: { items: QuickCard[]; settings: Settings }) {
  if (!items.length) return null;
  return (
    <section className="pb-6 pt-8 sm:pt-10">
      <Stagger className="container-page grid gap-4 md:grid-cols-3">
        {items.slice(0, 3).map((c, i) => (
          <StaggerItem key={c._key ?? i} className="flex flex-col rounded-[1.5rem] border border-line bg-white p-6 shadow-soft transition-shadow duration-300 hover:shadow-lift">
            {c.kind === "rating" ? <Rating card={c} settings={settings} /> : c.kind === "visit" ? <Visit card={c} settings={settings} /> : <Text card={c} />}
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

const btn = "mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-800";

function Rating({ card, settings: s }: { card: QuickCard; settings: Settings }) {
  if (!s.googleRating) return <Text card={card} />;
  return (
    <>
      <p className="flex items-center gap-2 text-sm font-medium text-ink-soft">
        {card.title || "Rated"} <strong className="text-ink">{s.googleRating.toFixed(1)}/5</strong>
        <span className="flex text-gold-400" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="size-3.5" fill="currentColor" />
          ))}
        </span>
      </p>
      <p className="font-display mt-2 text-3xl text-gold-600">
        {s.googleReviewCount ? `${s.googleReviewCount}+` : s.googleRating.toFixed(1)} <span className="text-xl text-ink">happy reviews</span>
      </p>
      <p className="mb-5 mt-1 flex items-center gap-1.5 text-sm text-ink-mute">
        <GoogleIcon className="size-4" />
        {card.text || "Google verified"}
      </p>
      {s.googleReviewsUrl && (
        <a href={s.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className={btn}>
          {card.buttonLabel || "Read reviews"}
          <ArrowRight className="size-4" />
        </a>
      )}
    </>
  );
}

function Visit({ card, settings: s }: { card: QuickCard; settings: Settings }) {
  return (
    <>
      <p className="font-display text-2xl text-ink">{card.title || "Visit us"}</p>
      {card.text && <p className="mt-1 text-sm text-ink-soft">{card.text}</p>}
      <OpenStatus hours={s.hours} className="mb-5 mt-3" />
      {s.mapsUrl && (
        <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className={btn}>
          <Navigation className="size-4 text-gold-300" />
          {card.buttonLabel || "Get directions"}
        </a>
      )}
    </>
  );
}

function Text({ card }: { card: QuickCard }) {
  return (
    <>
      {card.title && <p className="font-display text-2xl text-ink">{card.title}</p>}
      {card.text && <p className="mb-5 mt-1 text-sm text-ink-soft">{card.text}</p>}
      {card.link && (
        <Link href={card.link} className={btn}>
          {card.buttonLabel || "Read more"}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </>
  );
}
