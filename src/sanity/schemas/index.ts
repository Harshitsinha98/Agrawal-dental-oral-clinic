import { objectTypes } from "./objects";
import { settings } from "./settings";
import { homepage } from "./homepage";
import { aboutPage, faqs, gallery, reviews } from "./pages";
import { doctor, treatment } from "./collections";

/** Documents that exist exactly once. The Studio hides "create" and "delete" for these. */
export const singletonTypes = ["settings", "homepage", "aboutPage", "gallery", "reviews", "faqs"] as const;

export const schemaTypes = [...objectTypes, settings, homepage, aboutPage, gallery, reviews, faqs, treatment, doctor];
