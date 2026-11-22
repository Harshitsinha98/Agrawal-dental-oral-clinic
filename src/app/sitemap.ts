import type { MetadataRoute } from "next";
import { getPosts, getTreatments } from "@/lib/content";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/treatments", "/about", "/gallery", "/reviews", "/blog", "/contact", "/book"];
  const [treatments, posts] = await Promise.all([getTreatments(), getPosts()]);
  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...treatments.map((t) => ({ url: `${siteUrl}/treatments/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: new Date(p.publishedAt), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
