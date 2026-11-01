import type { Metadata } from "next";
import { Clock, MapPin } from "lucide-react";
import { getSettings, getTreatments } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";
import { BookingForm } from "@/components/booking/booking-form";
import { OpenStatus } from "@/components/layout/open-status";

export const metadata: Metadata = pageMetadata({
  title: "Book a visit",
  description: "Send a booking request to Agrawal Dental & Oral Care on WhatsApp. Choose a treatment, a day and a time, and the clinic will reply to confirm.",
  path: "/book",
});

export default async function BookPage({ searchParams }: { searchParams: Promise<{ treatment?: string }> }) {
  const [{ treatment }, settings, treatments] = await Promise.all([searchParams, getSettings(), getTreatments()]);
  return (
    <>
      <PageHero title="Book a visit" intro="Fill this in and press Send on WhatsApp. The clinic will reply with a confirmed time, usually within clinic hours." crumbs={[{ href: "/book", label: "Book" }]}>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
          <OpenStatus hours={settings.hours} />
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4 text-brand-500" />
            {settings.address.split(",").slice(0, 2).join(",")}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4 text-brand-500" />
            Takes about a minute
          </span>
        </div>
      </PageHero>
      <section className="pb-24">
        <div className="container-page">
          <BookingForm
            treatments={treatments.map((t) => ({ slug: t.slug, title: t.title }))}
            initialTreatment={treatment}
            whatsapp={settings.whatsapp}
            phone={settings.phone}
            hours={settings.hours}
          />
        </div>
      </section>
    </>
  );
}
