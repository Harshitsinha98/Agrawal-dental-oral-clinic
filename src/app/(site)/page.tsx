import type { Metadata } from "next";
import { getDoctors, getFaqs, getGallery, getHomepage, getPosts, getReviews, getSettings, getTreatments } from "@/lib/content";
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
import { QuickCards } from "@/components/home/quick-cards";
import { WhyTrust } from "@/components/home/why-trust";
import { QuickBooking } from "@/components/home/quick-booking";
import { LinkTiles } from "@/components/home/link-tiles";
import { BlogSection } from "@/components/home/blog-section";
import { TreatmentTiles } from "@/components/treatments/treatment-tiles";
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
import { hasImg } from "@/lib/image";

export async function generateMetadata(): Promise<Metadata> {
  const [home, s] = await Promise.all([getHomepage(), getSettings()]);
  return { ...pageMetadata({ title: s.seo?.title || s.clinicName, description: s.seo?.description, path: "/", seo: home.seo }), title: { absolute: home.seo?.title || s.seo?.title || s.clinicName } };
}

/** The starting content of a section type, used when a CMS section has no photos or videos yet. */
function defaultSection<T extends SectionData["_type"]>(type: T) {
  return d.defaultHomepage.sections.find((s) => s._type === type) as Extract<SectionData, { _type: T }> | undefined;
}

export default async function HomePage() {
  const [home, settings, treatments, doctors, gallery, reviews, faqs, posts] = await Promise.all([
    getHomepage(),
    getSettings(),
    getTreatments(),
    getDoctors(),
    getGallery(),
    getReviews(),
    getFaqs(),
    getPosts(),
  ]);

  const hasVideoReviews = home.sections.some((s) => s._type === "videoReviewsSection" && s.enabled !== false);

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
        const action = <Button href="/treatments" variant="outline">{section.buttonLabel || "All treatments"}</Button>;
        if (section.layout !== "cards") {
          return (
            <Section key={section._key} tone="mist">
              <SectionHeading eyebrow="What we treat" heading={section.heading} intro={section.intro} align="center" />
              <TreatmentTiles treatments={list} />
              <div className="mt-10 flex justify-center">{action}</div>
            </Section>
          );
        }
        const [first, ...rest] = list;
        return (
          <Section key={section._key}>
            <SectionHeading eyebrow="What we treat" heading={section.heading} highlight="explained" intro={section.intro} action={action} />
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
            <SectionHeading eyebrow="Our doctors" heading={section.heading} highlight="specialists" intro={section.intro} align="center" />
            {!!section.points?.length && (
              <Stagger className="mb-10 grid gap-4 sm:grid-cols-3">
                {section.points.map((p, i) => (
                  <StaggerItem key={p._key ?? i} className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
                    <span className="font-display shrink-0 text-3xl text-gold-600">{p.value}</span>
                    <span>
                      <span className="block font-bold text-ink">{p.title}</span>
                      {p.text && <span className="mt-0.5 block text-sm leading-snug text-ink-soft">{p.text}</span>}
                    </span>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
            <DoctorCards doctors={doctors} />
            {section.buttonLabel && (
              <div className="mt-10 flex justify-center">
                <Button href="/about">{section.buttonLabel}</Button>
              </div>
            )}
          </Section>
        );

      case "quickCardsSection":
        return <QuickCards key={section._key} items={section.items ?? defaultSection("quickCardsSection")?.items ?? []} settings={settings} />;

      case "whyTrustSection": {
        const def = defaultSection("whyTrustSection");
        return <WhyTrust key={section._key} heading={section.heading} intro={section.intro} image={hasImg(section.image) ? section.image : def?.image} boxes={section.boxes?.length ? section.boxes : (def?.boxes ?? [])} />;
      }

      case "bookingStripSection":
        return (
          <section key={section._key} className="py-6 sm:py-8">
            <div className="container-page">
              <QuickBooking heading={section.heading} intro={section.intro} buttonLabel={section.buttonLabel} whatsapp={settings.whatsapp} options={treatments.map((t) => ({ slug: t.slug, title: t.title }))} />
            </div>
          </section>
        );

      case "moreLinksSection":
        return <LinkTiles key={section._key} heading={section.heading} intro={section.intro} items={section.items?.length ? section.items : (defaultSection("moreLinksSection")?.items ?? [])} />;

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
          <Section key={section._key} className="pb-24 sm:pb-32">
            <SectionHeading eyebrow="Patient stories" heading={section.heading} intro={section.intro} align="center" />
            <VideoReviews videos={videos} />
            {settings.googleRating ? (
              <div className="mx-auto mt-16 max-w-3xl">
                <GoogleRatingCard rating={settings.googleRating} count={settings.googleReviewCount} url={settings.googleReviewsUrl} />
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
            form={{ heading: section.formHeading ?? (section.photos?.length ? null : def?.formHeading), text: section.formText ?? def?.formText, buttonLabel: section.buttonLabel ?? def?.buttonLabel, whatsapp: settings.whatsapp }}
          />
        );
      }

      case "safetySection":
        return <Safety key={section._key} heading={section.heading} intro={section.intro} steps={section.steps ?? []} />;

      case "beforeAfterSection":
        if (!gallery.beforeAfter.length) return null;
        return (
          <Section key={section._key}>
            <SectionHeading eyebrow="Before & after" heading={section.heading} highlight="transformed" intro={section.intro} align="center" />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {gallery.beforeAfter.slice(0, 6).map((p) => (
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

      case "blogSection":
        return <BlogSection key={section._key} heading={section.heading} intro={section.intro} posts={posts.slice(0, section.count ?? 3)} buttonLabel={section.buttonLabel} />;

      case "faqSection": {
        if (!faqs.items.length) return null;
        const list = faqs.items.slice(0, section.limit ?? 8);
        const half = Math.ceil(list.length / 2);
        return (
          <Section key={section._key}>
            <SectionHeading eyebrow="FAQ" heading={section.heading || faqs.heading} intro={section.intro} align="center" />
            <div className="grid items-start gap-4 lg:grid-cols-2">
              <Faq items={list.slice(0, half)} />
              {list.length > 1 && <Faq items={list.slice(half)} initialOpen={null} />}
            </div>
          </Section>
        );
      }

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
      <Hero hero={home.hero} hours={settings.hours} phone={settings.phone} rating={settings.googleRating} reviewCount={settings.googleReviewCount} />
      {home.sections.map(render)}
    </>
  );
}
