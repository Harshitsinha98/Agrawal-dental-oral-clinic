import "server-only";
import { cache } from "react";
import { fetchSanity } from "@/sanity/client";
import * as q from "@/sanity/queries";
import * as d from "@/content/defaults";
import type { AboutPage, Doctor, Faqs, Gallery, Homepage, Reviews, Settings, Treatment } from "./types";

/** Uses the Sanity value unless it is missing or blank, then the default. */
function merge<T extends object>(fallback: T, doc: Partial<T> | null | undefined): T {
  if (!doc) return fallback;
  const out = { ...fallback } as Record<string, unknown>;
  for (const [key, value] of Object.entries(doc)) {
    if (value === null || value === undefined || value === "") continue;
    out[key] = value;
  }
  return out as T;
}

export const getSettings = cache(async (): Promise<Settings> => {
  const doc = await fetchSanity<Partial<Settings>>(q.settingsQuery);
  const s = merge(d.defaultSettings, doc);
  if (!s.hours?.length) s.hours = d.defaultSettings.hours;
  return s;
});

export const getHomepage = cache(async (): Promise<Homepage> => {
  const doc = await fetchSanity<Partial<Homepage>>(q.homepageQuery);
  return {
    hero: merge(d.defaultHomepage.hero, doc?.hero),
    sections: doc?.sections ?? d.defaultHomepage.sections,
    seo: doc?.seo ?? null,
  };
});

export const getTreatments = cache(async (): Promise<Treatment[]> => {
  const docs = await fetchSanity<Treatment[]>(q.treatmentsQuery);
  return docs?.length ? docs : d.defaultTreatments;
});

export const getTreatment = cache(async (slug: string): Promise<Treatment | null> => {
  const list = await getTreatments();
  return list.find((t) => t.slug === slug) ?? null;
});

export const getDoctors = cache(async (): Promise<Doctor[]> => {
  const docs = await fetchSanity<Doctor[]>(q.doctorsQuery);
  return docs?.length ? docs : d.defaultDoctors;
});

export const getAbout = cache(async (): Promise<AboutPage> => merge(d.defaultAbout, await fetchSanity<Partial<AboutPage>>(q.aboutQuery)));

export const getGallery = cache(async (): Promise<Gallery> => {
  const g = merge(d.defaultGallery, await fetchSanity<Partial<Gallery>>(q.galleryQuery));
  return { ...g, photos: g.photos ?? [], beforeAfter: g.beforeAfter ?? [] };
});

export const getReviews = cache(async (): Promise<Reviews> => {
  const r = merge(d.defaultReviews, await fetchSanity<Partial<Reviews>>(q.reviewsQuery));
  return { ...r, items: r.items ?? [] };
});

export const getFaqs = cache(async (): Promise<Faqs> => {
  const f = merge(d.defaultFaqs, await fetchSanity<Partial<Faqs>>(q.faqsQuery));
  return { ...f, items: f.items ?? [] };
});
