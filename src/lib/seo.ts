import type { Metadata } from "next";
import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";
import type { Seo, Settings } from "./types";
import { DAYS } from "./hours";
import { siteUrl } from "./utils";

const builder = createImageUrlBuilder({ projectId, dataset });

export function pageMetadata({ title, description, path, seo }: { title: string; description?: string | null; path: string; seo?: Seo }): Metadata {
  const image = seo?.image?.asset?._id ? builder.image(seo.image).width(1200).height(630).fit("crop").auto("format").url() : undefined;
  const t = seo?.title || title;
  const d = seo?.description || description || undefined;
  return {
    title: t,
    description: d,
    alternates: { canonical: path },
    openGraph: { title: t, description: d, url: path, images: image ? [{ url: image, width: 1200, height: 630 }] : undefined },
  };
}

/** Structured data so Google understands this is a dental clinic, with address and hours. */
export function clinicJsonLd(s: Settings) {
  const dayNames = Object.fromEntries(DAYS.map((d) => [d.key, d.long]));
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: s.clinicName,
    url: siteUrl,
    telephone: s.phone ? `+91${s.phone.replace(/^0/, "")}` : undefined,
    email: s.email ?? undefined,
    address: { "@type": "PostalAddress", streetAddress: s.address, addressLocality: "Bhopal", addressRegion: "Madhya Pradesh", postalCode: "462023", addressCountry: "IN" },
    hasMap: s.mapsUrl ?? undefined,
    openingHoursSpecification: s.hours
      .filter((h) => !h.closed)
      .flatMap((h) => (h.sessions ?? []).map((ses) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: dayNames[h.day], opens: ses.from, closes: ses.to }))),
    sameAs: [s.instagram, s.facebook, s.youtube].filter(Boolean),
  };
}
