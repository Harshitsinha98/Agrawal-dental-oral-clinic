import { defineArrayMember, defineField, defineType } from "sanity";
import { dayOptions, iconOptions, timeOptions } from "./options";

/** An image with a required description, used everywhere a photo can be uploaded. */
export const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "What is in the photo?",
      description: "A short description, e.g. \"Dental chair in the treatment room\". Helps Google and blind visitors.",
      type: "string",
    }),
  ],
});

export const richText = defineType({
  name: "richText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h3" },
      ],
      lists: [
        { title: "Bullets", value: "bullet" },
        { title: "Numbers", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            type: "object",
            title: "Link",
            fields: [defineField({ name: "href", type: "url", title: "URL", validation: (r) => r.uri({ scheme: ["http", "https", "tel", "mailto"] }) })],
          }),
        ],
      },
    }),
  ],
});

export const seo = defineType({
  name: "seo",
  title: "Google search preview",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "Title in Google", type: "string", validation: (r) => r.max(70).warning("Google shows about 60 characters.") }),
    defineField({ name: "description", title: "Description in Google", type: "text", rows: 3, validation: (r) => r.max(170).warning("Google shows about 155 characters.") }),
    defineField({ name: "image", title: "Image when shared on WhatsApp / Facebook", type: "image" }),
  ],
});

export const session = defineType({
  name: "session",
  title: "Open from – to",
  type: "object",
  fields: [
    defineField({ name: "from", title: "Opens", type: "string", options: { list: timeOptions }, validation: (r) => r.required() }),
    defineField({ name: "to", title: "Closes", type: "string", options: { list: timeOptions }, validation: (r) => r.required() }),
  ],
  validation: (r) =>
    r.custom((value: { from?: string; to?: string } | undefined) =>
      value?.from && value?.to && value.from >= value.to ? "Closing time must be after opening time" : true,
    ),
  preview: {
    select: { from: "from", to: "to" },
    prepare: ({ from, to }) => ({
      title: `${timeOptions.find((t) => t.value === from)?.title ?? "?"} – ${timeOptions.find((t) => t.value === to)?.title ?? "?"}`,
    }),
  },
});

export const dayHours = defineType({
  name: "dayHours",
  title: "Day",
  type: "object",
  fields: [
    defineField({ name: "day", title: "Day", type: "string", options: { list: dayOptions }, validation: (r) => r.required() }),
    defineField({ name: "closed", title: "Closed on this day", type: "boolean", initialValue: false }),
    defineField({
      name: "sessions",
      title: "Timings",
      description: "Add two rows for a lunch break, e.g. 10 am – 2 pm and 5 pm – 9 pm.",
      type: "array",
      of: [defineArrayMember({ type: "session" })],
      hidden: ({ parent }) => Boolean(parent?.closed),
    }),
  ],
  preview: {
    select: { day: "day", closed: "closed", s0f: "sessions.0.from", s0t: "sessions.0.to", s1f: "sessions.1.from", s1t: "sessions.1.to" },
    prepare: ({ day, closed, s0f, s0t, s1f, s1t }) => {
      const t = (v?: string) => timeOptions.find((o) => o.value === v)?.title ?? "";
      const parts = [s0f && `${t(s0f)} – ${t(s0t)}`, s1f && `${t(s1f)} – ${t(s1t)}`].filter(Boolean);
      return {
        title: dayOptions.find((d) => d.value === day)?.title ?? "Day",
        subtitle: closed ? "Closed" : parts.join(", ") || "No timings added",
      };
    },
  },
});

export const step = defineType({
  name: "step",
  title: "Step",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "text", type: "text", rows: 3 }),
    defineField({ name: "icon", type: "string", options: { list: iconOptions } }),
  ],
});

export const qa = defineType({
  name: "qa",
  title: "Question",
  type: "object",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "text", rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});

export const objectTypes = [photo, richText, seo, session, dayHours, step, qa];
