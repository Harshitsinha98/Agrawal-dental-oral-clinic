import type { MetadataRoute } from "next";
import { getTreatments } from "@/lib/content";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/treatments", "/about", "/gallery", "/reviews", "/contact", "/book"];
  const treatments = await getTreatments();
  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...treatments.map((t) => ({ url: `${siteUrl}/treatments/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
