"use client";

/** The blog page: category tabs, the featured post as a wide card, then a grid of the rest. */

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PostCard } from "./post-card";

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [filter, setFilter] = useState("all");
  const categories = useMemo(() => [...new Set(posts.map((p) => p.category))], [posts]);
  const shown = filter === "all" ? posts : posts.filter((p) => p.category === filter);
  const lead = filter === "all" ? (shown.find((p) => p.featured) ?? shown[0]) : null;
  const rest = lead ? shown.filter((p) => p !== lead) : shown;

  return (
    <div>
      {categories.length > 1 && (
        <div role="tablist" aria-label="Filter articles" className="no-scrollbar mb-10 flex gap-1 overflow-x-auto rounded-full border border-line bg-white p-1.5 shadow-soft sm:inline-flex sm:flex-wrap">
          {["all", ...categories].map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={cn("relative min-h-10 shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors", filter === c ? "text-gold-100" : "text-ink-soft hover:text-ink")}
            >
              {filter === c && <motion.span layoutId="blog-tab" className="absolute inset-0 rounded-full bg-brand-950" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
              <span className="relative">{c === "all" ? "All articles" : c}</span>
            </button>
          ))}
        </div>
      )}

      <motion.div layout className="space-y-6">
        <AnimatePresence mode="popLayout">
          {lead && (
            <motion.div key={`lead-${lead.slug}`} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <PostCard post={lead} feature />
            </motion.div>
          )}
        </AnimatePresence>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {rest.map((p) => (
              <motion.li key={p.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
                <PostCard post={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>
      {!shown.length && <p className="py-16 text-center text-ink-mute">No articles in this category yet.</p>}
    </div>
  );
}
