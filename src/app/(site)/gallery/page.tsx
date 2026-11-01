import type { Metadata } from "next";
import { getGallery } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { BeforeAfterSlider } from "@/components/gallery/before-after";
import { Section, SectionHeading } from "@/components/ui/section";

export async function generateMetadata(): Promise<Metadata> {
  const g = await getGallery();
  return pageMetadata({ title: g.heading || "Gallery", description: g.intro, path: "/gallery", seo: g.seo });
}

export default async function GalleryPage() {
  const g = await getGallery();
  return (
    <>
      <PageHero title={g.heading || "Gallery"} intro={g.intro} crumbs={[{ href: "/gallery", label: "Gallery" }]} />
      <section className="pb-20">
        <div className="container-page">
          <GalleryGrid photos={g.photos} />
        </div>
      </section>
      {g.beforeAfter.length > 0 && (
        <Section tone="white">
          <SectionHeading eyebrow="Results" heading="Before and after" intro="Drag the handle to compare. Shared with each patient's permission; results differ from person to person." />
          <div className="grid gap-8 md:grid-cols-2">
            {g.beforeAfter.map((p) => (
              <BeforeAfterSlider key={p._key} pair={p} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
