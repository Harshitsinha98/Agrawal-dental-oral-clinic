import { ArrowUpRight, Quote, Star } from "lucide-react";
import type { Review } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("flex text-amber-400", className)} role="img" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="size-4" fill={i < Math.round(value) ? "currentColor" : "none"} aria-hidden />
      ))}
    </span>
  );
}

export function ReviewCard({ review, className }: { review: Review; className?: string }) {
  return (
    <figure className={cn("flex h-full flex-col rounded-[1.75rem] border border-line bg-white p-6 shadow-soft", className)}>
      <div className="flex items-center justify-between">
        <Stars value={review.rating} />
        <Quote className="size-6 text-brand-100" aria-hidden />
      </div>
      <blockquote className="mt-4 flex-1 leading-relaxed text-ink-soft">“{review.text}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <span className="grid size-10 place-items-center rounded-full bg-brand-50 font-bold text-brand-700" aria-hidden>
          {review.name.trim().charAt(0).toUpperCase()}
        </span>
        <span className="text-sm">
          <span className="block font-semibold text-ink">{review.name}</span>
          <span className="text-ink-mute">{[review.treatment, review.when].filter(Boolean).join(" · ")}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Two rows of reviews drifting in opposite directions. Pauses on hover. */
export function ReviewMarquee({ reviews }: { reviews: Review[] }) {
  const half = Math.ceil(reviews.length / 2);
  const rows = reviews.length > 5 ? [reviews.slice(0, half), reviews.slice(half)] : [reviews];
  return (
    <div className="space-y-4 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      {rows.map((row, r) => (
        <div key={r} className="group flex overflow-hidden" style={{ ["--marquee-gap" as string]: "1rem", ["--marquee-duration" as string]: `${Math.max(30, row.length * 9)}s` }}>
          <div className={cn("flex w-max shrink-0 gap-4 animate-marquee group-hover:[animation-play-state:paused]", r === 1 && "[animation-direction:reverse]")}>
            {[...row, ...row].map((review, i) => (
              <ReviewCard key={`${review._key}-${i}`} review={review} className="w-[320px] sm:w-[380px]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function GoogleRatingCard({ rating, count, url }: { rating?: number | null; count?: number | null; url?: string | null }) {
  if (!rating) return null;
  return (
    <div className="flex flex-col items-start gap-5 rounded-[2rem] border border-line bg-white p-7 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-5">
        <p className="text-5xl font-extrabold tracking-tight text-ink">{rating.toFixed(1)}</p>
        <div>
          <Stars value={rating} />
          <p className="mt-1 text-sm text-ink-soft">{count ? `${count} reviews on Google` : "Rating on Google"}</p>
        </div>
      </div>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-800">
          Read reviews on Google
          <ArrowUpRight className="size-4" />
        </a>
      )}
    </div>
  );
}
