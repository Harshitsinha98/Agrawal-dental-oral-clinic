import { CommentIcon } from "@sanity/icons/Comment";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { ImagesIcon } from "@sanity/icons/Images";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineArrayMember, defineField, defineType } from "sanity";
import { galleryCategories } from "./options";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  icon: InfoOutlineIcon,
  fields: [
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Main photo", type: "photo" }),
    defineField({ name: "body", title: "About the clinic", type: "richText" }),
    defineField({
      name: "highlights",
      title: "Highlights",
      description: "Short points shown as cards, e.g. \"Same-day emergency care\".",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "highlight",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", type: "text", rows: 2 }),
          ],
        }),
      ],
    }),
    defineField({ name: "seo", title: "Google preview", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});

export const gallery = defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({ name: "heading", type: "string", initialValue: "Gallery" }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({
      name: "photos",
      title: "Photos",
      description: "Drag several photos here at once. Drag a row to change its position.",
      type: "array",
      options: { layout: "grid" },
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "What is in the photo?", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
            defineField({ name: "category", title: "Category", type: "string", options: { list: galleryCategories, layout: "radio" }, initialValue: "clinic" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "beforeAfter",
      title: "Before / after",
      description: "Only add patient photos with the patient's written permission.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "beforeAfterPair",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", description: "e.g. \"Front tooth crown\"", validation: (r) => r.required() }),
            defineField({ name: "before", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
            defineField({ name: "after", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
            defineField({ name: "consent", title: "Patient has given permission", type: "boolean", validation: (r) => r.required().custom((v) => (v ? true : "Tick this only after the patient agrees")) }),
          ],
          preview: { select: { title: "title", media: "after" } },
        }),
      ],
    }),
    defineField({ name: "seo", title: "Google preview", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Gallery" }) },
});

export const reviews = defineType({
  name: "reviews",
  title: "Patient reviews",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({
      name: "items",
      title: "Reviews",
      description: "Copy real reviews from Google. Drag to change the order.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "review",
          fields: [
            defineField({ name: "name", title: "Patient name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Review", type: "text", rows: 5, validation: (r) => r.required() }),
            defineField({ name: "rating", type: "number", initialValue: 5, options: { list: [5, 4, 3, 2, 1] }, validation: (r) => r.required() }),
            defineField({ name: "treatment", title: "Treatment (optional)", type: "string" }),
            defineField({ name: "when", title: "When (optional)", type: "string", description: "e.g. \"March 2026\"" }),
          ],
          preview: { select: { title: "name", subtitle: "text" } },
        }),
      ],
    }),
    defineField({ name: "seo", title: "Google preview", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Patient reviews" }) },
});

export const faqs = defineType({
  name: "faqs",
  title: "Questions (FAQ)",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "items", title: "Questions", type: "array", of: [defineArrayMember({ type: "qa" })] }),
  ],
  preview: { prepare: () => ({ title: "Questions (FAQ)" }) },
});
