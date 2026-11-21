import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { getAbout, getDoctors, getHomepage, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import * as d from "@/content/defaults";
import { PageHero } from "@/components/layout/page-hero";
import { DoctorProfile } from "@/components/home/doctors";
import { Safety } from "@/components/home/safety";
import { Awards } from "@/components/home/awards";
import { Cta } from "@/components/home/cta";
import { RichText } from "@/components/ui/rich-text";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SanityImage } from "@/components/ui/sanity-image";
import { Section, SectionHeading } from "@/components/ui/section";
import { Timeline } from "@/components/fx/timeline";
import { photo } from "@/content/photos";
import { hasImg } from "@/lib/image";

export async function generateMetadata(): Promise<Metadata> {
  const a = await getAbout();
  return pageMetadata({ title: "About", description: a.intro, path: "/about", seo: a.seo });
}

export default async function AboutPage() {
  const [about, doctors, home, settings] = await Promise.all([getAbout(), getDoctors(), getHomepage(), getSettings()]);
  const safety = home.sections.find((s) => s._type === "safetySection");
  const awards = home.sections.find((s) => s._type === "awardsSection");
  const defaultAwards = d.defaultHomepage.sections.find((s) => s._type === "awardsSection");
  const milestones = about.milestones?.length ? about.milestones : (d.defaultAbout.milestones ?? []);

  return (
    <>
      <PageHero eyebrow="About the clinic" title={about.heading} intro={about.intro} crumbs={[{ href: "/about", label: "About" }]} image={about.image} />

      <section className="py-20 sm:py-28">
        <div className="container-page grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative lg:sticky lg:top-28">
            <div aria-hidden className="absolute -inset-3 rounded-[2.5rem] border border-gold-300/60" />
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-white shadow-lift">
              <SanityImage image={hasImg(home.hero.image) ? home.hero.image : photo("doctors-consultation-desk")} sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow mb-4">
                <span className="h-px w-8 bg-gold-400" />
                Our story
              </p>
              <RichText value={about.body} />
            </Reveal>
            {!!about.highlights?.length && (
              <Stagger className="mt-10 grid gap-3 sm:grid-cols-2">
                {about.highlights.map((h, i) => (
                  <StaggerItem key={h._key ?? i} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold-500" />
                    <div>
                      <h2 className="font-bold text-ink">{h.title}</h2>
                      {h.text && <p className="mt-1 leading-relaxed text-ink-soft">{h.text}</p>}
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        </div>
      </section>

      {doctors.length > 0 && (
        <Section tone="white">
          <SectionHeading eyebrow="The doctors" heading={about.doctorsHeading || (doctors.length > 1 ? "Meet our specialists" : "Your dentist")} highlight="specialists" align="center" />
          <div className="space-y-28">
            {doctors.map((doc, i) => (
              <DoctorProfile key={doc._id ?? doc.name} doctor={doc} index={i} />
            ))}
          </div>
        </Section>
      )}

      {milestones.length > 0 && (
        <Section>
          <SectionHeading eyebrow="Our journey" heading={about.journeyHeading || "Our journey"} highlight="caring" />
          <Timeline items={milestones} />
        </Section>
      )}

      {awards?._type === "awardsSection" && awards.enabled !== false && (
        <Awards
          heading={awards.heading}
          intro={awards.intro}
          honours={awards.honours ?? []}
          photos={awards.photos?.length ? awards.photos : defaultAwards?._type === "awardsSection" ? (defaultAwards.photos ?? []) : []}
        />
      )}

      {safety && safety._type === "safetySection" && safety.enabled !== false && (
        <div className="pt-16">
          <Safety heading={safety.heading} intro={safety.intro} steps={safety.steps ?? []} />
        </div>
      )}

      <Cta heading={about.ctaHeading || "Come and see the clinic"} intro={about.ctaText} phone={settings.phone} image={settings.pageImages?.book} />
    </>
  );
}
