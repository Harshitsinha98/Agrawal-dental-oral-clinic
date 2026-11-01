/**
 * Copies the starting content (src/content/defaults.ts) into Sanity, so the doctor
 * opens the Studio to filled-in forms.
 *
 *   SANITY_API_WRITE_TOKEN=… npm run seed            # only creates what doesn't exist yet
 *   SANITY_API_WRITE_TOKEN=… npm run seed -- --replace  # overwrites (careful: loses Studio edits)
 *
 * The token needs Editor rights: sanity.io/manage → project → API → Tokens → Add API token.
 * Delete the token afterwards if you don't need it again.
 */

import { createClient } from "@sanity/client";
import * as d from "../src/content/defaults.ts";

const dry = process.argv.includes("--dry");
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token && !dry) {
  console.error("Set SANITY_API_WRITE_TOKEN first (Editor token from sanity.io/manage → API → Tokens).");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "7sqg0qba",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-10-01",
  token,
  useCdn: false,
});

const replace = process.argv.includes("--replace");
let n = 0;
const key = () => `s${Date.now().toString(36)}${(n++).toString(36)}`;

/** Drop nulls and give every object in an array a _key (and a _type where given). */
function clean<T>(value: T): T {
  if (Array.isArray(value)) return value.map((v) => (v && typeof v === "object" && !Array.isArray(v) ? { _key: key(), ...clean(v) } : clean(v))) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== null && v !== undefined).map(([k, v]) => [k, clean(v)])) as T;
  }
  return value;
}

const typed = <T extends object>(type: string, list: T[] | null | undefined) => (list ?? []).map((x) => ({ _type: type, ...x }));
const treatmentId = (slug: string) => `treatment-${slug}`;

const docs: Record<string, unknown>[] = [];

docs.push({
  _id: "settings",
  _type: "settings",
  ...d.defaultSettings,
  hours: d.defaultSettings.hours.map((h) => ({ _type: "dayHours", ...h, sessions: typed("session", h.sessions) })),
  seo: { _type: "seo", ...d.defaultSettings.seo },
});

for (const t of d.defaultTreatments) {
  docs.push({
    _id: treatmentId(t.slug),
    _type: "treatment",
    ...t,
    slug: { _type: "slug", current: t.slug },
    steps: typed("step", t.steps),
    faqs: typed("qa", t.faqs),
  });
}

d.defaultDoctors.forEach((doc, i) => docs.push({ _id: `doctor-${i + 1}`, _type: "doctor", order: i + 1, ...doc }));

docs.push({
  _id: "homepage",
  _type: "homepage",
  hero: d.defaultHomepage.hero,
  sections: d.defaultHomepage.sections.map((s) => {
    const out: Record<string, unknown> = { ...s };
    if (s._type === "concernsSection")
      out.items = (s.items ?? []).map(({ treatmentSlug, ...item }) => ({
        _type: "concern",
        ...item,
        ...(treatmentSlug ? { treatment: { _type: "reference", _ref: treatmentId(treatmentSlug) } } : {}),
      }));
    if (s._type === "statsSection") out.items = typed("stat", s.items);
    if (s._type === "safetySection") out.steps = typed("step", s.steps);
    if (s._type === "clinicSection") delete out.photos;
    return out;
  }),
});

docs.push({ _id: "aboutPage", _type: "aboutPage", ...d.defaultAbout, highlights: typed("highlight", d.defaultAbout.highlights) });
docs.push({ _id: "gallery", _type: "gallery", heading: d.defaultGallery.heading, intro: d.defaultGallery.intro });
docs.push({ _id: "reviews", _type: "reviews", heading: d.defaultReviews.heading, intro: d.defaultReviews.intro });
docs.push({ _id: "faqs", _type: "faqs", heading: d.defaultFaqs.heading, items: typed("qa", d.defaultFaqs.items) });

if (dry) {
  console.log(JSON.stringify(docs.map((doc) => clean(doc)), null, 2));
  process.exit(0);
}

const tx = client.transaction();
for (const doc of docs) {
  const c = clean(doc) as { _id: string; _type: string };
  if (replace) tx.createOrReplace(c);
  else tx.createIfNotExists(c);
}
const res = await tx.commit();
console.log(`${replace ? "Replaced" : "Created (if missing)"} ${docs.length} documents. Transaction ${res.transactionId}.`);
