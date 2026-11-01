import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/**
 * Fetch published content. Pages are cached and refreshed either by the Sanity
 * webhook (/api/revalidate, instant on Publish) or, as a fallback, every 10 minutes.
 * Returns null instead of throwing, so the site still renders with default content
 * if Sanity is unreachable.
 */
export async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: 600, tags: ["sanity"] } });
  } catch (error) {
    console.error("[sanity] fetch failed:", error instanceof Error ? error.message : error);
    return null;
  }
}
