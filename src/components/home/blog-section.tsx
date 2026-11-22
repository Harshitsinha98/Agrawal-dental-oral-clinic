import type { BlogPost } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { PostCard } from "@/components/blog/post-card";

/** "Dental insights": the newest posts as cards, with a button to the full blog. */
export function BlogSection({ heading, intro, posts, buttonLabel }: { heading?: string | null; intro?: string | null; posts: BlogPost[]; buttonLabel?: string | null }) {
  if (!posts.length) return null;
  return (
    <Section>
      <SectionHeading eyebrow="From our blog" heading={heading} intro={intro} align="center" />
      <Stagger className="grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <StaggerItem key={p.slug}>
            <PostCard post={p} />
          </StaggerItem>
        ))}
      </Stagger>
      <div className="mt-10 flex justify-center">
        <Button href="/blog" variant="outline">
          {buttonLabel || "All articles"}
        </Button>
      </div>
    </Section>
  );
}
