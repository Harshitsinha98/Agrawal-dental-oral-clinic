import type { Metadata } from "next";
import { getTreatments } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";
import { TreatmentCard } from "@/components/treatments/treatment-card";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Cta } from "@/components/home/cta";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Treatments",
  description: "Dental implants, gum treatment, root canals, crowns and bridges, dentures, children's dentistry and more at Agrawal Dental & Oral Care, Bhopal.",
  path: "/treatments",
});

export default async function TreatmentsPage() {
  const [treatments, settings] = await Promise.all([getTreatments(), getSettings()]);
  return (
    <>
      <PageHero
        title="Treatments"
        intro="What each treatment involves, how many visits it takes and how to look after your teeth afterwards. If you're not sure which one you need, a check-up is the place to start."
      />
      <section className="pb-8">
        <Stagger className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((t) => (
            <StaggerItem key={t.slug}>
              <TreatmentCard t={t} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <Cta heading="Not sure which treatment you need?" intro="Describe the problem in a line or two on the booking form. The doctor will look at it at your check-up and explain the options." phone={settings.phone} />
    </>
  );
}
