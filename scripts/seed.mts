/**
 * Copies the starting content (src/content/defaults.ts) into Sanity, including the
 * clinic photos and videos bundled in public/, so the doctors open the Studio to
 * filled-in forms.
 *
 *   SANITY_API_WRITE_TOKEN=… npm run seed              # only creates what doesn't exist yet
 *   SANITY_API_WRITE_TOKEN=… npm run seed -- --replace # overwrites (careful: loses Studio edits)
 *   npm run seed -- --dry                              # prints the documents, uploads nothing
 *
 * The token needs Editor rights: sanity.io/manage → project → API → Tokens → Add API token.
 * Delete the token afterwards if you don't need it again.
 */

import { createReadStream, existsSync } from "node:fs";
import { basename, join } from "node:path";
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

/** Uploads a file from public/ once and returns its asset id. */
const uploaded = new Map<string, string>();
async function upload(kind: "image" | "file", src: string) {
  const cached = uploaded.get(src);
  if (cached) return cached;
  const path = join(process.cwd(), "public", src);
  if (!existsSync(path)) throw new Error(`Missing file ${path}`);
  const id = dry ? `${kind}-dry-${basename(src)}` : (await client.assets.upload(kind, createReadStream(path), { filename: basename(src) }))._id;
  uploaded.set(src, id);
  if (!dry) console.log(`  uploaded ${src}`);
  return id;
}

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => Boolean(v) && typeof v === "object" && !Array.isArray(v);

/**
 * Turns bundled media into Sanity references:
 *   { local: { src } }   → photo with an uploaded image asset
 *   { url: "/videos/…" } → videoClip with an uploaded file asset
 */
async function media(value: unknown, keepCategory = false): Promise<unknown> {
  if (Array.isArray(value)) {
    const out = [];
    for (const v of value) out.push(await media(v, keepCategory));
    return out;
  }
  if (!isObj(value)) return value;

  if (isObj(value.local) && typeof value.local.src === "string") {
    // Bundled photos carry a category for the gallery filter; only gallery photos have that field.
    const { local, _key, category, ...rest } = value as Obj & { local: { src: string } };
    return { ...(_key ? { _key } : {}), _type: "photo", ...rest, ...(keepCategory ? { category } : {}), asset: { _type: "reference", _ref: await upload("image", local.src) } };
  }
  if (typeof value.url === "string" && value.url.startsWith("/")) {
    const { url, poster, _key, ...rest } = value as Obj & { url: string };
    return {
      ...(_key ? { _key } : {}),
      _type: "videoClip",
      ...rest,
      file: { _type: "file", asset: { _type: "reference", _ref: await upload("file", url) } },
      ...(poster ? { poster: await media(poster) } : {}),
    };
  }
  const out: Obj = {};
  for (const [k, v] of Object.entries(value)) out[k] = await media(v, keepCategory);
  return out;
}

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
  hero: { ...d.defaultHomepage.hero, slides: typed("heroSlide", d.defaultHomepage.hero.slides), counters: typed("counter", d.defaultHomepage.hero.counters) },
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
    if (s._type === "communitySection") out.points = typed("point", s.points);
    if (s._type === "quickCardsSection") out.items = typed("quickCard", s.items);
    if (s._type === "whyTrustSection") out.boxes = typed("trustBox", s.boxes);
    if (s._type === "moreLinksSection") out.items = typed("linkTile", s.items);
    if (s._type === "doctorsSection") out.points = typed("teamPoint", s.points);
    return out;
  }),
});

docs.push({ _id: "aboutPage", _type: "aboutPage", ...d.defaultAbout, highlights: typed("highlight", d.defaultAbout.highlights), milestones: typed("milestone", d.defaultAbout.milestones) });
docs.push({
  _id: "gallery",
  _type: "gallery",
  heading: d.defaultGallery.heading,
  intro: d.defaultGallery.intro,
  photos: d.defaultGallery.photos,
  // The pairs come from the clinic's own published flyer, so they are marked as cleared to show.
  beforeAfter: d.defaultGallery.beforeAfter.map(({ _key, ...p }) => ({ _key, _type: "beforeAfterPair", ...p, consent: true })),
});
docs.push({ _id: "reviews", _type: "reviews", heading: d.defaultReviews.heading, intro: d.defaultReviews.intro });
docs.push({ _id: "blogPage", _type: "blogPage", ...d.defaultBlogPage });
for (const p of d.defaultBlogPosts) {
  const { slug, treatmentSlug, ...rest } = p;
  docs.push({
    _id: `post-${slug}`,
    _type: "blogPost",
    ...rest,
    slug: { _type: "slug", current: slug },
    ...(treatmentSlug ? { treatment: { _type: "reference", _ref: treatmentId(treatmentSlug) } } : {}),
  });
}
docs.push({ _id: "faqs", _type: "faqs", heading: d.defaultFaqs.heading, items: typed("qa", d.defaultFaqs.items) });

if (!replace && !dry) {
  // Without --replace existing documents are kept, so only upload media for the new ones.
  const existing = new Set(await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: docs.map((x) => x._id) }));
  for (let i = docs.length - 1; i >= 0; i--) if (existing.has(docs[i]._id as string)) docs.splice(i, 1);
  if (!docs.length) {
    console.log("Every document already exists. Use --replace to overwrite them.");
    process.exit(0);
  }
}

console.log(dry ? "Dry run, nothing is uploaded." : "Uploading photos and videos…");
const prepared: { _id: string; _type: string }[] = [];
for (const doc of docs) prepared.push(clean(await media(doc, doc._id === "gallery")) as { _id: string; _type: string });
// Before/after fields are plain images in the schema, not "photo".
for (const doc of prepared as Record<string, unknown>[])
  for (const pair of (doc.beforeAfter as Record<string, Record<string, unknown>>[] | undefined) ?? []) {
    pair.before._type = "image";
    pair.after._type = "image";
  }

if (dry) {
  console.log(JSON.stringify(prepared, null, 2));
  process.exit(0);
}

const tx = client.transaction();
for (const doc of prepared) {
  if (replace) tx.createOrReplace(doc);
  else tx.createIfNotExists(doc);
}
const res = await tx.commit();
console.log(`${replace ? "Replaced" : "Created"} ${prepared.length} documents (${uploaded.size} files uploaded). Transaction ${res.transactionId}.`);
