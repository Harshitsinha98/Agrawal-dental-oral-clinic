import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, Share2, UserRound } from "lucide-react";
import { getPost, getPosts, getSettings, getTreatments } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { formatPostDate, readingMinutes } from "@/lib/blog";
import { imgUrl } from "@/lib/image";
import { siteUrl } from "@/lib/utils";
import { PageHero } from "@/components/layout/page-hero";
import { PostCard } from "@/components/blog/post-card";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/ui/rich-text";
import { Reveal } from "@/components/ui/motion";
import { Cta } from "@/components/home/cta";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  return pageMetadata({ title: p.title, description: p.excerpt, path: `/blog/${p.slug}`, seo: p.seo?.title || p.seo?.description || p.seo?.image ? p.seo : p.cover ? { image: p.cover } : null });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, all, settings, treatments] = await Promise.all([getPost(slug), getPosts(), getSettings(), getTreatments()]);
  if (!post) notFound();

  const minutes = readingMinutes(post.body);
  const treatment = post.treatmentSlug ? treatments.find((t) => t.slug === post.treatmentSlug) : null;
  const related = [...all.filter((p) => p.slug !== post.slug && p.category === post.category), ...all.filter((p) => p.slug !== post.slug && p.category !== post.category)].slice(0, 3);
  const url = `${siteUrl}/blog/${post.slug}`;
  const byline = post.author?.name ?? settings.clinicName;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    mainEntityOfPage: url,
    image: imgUrl(post.cover, 1200) ? [new URL(imgUrl(post.cover, 1200)!, siteUrl).toString()] : undefined,
    author: { "@type": post.author ? "Person" : "Organization", name: byline },
    publisher: { "@type": "Organization", name: settings.clinicName },
  };

  return (
    <>
      <PageHero eyebrow={post.category} title={post.title} intro={post.excerpt} crumbs={[{ href: "/blog", label: "Blog" }, { href: `/blog/${post.slug}`, label: "Article" }]} image={post.cover}>
        <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
          <span className="inline-flex items-center gap-2">
            <UserRound className="size-4 text-gold-300" />
            {byline}
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4 text-gold-300" />
            <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4 text-gold-300" />
            {minutes} min read
          </span>
        </p>
      </PageHero>

      <section className="py-14 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
          <article className="min-w-0 max-w-3xl">
            <Reveal>
              <RichText value={post.body} className="text-lg" />
            </Reveal>
            {treatment && (
              <Reveal className="mt-14 rounded-[1.75rem] bg-brand-950 p-7 text-white sm:p-9">
                <p className="eyebrow text-gold-300">Related treatment</p>
                <h2 className="font-display mt-3 text-3xl font-medium">{treatment.title}</h2>
                <p className="mt-3 text-white/70">{treatment.summary}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={`/book?treatment=${treatment.slug}`} variant="gold">
                    Book for {treatment.title.toLowerCase()}
                  </Button>
                  <Button href={`/treatments/${treatment.slug}`} variant="glass" arrow={false}>
                    Read about the treatment
                  </Button>
                </div>
              </Reveal>
            )}
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.75rem] border border-line bg-white p-6 shadow-soft">
              <p className="font-display text-xl text-ink">Worried about something?</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">Describe it on the booking form. The doctors will look at it and explain your options.</p>
              <Button href={post.treatmentSlug ? `/book?treatment=${post.treatmentSlug}` : "/book"} className="mt-5 w-full">
                Book a visit
              </Button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${post.title}\n${url}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-line text-sm font-semibold text-ink hover:border-gold-300"
              >
                <Share2 className="size-4 text-gold-600" />
                Share on WhatsApp
              </a>
            </div>
            <Link href="/blog" className="mt-5 inline-block px-1 text-sm font-semibold text-brand-800 hover:text-gold-700">
              ← All articles
            </Link>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-pearl py-16 sm:py-20">
          <div className="container-page">
            <h2 className="font-display mb-8 text-3xl font-medium text-ink sm:text-4xl">Keep reading</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Cta heading="Your smile deserves a specialist." intro="Send a booking request on WhatsApp and we'll reply with a time that suits you." phone={settings.phone} image={settings.pageImages?.book} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
