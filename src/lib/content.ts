import "server-only";
import { cache } from "react";
import { fetchSanity } from "@/sanity/client";
import * as q from "@/sanity/queries";
import * as d from "@/content/defaults";
import type { AboutPage, Doctor, Faqs, Gallery, Homepage, Reviews, Section, Settings, Treatment } from "./types";

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
  s.pageImages = merge(d.defaultSettings.pageImages ?? {}, s.pageImages ?? {});
  return s;
});

/**
 * Section types added to the site after the doctor's home page was set up in Sanity
 * would otherwise never appear. Any default section whose type is missing from the
 * Sanity list is slotted in after the section that precedes it in the defaults.
 * Once it is added in the Studio, the Studio's order and "Show this section" win.
 */
function withNewSections(sections: Section[]): Section[] {
  const out = [...sections];
  const present = new Set(out.map((s) => s._type));
  d.defaultHomepage.sections.forEach((def, i) => {
    if (present.has(def._type)) return;
    const prevType = d.defaultHomepage.sections[i - 1]?._type;
    const at = prevType ? out.findIndex((s) => s._type === prevType) : -1;
    out.splice(at + 1, 0, def);
    present.add(def._type);
  });
  return out;
}

export const getHomepage = cache(async (): Promise<Homepage> => {
  const doc = await fetchSanity<Partial<Homepage>>(q.homepageQuery);
  return {
    hero: merge(d.defaultHomepage.hero, doc?.hero),
    sections: doc?.sections?.length ? withNewSections(doc.sections) : d.defaultHomepage.sections,
    seo: doc?.seo ?? null,
  };
});

export const getTreatments = cache(async (): Promise<Treatment[]> => {
  const docs = await fetchSanity<Treatment[]>(q.treatmentsQuery);
  if (!docs?.length) return d.defaultTreatments;
  // Blank fields (e.g. no photo uploaded yet) fall back to the starting content for the same page.
  return docs.map((t) => {
    const def = d.defaultTreatments.find((x) => x.slug === t.slug);
    return def ? merge(def, t) : t;
  });
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
