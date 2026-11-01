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
        defineField({ name: "image", title: "Main photo", type: "photo" }),
        defineField({ name: "secondImage", title: "Small second photo (optional)", type: "photo" }),
        defineField({ name: "bookLabel", title: "Booking button text", type: "string", initialValue: "Book on WhatsApp" }),
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
        ]),
        section("doctorsSection", "Doctor(s)"),
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
      ],
    }),
    defineField({ name: "seo", title: "Google preview", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
