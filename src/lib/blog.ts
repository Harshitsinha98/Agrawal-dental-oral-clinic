import type { PortableTextBlock } from "next-sanity";

export function formatPostDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(iso));
}

/** Minutes to read, at about 200 words a minute. */
export function readingMinutes(body?: PortableTextBlock[] | null) {
  const words = (body ?? [])
    .flatMap((b) => ((b as { children?: { text?: string }[] }).children ?? []).map((c) => c.text ?? ""))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
