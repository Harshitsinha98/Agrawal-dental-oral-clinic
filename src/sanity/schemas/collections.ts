import { UserIcon } from "@sanity/icons/User";
import { ActivityIcon } from "@sanity/icons/Activity";
import { defineArrayMember, defineField, defineType } from "sanity";
import { iconOptions } from "./options";

export const treatment = defineType({
  name: "treatment",
  title: "Treatment",
  type: "document",
  icon: ActivityIcon,
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "details", title: "Page details" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Page address",
      description: "Click Generate. This becomes /treatments/…",
      type: "slug",
      group: "main",
      options: { source: "title", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "icon", type: "string", group: "main", options: { list: iconOptions } }),
    defineField({ name: "summary", title: "One-line summary", type: "text", rows: 2, group: "main", validation: (r) => r.required().max(180) }),
    defineField({ name: "image", title: "Photo", type: "photo", group: "main" }),
    defineField({ name: "featured", title: "Show on home page", type: "boolean", group: "main", initialValue: true }),
    defineField({ name: "order", title: "Position in lists", description: "Smaller numbers come first.", type: "number", group: "main", initialValue: 10 }),

    defineField({ name: "body", title: "About this treatment", type: "richText", group: "details" }),
    defineField({ name: "duration", title: "Time per visit", type: "string", group: "details", description: "e.g. \"45–60 minutes\"" }),
    defineField({ name: "visits", title: "Number of visits", type: "string", group: "details", description: "e.g. \"1–2 visits\"" }),
    defineField({ name: "steps", title: "How it is done", type: "array", group: "details", of: [defineArrayMember({ type: "step" })] }),
    defineField({ name: "aftercare", title: "Aftercare tips", type: "array", group: "details", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "faqs", title: "Questions", type: "array", group: "details", of: [defineArrayMember({ type: "qa" })] }),

    defineField({ name: "seo", title: "Google preview", type: "seo", group: "seo" }),
  ],
  orderings: [{ title: "Position", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "summary", media: "image" } },
});

export const doctor = defineType({
  name: "doctor",
  title: "Doctor",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "photo", type: "photo" }),
    defineField({ name: "qualifications", title: "Degrees", type: "string", description: "e.g. \"BDS, MDS (Periodontology)\"" }),
    defineField({ name: "role", title: "Speciality / role", type: "string" }),
    defineField({ name: "experienceYears", title: "Years of experience", type: "number", validation: (r) => r.min(0).integer() }),
    defineField({ name: "registration", title: "Dental council registration no.", type: "string" }),
    defineField({ name: "bio", title: "About the doctor", type: "richText" }),
    defineField({ name: "highlights", title: "Key points", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "order", title: "Position", type: "number", initialValue: 1 }),
  ],
  orderings: [{ title: "Position", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});
