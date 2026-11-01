import type { Metadata } from "next";
import { getDoctors, getFaqs, getGallery, getHomepage, getReviews, getSettings, getTreatments } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { Section as SectionData } from "@/lib/types";
import { Hero } from "@/components/home/hero";
import { Concerns } from "@/components/home/concerns";
import { Stats } from "@/components/home/stats";
import { DoctorProfile } from "@/components/home/doctors";
import { ClinicPhotos } from "@/components/home/clinic-photos";
import { Safety } from "@/components/home/safety";
import { Visit } from "@/components/home/visit";
import { Cta } from "@/components/home/cta";
import { TreatmentCard } from "@/components/treatments/treatment-card";
import { BeforeAfterSlider } from "@/components/gallery/before-after";
import { GoogleRatingCard, ReviewMarquee } from "@/components/reviews/reviews";
import { Section, SectionHeading } from "@/components/ui/section";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { Faq } from "@/components/ui/faq";

export async function generateMetadata(): Promise<Metadata> {
  const [home, s] = await Promise.all([getHomepage(), getSettings()]);
  return { ...pageMetadata({ title: s.seo?.title || s.clinicName, description: s.seo?.description, path: "/", seo: home.seo }), title: { absolute: home.seo?.title || s.seo?.title || s.clinicName } };
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
            <SectionHeading eyebrow="What we treat" heading={section.heading} intro={section.intro} action={<Button href="/treatments" variant="outline">All treatments</Button>} />
            <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
              <StaggerItem className="md:col-span-2 lg:row-span-2">
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
          <Section key={section._key} tone="white">
            <SectionHeading eyebrow="Meet the doctor" heading={section.heading} intro={section.intro} />
            <div className="space-y-24">
              {doctors.map((d, i) => (
                <DoctorProfile key={d._id ?? d.name} doctor={d} index={i} />
              ))}
            </div>
          </Section>
        );

      case "clinicSection": {
        const photos = section.photos?.length ? section.photos : gallery.photos.filter((p) => !p.category || p.category === "clinic");
        return (
          <Section key={section._key}>
            <SectionHeading eyebrow="The clinic" heading={section.heading} intro={section.intro} action={<Button href="/gallery" variant="outline">Open gallery</Button>} />
            <ClinicPhotos photos={photos} />
          </Section>
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
        if (!reviews.items.length && !settings.googleRating) return null;
        return (
          <Section key={section._key} tone="white" className="overflow-hidden">
            <SectionHeading eyebrow="Reviews" heading={section.heading} intro={section.intro} align="center" />
            {reviews.items.length > 0 && <ReviewMarquee reviews={reviews.items} />}
            <div className="mx-auto mt-10 max-w-3xl">
              <GoogleRatingCard rating={settings.googleRating} count={settings.googleReviewCount} url={settings.googleReviewsUrl} />
            </div>
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
        return <Cta key={section._key} heading={section.heading} intro={section.intro} buttonLabel={section.buttonLabel} phone={settings.phone} />;

      default:
        return null;
    }
  };

  return (
    <>
      <Hero hero={home.hero} hours={settings.hours} phone={settings.phone} rating={settings.googleRating} reviewCount={settings.googleReviewCount} reviewsUrl={settings.googleReviewsUrl} />
      {home.sections.map(render)}
    </>
  );
}
