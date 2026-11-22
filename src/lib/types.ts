import type { PortableTextBlock } from "next-sanity";

export type ImageAsset = {
  _id?: string;
  url?: string;
  metadata?: { lqip?: string; dimensions?: { width: number; height: number; aspectRatio: number } };
};

/** A photo bundled with the site (public/), used until the slot is filled in Sanity. */
export type LocalImage = { src: string; width: number; height: number; blur?: string; /** Focus point as CSS object-position, e.g. "65% 30%". */ position?: string };

export type Img = {
  _key?: string;
  asset?: ImageAsset | null;
  local?: LocalImage | null;
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
  /** Landline and other numbers, shown on the contact page and footer. */
  otherPhones?: string[] | null;
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
  /** Big line at the top of the footer, with the highlighted word in gold. */
  footerHeading?: string | null;
  footerHighlight?: string | null;
  /** Background photos for the top banner of inner pages. */
  pageImages?: { treatments?: Img; gallery?: Img; reviews?: Img; contact?: Img; book?: Img } | null;
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
  | (SectionBase & { _type: "treatmentsSection"; onlyFeatured?: boolean | null; layout?: "tiles" | "cards" | null; buttonLabel?: string | null })
  | (SectionBase & { _type: "doctorsSection"; points?: TeamPoint[] | null; buttonLabel?: string | null })
  | (SectionBase & { _type: "quickCardsSection"; items?: QuickCard[] | null })
  | (SectionBase & { _type: "whyTrustSection"; image?: Img; boxes?: TrustBox[] | null })
  | (SectionBase & { _type: "bookingStripSection"; buttonLabel?: string | null })
  | (SectionBase & { _type: "moreLinksSection"; items?: LinkTile[] | null })
  | (SectionBase & { _type: "clinicSection"; photos?: Img[] | null })
  | (SectionBase & { _type: "safetySection"; steps?: Step[] | null })
  | (SectionBase & { _type: "beforeAfterSection"; note?: string | null })
  | (SectionBase & { _type: "reviewsSection" })
  | (SectionBase & { _type: "faqSection"; limit?: number | null })
  | (SectionBase & { _type: "visitSection" })
  | (SectionBase & { _type: "ctaSection"; buttonLabel?: string | null })
  | (SectionBase & { _type: "awardsSection"; honours?: string[] | null; photos?: Img[] | null })
  | (SectionBase & {
      _type: "communitySection";
      points?: { _key?: string; title: string; text?: string | null }[] | null;
      photos?: Img[] | null;
      video?: Video | null;
      formHeading?: string | null;
      formText?: string | null;
      buttonLabel?: string | null;
    })
  | (SectionBase & { _type: "videoReviewsSection"; videos?: Video[] | null })
  | (SectionBase & { _type: "blogSection"; count?: number | null; buttonLabel?: string | null });

export type QuickCard = { _key?: string; kind: "rating" | "visit" | "link"; title?: string | null; text?: string | null; buttonLabel?: string | null; link?: string | null };
export type TrustBox = { _key?: string; title: string; icon?: string | null; points?: string[] | null };
export type TeamPoint = { _key?: string; value: string; title: string; text?: string | null };
export type LinkTile = { _key?: string; label: string; icon?: string | null; link: string };
export type Counter = { _key?: string; value: string; label: string; icon?: string | null };
export type HeroSlide = {
  _key?: string;
  eyebrow?: string | null;
  title: string;
  highlight?: string | null;
  text?: string | null;
  image?: Img;
  buttonLabel?: string | null;
  buttonLink?: string | null;
  badge?: string | null;
  badgeText?: string | null;
};

export type BlogPost = {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  cover?: Img;
  category: string;
  publishedAt: string;
  featured?: boolean | null;
  author?: { name: string; role?: string | null; photo?: Img } | null;
  /** Article text. Headings, lists, quotes and photos. */
  body?: PortableTextBlock[] | null;
  /** Treatment page this article leads to, shown as a button at the end. */
  treatmentSlug?: string | null;
  seo?: Seo;
};

export type BlogPage = { heading?: string | null; intro?: string | null; image?: Img; seo?: Seo };

export type Video = { _key?: string; url?: string | null; poster?: Img; name?: string | null; caption?: string | null };
export type Milestone = { _key?: string; year: string; title: string; text?: string | null };

export type Homepage = {
  hero: {
    eyebrow?: string | null;
    title: string;
    highlight?: string | null;
    text?: string | null;
    image?: Img;
    /** Short silent clip in a floating card, e.g. a laser treatment. */
    video?: Video | null;
    bookLabel?: string | null;
    /** Slides of the top banner. When empty, one slide is made from the fields above. */
    slides?: HeroSlide[] | null;
    /** Strip of numbers under the banner. */
    counters?: Counter[] | null;
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
  milestones?: Milestone[] | null;
  doctorsHeading?: string | null;
  journeyHeading?: string | null;
  ctaHeading?: string | null;
  ctaText?: string | null;
  seo?: Seo;
};

export type BeforeAfter = { _key: string; title: string; before: Img; after: Img };
export type Gallery = { heading?: string | null; intro?: string | null; photos: NonNullable<Img>[]; beforeAfter: BeforeAfter[]; seo?: Seo };

export type Review = { _key: string; name: string; text: string; rating: number; treatment?: string | null; when?: string | null };
export type Reviews = { heading?: string | null; intro?: string | null; items: Review[]; seo?: Seo };

export type Faqs = { heading?: string | null; items: QA[] };
