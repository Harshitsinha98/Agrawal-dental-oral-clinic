import type { Metadata } from "next";
import { getReviews, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";
import { GoogleRatingCard, ReviewCard } from "@/components/reviews/reviews";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Cta } from "@/components/home/cta";

export async function generateMetadata(): Promise<Metadata> {
  const r = await getReviews();
  return pageMetadata({ title: r.heading || "Patient reviews", description: r.intro, path: "/reviews", seo: r.seo });
}

export default async function ReviewsPage() {
  const [r, s] = await Promise.all([getReviews(), getSettings()]);
  return (
    <>
      <PageHero title={r.heading || "Patient reviews"} intro={r.intro} crumbs={[{ href: "/reviews", label: "Reviews" }]} />
      <section className="pb-8">
        <div className="container-page">
          <GoogleRatingCard rating={s.googleRating} count={s.googleReviewCount} url={s.googleReviewsUrl} />
          {r.items.length > 0 && (
            <Stagger className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>div]:mb-4">
              {r.items.map((review) => (
                <StaggerItem key={review._key} className="break-inside-avoid">
                  <ReviewCard review={review} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>
      <Cta heading="Had a visit with us?" intro="A short review on Google helps other families in Bhopal find a dentist they can trust." buttonLabel="Book your next visit" phone={s.phone} />
    </>
  );
}
