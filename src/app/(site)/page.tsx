import type { Metadata } from "next";
import { getDoctors, getFaqs, getGallery, getHomepage, getReviews, getSettings, getTreatments } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { Section as SectionData } from "@/lib/types";
import * as d from "@/content/defaults";
import { photo } from "@/content/photos";
import { Hero } from "@/components/home/hero";
import { Concerns } from "@/components/home/concerns";
import { Stats } from "@/components/home/stats";
import { DoctorCards } from "@/components/home/doctors";
import { ClinicTour } from "@/components/home/clinic-photos";
import { Safety } from "@/components/home/safety";
import { Awards } from "@/components/home/awards";
import { Community } from "@/components/home/community";
import { Visit } from "@/components/home/visit";
import { Cta } from "@/components/home/cta";
import { TreatmentCard } from "@/components/treatments/treatment-card";
import { BeforeAfterSlider } from "@/components/gallery/before-after";
import { GoogleRatingCard, ReviewMarquee } from "@/components/reviews/reviews";
import { VideoReviews } from "@/components/reviews/video-reviews";
import { Section, SectionHeading } from "@/components/ui/section";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { Faq } from "@/components/ui/faq";
import { TextReveal } from "@/components/fx/text-reveal";
import { hasImg } from "@/lib/image";

export async function generateMetadata(): Promise<Metadata> {
  const [home, s] = await Promise.all([getHomepage(), getSettings()]);
  return { ...pageMetadata({ title: s.seo?.title || s.clinicName, description: s.seo?.description, path: "/", seo: home.seo }), title: { absolute: home.seo?.title || s.seo?.title || s.clinicName } };
}

/** The starting content of a section type, used when a CMS section has no photos or videos yet. */
function defaultSection<T extends SectionData["_type"]>(type: T) {
  return d.defaultHomepage.sections.find((s) => s._type === type) as Extract<SectionData, { _type: T }> | undefined;
}

