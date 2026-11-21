import { HomeIcon } from "@sanity/icons/Home";
import { defineArrayMember, defineField, defineType } from "sanity";
import { iconOptions } from "./options";

const enabled = defineField({
  name: "enabled",
  title: "Show this section",
  type: "boolean",
  initialValue: true,
});
const heading = defineField({ name: "heading", title: "Heading", type: "string" });
const intro = defineField({ name: "intro", title: "Short text under the heading", type: "text", rows: 3 });
const buttonLabel = defineField({ name: "buttonLabel", title: "Button text", type: "string" });
const link = (title = "Link") =>
  defineField({ name: "link", title, type: "string", description: "A page on this site such as /treatments/dental-implants, or a full https:// link." });

function section(name: string, title: string, extra: ReturnType<typeof defineField>[] = []) {
  return defineArrayMember({
    name,
    title,
    type: "object",
    fields: [enabled, heading, intro, ...extra],
    preview: {
      select: { heading: "heading", enabled: "enabled" },
      prepare: ({ heading: h, enabled: on }) => ({
        title: `${title}${on === false ? "  (hidden)" : ""}`,
        subtitle: h,
      }),
    },
  });
}

export const homepage = defineType({
  name: "homepage",
  title: "Home page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Top banner", default: true },
    { name: "sections", title: "Sections" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Top banner",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "eyebrow", title: "Small line above the heading", type: "string" }),
        defineField({ name: "title", title: "Heading", type: "string", validation: (r) => r.required().max(90) }),
        defineField({
          name: "highlight",
          title: "Word(s) to colour in the heading",
          type: "string",
          description: "Must appear exactly in the heading, e.g. \"gentle\".",
        }),
        defineField({ name: "text", title: "Text under the heading", type: "text", rows: 3 }),
        defineField({ name: "image", title: "Main photo (used when there are no slides)", type: "photo" }),
        defineField({ name: "video", title: "Small video card on the first slide (optional, plays silently)", description: "Use the caption for the label, e.g. \"Laser dentistry\".", type: "videoClip" }),
        defineField({ name: "bookLabel", title: "Booking button text", type: "string", initialValue: "Book on WhatsApp" }),
        defineField({
          name: "slides",
          title: "Slides",
          description: "The banner slides from one to the next. Leave empty to show a single slide made from the fields above.",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "heroSlide",
              fields: [
                defineField({ name: "eyebrow", title: "Small line above the heading", type: "string" }),
                defineField({ name: "title", title: "Heading", type: "string", validation: (r) => r.required().max(90) }),
                defineField({ name: "highlight", title: "Word(s) to colour in the heading", type: "string" }),
                defineField({ name: "text", title: "Text under the heading", type: "text", rows: 3 }),
                defineField({ name: "image", title: "Photo", type: "photo" }),
                defineField({ name: "buttonLabel", title: "Button text", type: "string", description: "Leave empty for the booking button." }),
                defineField({ name: "buttonLink", title: "Button link", type: "string", description: "e.g. /treatments/dental-implants. Leave empty to open the booking page." }),
                defineField({ name: "badge", title: "Badge on the photo (big text)", type: "string", description: "e.g. 24+" }),
                defineField({ name: "badgeText", title: "Badge on the photo (small text)", type: "string", description: "e.g. years of care" }),
              ],
              preview: { select: { title: "title", subtitle: "eyebrow", media: "image" } },
            }),
          ],
        }),
        defineField({
          name: "counters",
          title: "Numbers strip under the banner",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "counter",
              fields: [
                defineField({ name: "value", title: "Number", type: "string", description: "e.g. 24+ or 4.7", validation: (r) => r.required().max(10) }),
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "icon", type: "string", options: { list: iconOptions } }),
              ],
              preview: { select: { title: "value", subtitle: "label" } },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Sections (drag to change the order)",
      description: "Turn a section off with \"Show this section\" instead of deleting it, so its text is kept.",
      type: "array",
      group: "sections",
      of: [
        section("concernsSection", "What brings you in?", [
          defineField({
            name: "items",
            title: "Options",
            type: "array",
            of: [
              defineArrayMember({
                type: "object",
                name: "concern",
                fields: [
                  defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                  defineField({ name: "icon", type: "string", options: { list: iconOptions } }),
                  defineField({ name: "treatment", title: "Opens this treatment in the booking form", type: "reference", to: [{ type: "treatment" }] }),
                ],
                preview: { select: { title: "label", subtitle: "treatment.title" } },
              }),
            ],
          }),
        ]),
        section("statsSection", "Numbers strip", [
          defineField({
            name: "showGoogle",
            title: "Show Google rating and review count",
            description: "Taken from Clinic details → Google & social.",
            type: "boolean",
            initialValue: true,
          }),
          defineField({
            name: "items",
            title: "More numbers",
            type: "array",
            of: [
              defineArrayMember({
                type: "object",
                name: "stat",
                fields: [
                  defineField({ name: "value", type: "number", validation: (r) => r.required() }),
                  defineField({ name: "suffix", title: "After the number", type: "string", description: "e.g. + or %" }),
                  defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                ],
                preview: { select: { v: "value", s: "suffix", l: "label" }, prepare: ({ v, s, l }) => ({ title: `${v}${s ?? ""}`, subtitle: l }) },
              }),
            ],
          }),
        ]),
        section("treatmentsSection", "Treatments", [
          defineField({ name: "onlyFeatured", title: "Only show treatments marked \"Show on home page\"", type: "boolean", initialValue: true }),
          defineField({
            name: "layout",
            title: "Look",
            type: "string",
            options: { list: [{ title: "Icon tiles", value: "tiles" }, { title: "Photo cards", value: "cards" }], layout: "radio" },
            initialValue: "tiles",
          }),
          buttonLabel,
        ]),
        section("doctorsSection", "Doctor(s)", [
          defineField({
            name: "points",
            title: "Highlight boxes above the doctors",
            type: "array",
            of: [
              defineArrayMember({
                type: "object",
                name: "teamPoint",
                fields: [
                  defineField({ name: "value", title: "Big text", type: "string", description: "e.g. 2 MDS", validation: (r) => r.required() }),
                  defineField({ name: "title", type: "string", validation: (r) => r.required() }),
                  defineField({ name: "text", type: "string" }),
                ],
                preview: { select: { title: "value", subtitle: "title" } },
              }),
            ],
          }),
          buttonLabel,
        ]),
        section("quickCardsSection", "Three cards under the banner", [
          defineField({
            name: "items",
            title: "Cards",
            type: "array",
            validation: (r) => r.max(3),
            of: [
              defineArrayMember({
                type: "object",
                name: "quickCard",
                fields: [
                  defineField({
                    name: "kind",
                    title: "Type",
                    type: "string",
                    options: {
                      list: [
                        { title: "Google rating (uses Clinic details)", value: "rating" },
                        { title: "Open now & timings", value: "visit" },
                        { title: "Text with a button", value: "link" },
                      ],
                      layout: "radio",
                    },
                    initialValue: "link",
                    validation: (r) => r.required(),
                  }),
                  defineField({ name: "title", type: "string" }),
                  defineField({ name: "text", type: "string" }),
                  defineField({ name: "buttonLabel", title: "Button text", type: "string" }),
                  link("Button link"),
                ],
                preview: { select: { title: "title", subtitle: "kind" } },
              }),
            ],
          }),
        ]),
        section("whyTrustSection", "Why patients trust us", [
          defineField({ name: "image", title: "Photo", type: "photo" }),
          defineField({
            name: "boxes",
            title: "Boxes",
            type: "array",
            of: [
              defineArrayMember({
                type: "object",
                name: "trustBox",
                fields: [
                  defineField({ name: "title", type: "string", validation: (r) => r.required() }),
                  defineField({ name: "icon", type: "string", options: { list: iconOptions } }),
                  defineField({ name: "points", title: "Points", type: "array", of: [defineArrayMember({ type: "string" })] }),
                ],
              }),
            ],
          }),
        ]),
        section("bookingStripSection", "Quick booking form", [buttonLabel]),
        section("moreLinksSection", "Link tiles (\"More than a dental clinic\")", [
          defineField({
            name: "items",
            title: "Tiles",
            type: "array",
            of: [
              defineArrayMember({
                type: "object",
                name: "linkTile",
                fields: [
                  defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                  defineField({ name: "icon", type: "string", options: { list: iconOptions } }),
                  defineField({ ...link(), validation: (r) => r.required() }),
                ],
                preview: { select: { title: "label", subtitle: "link" } },
              }),
            ],
          }),
        ]),
        section("clinicSection", "Inside the clinic", [
          defineField({ name: "photos", title: "Photos", description: "Leave empty to use the first Clinic photos from the Gallery.", type: "array", of: [defineArrayMember({ type: "photo" })] }),
        ]),
        section("safetySection", "Safety & sterilisation", [
          defineField({ name: "steps", title: "Steps", type: "array", of: [defineArrayMember({ type: "step" })] }),
        ]),
        section("beforeAfterSection", "Before / after", [
          defineField({ name: "note", title: "Small print", type: "string", initialValue: "Photos shared with the patient's permission. Results differ from person to person." }),
        ]),
        section("reviewsSection", "Patient reviews"),
        section("faqSection", "Questions", [
          defineField({ name: "limit", title: "How many questions to show", type: "number", initialValue: 6, validation: (r) => r.min(1).max(20) }),
        ]),
        section("visitSection", "Timings & location"),
        section("ctaSection", "Booking call-to-action", [
          defineField({ name: "buttonLabel", title: "Button text", type: "string" }),
        ]),
        section("videoReviewsSection", "Video reviews", [
          defineField({ name: "videos", title: "Videos", description: "Short phone videos of patients (MP4, under 20 MB each). Only with the patient's permission.", type: "array", of: [defineArrayMember({ type: "videoClip" })] }),
        ]),
        section("awardsSection", "Awards & honours", [
          defineField({ name: "honours", title: "Honours (one per line)", type: "array", of: [defineArrayMember({ type: "string" })] }),
          defineField({ name: "photos", title: "Photos of awards", type: "array", of: [defineArrayMember({ type: "photo" })] }),
        ]),
        section("communitySection", "Camps & community", [
          defineField({
            name: "points",
            title: "Highlights",
            type: "array",
            of: [
              defineArrayMember({
                type: "object",
                name: "point",
                fields: [defineField({ name: "title", type: "string", validation: (r) => r.required() }), defineField({ name: "text", type: "string" })],
              }),
            ],
          }),
          defineField({ name: "photos", title: "Photos", type: "array", of: [defineArrayMember({ type: "photo" })] }),
          defineField({ name: "video", title: "Short video (optional, plays silently)", type: "videoClip" }),
          defineField({ name: "formHeading", title: "Camp request form: heading", type: "string" }),
          defineField({ name: "formText", title: "Camp request form: text", type: "string" }),
          buttonLabel,
        ]),
      ],
    }),
    defineField({ name: "seo", title: "Google preview", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
