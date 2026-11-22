import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { SanityImage } from "@/components/ui/sanity-image";
import { formatPostDate, readingMinutes } from "@/lib/blog";
import { cn } from "@/lib/utils";

/** Blog card: cover photo, category, title and summary. `feature` makes it a wide card for the first post. */
export function PostCard({ post, feature = false, className }: { post: BlogPost; feature?: boolean; className?: string }) {
  const minutes = readingMinutes(post.body);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex h-full overflow-hidden rounded-[1.75rem] border border-line bg-white transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-lift",
        feature ? "flex-col lg:flex-row" : "flex-col",
        className,
      )}
    >
      <div className={cn("relative shrink-0 overflow-hidden bg-mist", feature ? "aspect-[16/10] lg:aspect-auto lg:w-[55%]" : "aspect-[16/10]")}>
        <SanityImage image={post.cover} aspect={16 / 10} sizes={feature ? "(min-width: 1024px) 660px, 100vw" : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"} placeholderIcon="tooth" className="transition-transform duration-1000 ease-out-soft group-hover:scale-[1.05]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-900 shadow-soft">{post.category}</span>
      </div>
      <div className={cn("flex flex-1 flex-col p-6", feature && "lg:justify-center lg:p-10")}>
        <p className="flex items-center gap-2 text-sm text-ink-mute">
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5 text-gold-500" />
            {minutes} min read
          </span>
        </p>
        <h3 className={cn("font-display mt-3 font-medium leading-snug text-ink", feature ? "text-3xl lg:text-4xl" : "text-[1.4rem]")}>{post.title}</h3>
        <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand-800 group-hover:text-gold-700">
          Read article
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