/** Proper nouns after the first word ("King George's Medical College, Lucknow") are set in gold as you scroll. */
function properNouns(text: string) {
  return text
    .split(/\s+/)
    .filter((w, i, all) => i > 0 && /^[A-Z]/.test(w) && !/[.!?]$/.test(all[i - 1]))
    .map((w) => w.replace(/[^A-Za-z']/g, ""));
}

export default async function HomePage() {
  const [home, settings, treatments, doctors, gallery, reviews, faqs] = await Promise.all([
    getHomepage(),
    getSettings(),
    getTreatments(),
    getDoctors(),
    getGallery(),
    getReviews(),
    getFaqs(),
  ]);

  const hasVideoReviews = home.sections.some((s) => s._type === "videoReviewsSection" && s.enabled !== false);
  const awards = home.sections.find((s) => s._type === "awardsSection");

  // Strip of credentials along the bottom of the hero, taken from the doctors' details.
  const credentials = [
    ...doctors.flatMap((doc) => [doc.role, ...(doc.qualifications?.split("·") ?? [])]),
    ...(awards?._type === "awardsSection" ? (awards.honours ?? []).slice(0, 4) : []),
    settings.googleRating ? `Rated ${settings.googleRating.toFixed(1)}/5 on Google` : null,
  ]
    .map((c) => c?.trim())
    .filter((c, i, all): c is string => Boolean(c) && all.indexOf(c) === i);
  const years = Math.max(0, ...doctors.map((doc) => doc.experienceYears ?? 0)) || null;

  const render = (section: SectionData) => {
    if (section.enabled === false) return null;
    switch (section._type) {
      case "concernsSection":
        return <Concerns key={section._key} heading={section.heading} intro={section.intro} items={section.items ?? []} />;

      case "statsSection": {
        const items = [
          ...(section.showGoogle !== false && settings.googleRating ? [{ key: "rating", value: settings.googleRating, decimals: 1, suffix: "/5", label: "Google rating" }] : []),
          ...(section.showGoogle !== false && settings.googleReviewCount ? [{ key: "count", value: settings.googleReviewCount, suffix: "+", label: "Patient reviews on Google" }] : []),
          ...(section.items ?? []).map((s) => ({ key: s._key, value: s.value, suffix: s.suffix, label: s.label })),
        ];
        return <Stats key={section._key} items={items} />;
      }

      case "treatmentsSection": {
        const list = section.onlyFeatured !== false ? treatments.filter((t) => t.featured) : treatments;
        if (!list.length) return null;
        const [first, ...rest] = list;
        return (
          <Section key={section._key}>
            <SectionHeading eyebrow="What we treat" heading={section.heading} highlight="explained" intro={section.intro} action={<Button href="/treatments" variant="outline">All treatments</Button>} />
            <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <StaggerItem className="md:col-span-2 lg:col-span-1 lg:row-span-2">
                <TreatmentCard t={first} feature />
              </StaggerItem>
              {rest.slice(0, 4).map((t) => (
                <StaggerItem key={t.slug}>
                  <TreatmentCard t={t} />
                </StaggerItem>
              ))}
            </Stagger>
          </Section>
        );
      }

      case "doctorsSection":
        if (!doctors.length) return null;
        return (
          <Section key={section._key} tone="white" className="overflow-hidden">
            <div aria-hidden className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-300 to-transparent" />
            <SectionHeading eyebrow="Meet your doctors" heading={section.heading} highlight="One family clinic." className="mb-8 sm:mb-10" />
            {section.intro && <TextReveal text={section.intro} highlight={properNouns(section.intro)} className="font-display mb-14 max-w-4xl text-2xl leading-snug text-ink sm:mb-20 sm:text-[2.1rem]" />}
            <DoctorCards doctors={doctors} />
          </Section>
        );

      case "clinicSection": {
        const fromGallery = gallery.photos.filter((p) => p.category === "clinic");
        const photos = section.photos?.length ? section.photos : fromGallery.length >= 4 ? fromGallery : (defaultSection("clinicSection")?.photos ?? []);
        return (
          <section key={section._key} className="relative py-20 sm:py-24 lg:py-0">
            <ClinicTour
              photos={photos}
              header={<SectionHeading eyebrow="The clinic" heading={section.heading} highlight="inside" intro={section.intro} action={<Button href="/gallery" variant="outline">Open gallery</Button>} className="mb-10 sm:mb-12" />}
            />
          </section>
        );
      }

      case "videoReviewsSection": {
        const videos = section.videos?.length ? section.videos : (defaultSection("videoReviewsSection")?.videos ?? []);
        if (!videos.length) return null;
        return (
          <Section key={section._key} tone="navy" className="pb-28 sm:pb-36">
            <SectionHeading eyebrow="Patient stories" heading={section.heading} highlight="our patients" intro={section.intro} dark align="center" />
            <VideoReviews videos={videos} />
            {settings.googleRating ? (
              <div className="mx-auto mt-20 max-w-3xl">
                <GoogleRatingCard rating={settings.googleRating} count={settings.googleReviewCount} url={settings.googleReviewsUrl} dark />
              </div>
            ) : null}
          </Section>
        );
      }

      case "awardsSection": {
        const photos = section.photos?.length ? section.photos : (defaultSection("awardsSection")?.photos ?? []);
        return <Awards key={section._key} heading={section.heading} intro={section.intro} honours={section.honours ?? []} photos={photos} />;
      }

      case "communitySection": {
        const def = defaultSection("communitySection");
        return (
          <Community
            key={section._key}
            heading={section.heading}
            intro={section.intro}
            points={section.points ?? []}
            photos={section.photos?.length ? section.photos : (def?.photos ?? [])}
            video={section.video?.url ? section.video : section.photos?.length ? null : def?.video}
          />
        );
      }

      case "safetySection":
        return <Safety key={section._key} heading={section.heading} intro={section.intro} steps={section.steps ?? []} />;

      case "beforeAfterSection":
        if (!gallery.beforeAfter.length) return null;
        return (
          <Section key={section._key}>
            <SectionHeading eyebrow="Results" heading={section.heading} intro={section.intro} />
            <div className="grid gap-8 md:grid-cols-2">
              {gallery.beforeAfter.slice(0, 4).map((p) => (
                <BeforeAfterSlider key={p._key} pair={p} />
              ))}
            </div>
            {section.note && <p className="mt-6 text-sm text-ink-mute">{section.note}</p>}
          </Section>
        );

      case "reviewsSection":
        // With video reviews on the page, the Google card already sits under them.
        if (!reviews.items.length && (hasVideoReviews || !settings.googleRating)) return null;
        return (
          <Section key={section._key} tone="white" className="overflow-hidden">
            <SectionHeading eyebrow="Reviews" heading={section.heading} intro={section.intro} align="center" />
            {reviews.items.length > 0 && <ReviewMarquee reviews={reviews.items} />}
            {!hasVideoReviews && (
              <div className="mx-auto mt-10 max-w-3xl">
                <GoogleRatingCard rating={settings.googleRating} count={settings.googleReviewCount} url={settings.googleReviewsUrl} />
              </div>
            )}
          </Section>
        );

      case "faqSection":
        if (!faqs.items.length) return null;
        return (
          <Section key={section._key}>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <SectionHeading eyebrow="FAQ" heading={section.heading || faqs.heading} intro={section.intro} className="lg:sticky lg:top-28 lg:self-start" />
              <Faq items={faqs.items.slice(0, section.limit ?? 6)} />
            </div>
          </Section>
        );

      case "visitSection":
        return (
          <Section key={section._key} className="pb-8 sm:pb-10">
            <Visit settings={settings} heading={section.heading} />
          </Section>
        );

      case "ctaSection":
        return <Cta key={section._key} heading={section.heading} intro={section.intro} buttonLabel={section.buttonLabel} phone={settings.phone} image={hasImg(home.hero.image) ? home.hero.image : photo("doctors-consultation-desk")} />;

      default:
        return null;
    }
  };

  return (
    <>
      <Hero
        hero={home.hero}
        hours={settings.hours}
        phone={settings.phone}
        rating={settings.googleRating}
        reviewCount={settings.googleReviewCount}
        reviewsUrl={settings.googleReviewsUrl}
        specialities={home.hero.rotatingWords ?? []}
        credentials={credentials}
        years={years}
        doctorCount={doctors.length}
      />
      {home.sections.map(render)}
    </>
  );
}
