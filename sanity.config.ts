"use client";

/**
 * Sanity Studio, mounted at /studio inside the website.
 * Doctors log in with their Sanity account (Google or email + password).
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool, type StructureResolver } from "sanity/structure";
import { ActivityIcon } from "@sanity/icons/Activity";
import { UsersIcon } from "@sanity/icons/Users";
import { apiVersion, dataset, projectId, studioBasePath } from "./src/sanity/env";
import { schemaTypes, singletonTypes } from "./src/sanity/schemas";

const singletons = new Set<string>(singletonTypes);

const structure: StructureResolver = (S) => {
  const single = (type: string, title: string) => S.documentTypeListItem(type).title(title).child(S.document().schemaType(type).documentId(type).title(title));

  return S.list()
    .title("Website content")
    .items([
      single("homepage", "Home page"),
      single("settings", "Clinic details, timings & WhatsApp"),
      S.divider(),
      S.documentTypeListItem("treatment").title("Treatments").icon(ActivityIcon).child(S.documentTypeList("treatment").title("Treatments").defaultOrdering([{ field: "order", direction: "asc" }])),
      S.documentTypeListItem("doctor").title("Doctors").icon(UsersIcon),
      S.divider(),
      single("gallery", "Gallery & before/after"),
      single("reviews", "Patient reviews"),
      single("faqs", "Questions (FAQ)"),
      single("aboutPage", "About page"),
    ]);
};

export default defineConfig({
  name: "agrawal-dental",
  title: "Agrawal Dental — Website",
  basePath: studioBasePath,
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons cannot be created from the "+" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.has(schemaType)),
  },
  document: {
    // Singletons can only be edited and published, never duplicated or deleted.
    actions: (actions, { schemaType }) =>
      singletons.has(schemaType) ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action)) : actions,
    newDocumentOptions: (prev) => prev.filter((item) => !singletons.has(item.templateId)),
  },
  plugins: [structureTool({ structure }), ...(process.env.NODE_ENV === "development" ? [visionTool({ defaultApiVersion: apiVersion })] : [])],
});
