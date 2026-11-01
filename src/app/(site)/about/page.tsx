import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { getAbout, getDoctors, getHomepage, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";
import { DoctorProfile } from "@/components/home/doctors";
import { Safety } from "@/components/home/safety";
import { Cta } from "@/components/home/cta";
import { RichText } from "@/components/ui/rich-text";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SanityImage } from "@/components/ui/sanity-image";
import { Section, SectionHeading } from "@/components/ui/section";

export async function generateMetadata(): Promise<Metadata> {
  const a = await getAbout();
  return pageMetadata({ title: "About", description: a.intro, path: "/about", seo: a.seo });
}

export default async function AboutPage() {
  const [about, doctors, home, settings] = await Promise.all([getAbout(), getDoctors(), getHomepage(), getSettings()]);
  const safety = home.sections.find((s) => s._type === "safetySection");

  return (
    <>
      <PageHero title={about.heading} intro={about.intro} crumbs={[{ href: "/about", label: "About" }]} />

      <section className="pb-20">
        <div className="container-page grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-white shadow-soft">
            <SanityImage image={about.image} aspect={5 / 4} sizes="(min-width: 1024px) 50vw, 100vw" priority placeholderIcon="tooth" />
          </Reveal>
          <div>
            <Reveal>
              <RichText value={about.body} />
            </Reveal>
            {!!about.highlights?.length && (
              <Stagger className="mt-10 grid gap-3">
                {about.highlights.map((h, i) => (
                  <StaggerItem key={h._key ?? i} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-mint-500" />
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
          <SectionHeading eyebrow="The team" heading={doctors.length > 1 ? "Our doctors" : "Your dentist"} />
          <div className="space-y-24">
            {doctors.map((d, i) => (
              <DoctorProfile key={d._id ?? d.name} doctor={d} index={i} />
            ))}
          </div>
        </Section>
      )}

      {safety && safety._type === "safetySection" && safety.enabled !== false && (
        <div className="pt-16">
          <Safety heading={safety.heading} intro={safety.intro} steps={safety.steps ?? []} />
        </div>
      )}

      <Cta heading="Come and see the clinic" intro="Send a booking request on WhatsApp and we'll reply with a time that suits you." phone={settings.phone} />
    </>
  );
}
