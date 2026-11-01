import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";

const indianMobile = /^[6-9]\d{9}$/;

export const settings = defineType({
  name: "settings",
  title: "Clinic details",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "clinic", title: "Clinic", default: true },
    { name: "contact", title: "Phone & WhatsApp" },
    { name: "hours", title: "Timings" },
    { name: "google", title: "Google & social" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "clinicName", title: "Clinic name", type: "string", group: "clinic", validation: (r) => r.required() }),
    defineField({ name: "shortName", title: "Short name (for small screens)", type: "string", group: "clinic" }),
    defineField({ name: "logo", title: "Logo", type: "image", group: "clinic", description: "PNG or SVG with a transparent background works best." }),
    defineField({ name: "tagline", title: "One line about the clinic", type: "string", group: "clinic" }),
    defineField({ name: "address", title: "Address", type: "text", rows: 3, group: "clinic", validation: (r) => r.required() }),
    defineField({ name: "landmark", title: "Landmark", type: "string", group: "clinic", description: "e.g. \"Near Minal Gate No. 2\"" }),
    defineField({
      name: "mapsUrl",
      title: "Google Maps link",
      type: "url",
      group: "clinic",
      description: "Open the clinic on Google Maps → Share → Copy link, and paste it here. Used for the Directions button.",
    }),
    defineField({
      name: "notice",
      title: "Notice bar",
      type: "object",
      group: "clinic",
      description: "A thin bar at the top of every page, e.g. \"Clinic closed on 14 Nov for Diwali\".",
      fields: [
        defineField({ name: "enabled", title: "Show the notice", type: "boolean", initialValue: false }),
        defineField({ name: "text", title: "Text", type: "string" }),
      ],
    }),

    defineField({
      name: "phone",
      title: "Phone number (for calls)",
      type: "string",
      group: "contact",
      description: "10-digit mobile or landline with STD code, without +91.",
      validation: (r) => r.regex(/^\d{10,11}$/, { name: "phone" }).error("Only digits, 10 or 11 of them, without +91 or spaces"),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number for bookings",
      type: "string",
      group: "contact",
      description: "Booking requests from the website arrive on this number. 10 digits, without +91.",
      validation: (r) => r.regex(indianMobile, { name: "mobile" }).error("A 10-digit Indian mobile number, without +91 or spaces"),
    }),
    defineField({ name: "email", title: "Email", type: "string", group: "contact", validation: (r) => r.email() }),

    defineField({
      name: "hours",
      title: "Weekly timings",
      type: "array",
      group: "hours",
      of: [defineArrayMember({ type: "dayHours" })],
      validation: (r) => r.max(7),
    }),
    defineField({ name: "hoursNote", title: "Note under timings", type: "string", group: "hours", description: "e.g. \"Emergency? Call before coming.\"" }),

    defineField({ name: "googleRating", title: "Google rating", type: "number", group: "google", validation: (r) => r.min(1).max(5).precision(1) }),
    defineField({ name: "googleReviewCount", title: "Number of Google reviews", type: "number", group: "google", validation: (r) => r.min(0).integer() }),
    defineField({ name: "googleReviewsUrl", title: "Link to Google reviews", type: "url", group: "google" }),
    defineField({ name: "instagram", title: "Instagram link", type: "url", group: "google" }),
    defineField({ name: "facebook", title: "Facebook link", type: "url", group: "google" }),
    defineField({ name: "youtube", title: "YouTube link", type: "url", group: "google" }),

    defineField({ name: "seo", title: "Default Google preview", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Clinic details" }) },
});
