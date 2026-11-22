import { objectTypes } from "./objects";
import { settings } from "./settings";
import { homepage } from "./homepage";
import { aboutPage, blogPage, faqs, gallery, reviews } from "./pages";
import { blogPost, doctor, treatment } from "./collections";

/** Documents that exist exactly once. The Studio hides "create" and "delete" for these. */
export const singletonTypes = ["settings", "homepage", "aboutPage", "gallery", "reviews", "faqs", "blogPage"] as const;

export const schemaTypes = [...objectTypes, settings, homepage, aboutPage, blogPage, gallery, reviews, faqs, treatment, doctor, blogPost];
