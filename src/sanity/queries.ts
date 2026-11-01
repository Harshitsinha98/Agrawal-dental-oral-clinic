import { defineQuery } from "next-sanity";

// Every image is projected the same way: the asset with its blur placeholder and size.
const IMG = `{..., asset->{_id, url, metadata{lqip, dimensions}}}`;
const SEO = `seo{title, description, image${IMG}}`;

export const settingsQuery = defineQuery(`*[_id == "settings"][0]{..., logo${IMG}, ${SEO}}`);

export const homepageQuery = defineQuery(`*[_id == "homepage"][0]{
  hero{..., image${IMG}, secondImage${IMG}},
  sections[]{
    ...,
    photos[]${IMG},
    items[]{..., "treatmentSlug": treatment->slug.current}
  },
  ${SEO}
}`);

const TREATMENT = `{..., "slug": slug.current, image${IMG}, ${SEO}}`;

export const treatmentsQuery = defineQuery(
  `*[_type == "treatment" && defined(slug.current)] | order(coalesce(order, 99) asc, title asc)${TREATMENT}`,
);

export const treatmentQuery = defineQuery(`*[_type == "treatment" && slug.current == $slug][0]${TREATMENT}`);

export const doctorsQuery = defineQuery(`*[_type == "doctor"] | order(coalesce(order, 99) asc, name asc){..., photo${IMG}}`);

export const aboutQuery = defineQuery(`*[_id == "aboutPage"][0]{..., image${IMG}, ${SEO}}`);

export const galleryQuery = defineQuery(`*[_id == "gallery"][0]{
  heading, intro,
  "photos": photos[defined(asset)]${IMG},
  "beforeAfter": beforeAfter[consent == true && defined(before.asset) && defined(after.asset)]{_key, title, before${IMG}, after${IMG}},
  ${SEO}
}`);

export const reviewsQuery = defineQuery(`*[_id == "reviews"][0]{heading, intro, items, ${SEO}}`);

export const faqsQuery = defineQuery(`*[_id == "faqs"][0]{heading, items}`);
