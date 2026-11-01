import type { PortableTextBlock } from "next-sanity";

export type ImageAsset = {
  _id?: string;
  url?: string;
  metadata?: { lqip?: string; dimensions?: { width: number; height: number; aspectRatio: number } };
};

export type Img = {
  _key?: string;
  asset?: ImageAsset | null;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string | null;
  caption?: string | null;
  category?: string | null;
} | null;

export type Seo = { title?: string | null; description?: string | null; image?: Img } | null;

export type Session = { from: string; to: string };
export type DayHours = { _key?: string; day: DayKey; closed?: boolean; sessions?: Session[] | null };
export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type Settings = {
  clinicName: string;
  shortName?: string | null;
  logo?: Img;
  tagline?: string | null;
  address: string;
  landmark?: string | null;
  mapsUrl?: string | null;
  notice?: { enabled?: boolean; text?: string | null } | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  hours: DayHours[];
  hoursNote?: string | null;
  googleRating?: number | null;
  googleReviewCount?: number | null;
  googleReviewsUrl?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  seo?: Seo;
};

export type Step = { _key?: string; title: string; text?: string | null; icon?: string | null };
export type QA = { _key?: string; question: string; answer: string };

export type Treatment = {
  _id?: string;
  title: string;
  slug: string;
  icon?: string | null;
  summary: string;
  image?: Img;
  featured?: boolean | null;
  order?: number | null;
  body?: PortableTextBlock[] | null;
  duration?: string | null;
  visits?: string | null;
  steps?: Step[] | null;
  aftercare?: string[] | null;
  faqs?: QA[] | null;
  seo?: Seo;
};

export type Doctor = {
  _id?: string;
  name: string;
  photo?: Img;
  qualifications?: string | null;
  role?: string | null;
  experienceYears?: number | null;
  registration?: string | null;
  bio?: PortableTextBlock[] | null;
  highlights?: string[] | null;
};

type SectionBase = { _key: string; enabled?: boolean | null; heading?: string | null; intro?: string | null };
export type Section =
  | (SectionBase & { _type: "concernsSection"; items?: { _key: string; label: string; icon?: string | null; treatmentSlug?: string | null }[] | null })
  | (SectionBase & { _type: "statsSection"; showGoogle?: boolean | null; items?: { _key: string; value: number; suffix?: string | null; label: string }[] | null })
  | (SectionBase & { _type: "treatmentsSection"; onlyFeatured?: boolean | null })
  | (SectionBase & { _type: "doctorsSection" })
  | (SectionBase & { _type: "clinicSection"; photos?: Img[] | null })
  | (SectionBase & { _type: "safetySection"; steps?: Step[] | null })
  | (SectionBase & { _type: "beforeAfterSection"; note?: string | null })
  | (SectionBase & { _type: "reviewsSection" })
  | (SectionBase & { _type: "faqSection"; limit?: number | null })
  | (SectionBase & { _type: "visitSection" })
  | (SectionBase & { _type: "ctaSection"; buttonLabel?: string | null });

export type Homepage = {
  hero: {
    eyebrow?: string | null;
    title: string;
    highlight?: string | null;
    text?: string | null;
    image?: Img;
    secondImage?: Img;
    bookLabel?: string | null;
  };
  sections: Section[];
  seo?: Seo;
};

export type AboutPage = {
  heading: string;
  intro?: string | null;
  image?: Img;
  body?: PortableTextBlock[] | null;
  highlights?: { _key?: string; title: string; text?: string | null }[] | null;
  seo?: Seo;
};

export type BeforeAfter = { _key: string; title: string; before: Img; after: Img };
export type Gallery = { heading?: string | null; intro?: string | null; photos: NonNullable<Img>[]; beforeAfter: BeforeAfter[]; seo?: Seo };

export type Review = { _key: string; name: string; text: string; rating: number; treatment?: string | null; when?: string | null };
export type Reviews = { heading?: string | null; intro?: string | null; items: Review[]; seo?: Seo };

export type Faqs = { heading?: string | null; items: QA[] };
