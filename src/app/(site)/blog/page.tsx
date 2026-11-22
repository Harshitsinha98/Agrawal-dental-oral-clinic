import type { Metadata } from "next";
import { getBlogPage, getPosts, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";
import { BlogList } from "@/components/blog/blog-list";
import { Cta } from "@/components/home/cta";

export async function generateMetadata(): Promise<Metadata> {
  const b = await getBlogPage();
  return pageMetadata({ title: b.heading || "Blog", description: b.intro, path: "/blog", seo: b.seo });
}

export default async function BlogPage() {
  const [blog, posts, settings] = await Promise.all([getBlogPage(), getPosts(), getSettings()]);
  return (
    <>
      <PageHero eyebrow="Blog" title={blog.heading || "Dental insights"} intro={blog.intro} crumbs={[{ href: "/blog", label: "Blog" }]} image={blog.image} />
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <BlogList posts={posts} />
        </div>
      </section>
      <Cta heading="Have a question we haven't answered?" intro="Send it with a booking request on WhatsApp, or call the clinic. We're happy to explain." phone={settings.phone} image={settings.pageImages?.book} />
    </>
  );
}
