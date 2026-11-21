import type { Metadata } from "next";
import { getHomepage, getReviews, getSettings } from "@/lib/content";
import * as d from "@/content/defaults";
import { VideoReviews } from "@/components/reviews/video-reviews";
import { photo } from "@/content/photos";
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
  const [r, s, home] = await Promise.all([getReviews(), getSettings(), getHomepage()]);
  const section = home.sections.find((x) => x._type === "videoReviewsSection");
  const fallback = d.defaultHomepage.sections.find((x) => x._type === "videoReviewsSection");
  const videos = section?._type === "videoReviewsSection" && section.videos?.length ? section.videos : fallback?._type === "videoReviewsSection" ? (fallback.videos ?? []) : [];
  return (
    <>
      <PageHero eyebrow="Patient stories" title={r.heading || "Patient reviews"} intro={r.intro} crumbs={[{ href: "/reviews", label: "Reviews" }]} image={photo("dr-kavita-child-patient")} />
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <GoogleRatingCard rating={s.googleRating} count={s.googleReviewCount} url={s.googleReviewsUrl} />
          {videos.length > 0 && (
            <div className="mt-14">
              <h2 className="font-display mb-8 text-3xl font-medium text-ink sm:text-4xl">In their own words</h2>
              <VideoReviews videos={videos} />
            </div>
          )}
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
