import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, CheckCircle2, Clock } from "lucide-react";
import { getSettings, getTreatment, getTreatments } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { DentalIcon } from "@/components/ui/icons";
import { Faq } from "@/components/ui/faq";
import { RichText } from "@/components/ui/rich-text";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SanityImage } from "@/components/ui/sanity-image";
import { TreatmentCard } from "@/components/treatments/treatment-card";
import { formatPhone, telHref } from "@/lib/utils";

export async function generateStaticParams() {
  return (await getTreatments()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = await getTreatment((await params).slug);
  if (!t) return {};
  return pageMetadata({ title: `${t.title} in Bhopal`, description: t.summary, path: `/treatments/${t.slug}`, seo: t.seo ?? (t.image ? { image: t.image } : null) });
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [t, all, settings] = await Promise.all([getTreatment(slug), getTreatments(), getSettings()]);
  if (!t) notFound();

  const others = all.filter((x) => x.slug !== t.slug).slice(0, 3);
  const facts = [
    t.duration && { icon: Clock, label: "Time per visit", value: t.duration },
    t.visits && { icon: CalendarClock, label: "Visits", value: t.visits },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string }[];

  return (
    <>
      <PageHero title={t.title} intro={t.summary} crumbs={[{ href: "/treatments", label: "Treatments" }]}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={`/book?treatment=${t.slug}`} size="lg" magnetic>
            Book for {t.title.toLowerCase()}
          </Button>
          {settings.phone && (
            <Button href={telHref(settings.phone)!} variant="outline" size="lg">
              Ask a question: {formatPhone(settings.phone)}
            </Button>
          )}
        </div>
      </PageHero>

      <section className="pb-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
          <div>
            {t.image?.asset?._id && (
              <Reveal className="relative mb-12 aspect-[16/9] overflow-hidden rounded-[2rem] bg-white shadow-soft">
                <SanityImage image={t.image} aspect={16 / 9} sizes="(min-width: 1024px) 760px, 100vw" priority />
              </Reveal>
            )}

            <Reveal>
              <RichText value={t.body} />
            </Reveal>

            {!!t.steps?.length && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-ink sm:text-3xl">How it's done</h2>
                <Stagger as="ol" className="mt-7 grid gap-4 sm:grid-cols-2">
                  {t.steps.map((s, i) => (
                    <StaggerItem as="li" key={s._key ?? i} className="relative rounded-[1.5rem] border border-line bg-white p-6">
                      <span className="text-5xl font-extrabold leading-none text-brand-100">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="mt-3 text-lg font-bold text-ink">{s.title}</h3>
                      {s.text && <p className="mt-1.5 leading-relaxed text-ink-soft">{s.text}</p>}
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            )}

            {!!t.aftercare?.length && (
              <Reveal className="mt-16 rounded-[2rem] bg-mint-50 p-7 sm:p-9">
                <h2 className="text-2xl font-bold text-ink">Afterwards</h2>
                <ul className="mt-5 space-y-3">
                  {t.aftercare.map((a) => (
                    <li key={a} className="flex gap-3 leading-relaxed text-ink-soft">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-mint-600" />
                      {a}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {!!t.faqs?.length && (
              <div className="mt-16">
                <h2 className="mb-6 text-2xl font-bold text-ink sm:text-3xl">Questions about {t.title.toLowerCase()}</h2>
                <Faq items={t.faqs} />
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] border border-line bg-white p-7 shadow-soft">
              <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <DentalIcon name={t.icon} className="size-7" />
              </span>
              {facts.length > 0 && (
                <dl className="mt-6 space-y-4">
                  {facts.map((f) => (
                    <div key={f.label} className="flex gap-3">
                      <f.icon className="mt-0.5 size-5 shrink-0 text-brand-500" />
                      <div>
                        <dt className="text-sm text-ink-mute">{f.label}</dt>
                        <dd className="font-semibold text-ink">{f.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              )}
              <p className="mt-6 text-sm leading-relaxed text-ink-mute">The exact plan, number of visits and cost are explained after your check-up.</p>
              <Button href={`/book?treatment=${t.slug}`} className="mt-6 w-full">
                Book a visit
              </Button>
            </div>
            <nav aria-label="Other treatments" className="mt-6 rounded-[2rem] border border-line bg-white p-3">
              <ul>
                {all.map((x) => (
                  <li key={x.slug}>
                    <Link
                      href={`/treatments/${x.slug}`}
                      aria-current={x.slug === t.slug ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-[0.9375rem] font-medium transition-colors ${x.slug === t.slug ? "bg-brand-50 text-brand-700" : "text-ink-soft hover:bg-canvas hover:text-ink"}`}
                    >
                      <DentalIcon name={x.icon} className="size-5" />
                      {x.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-line bg-white py-20">
          <div className="container-page">
            <h2 className="mb-8 text-2xl font-bold text-ink sm:text-3xl">Other treatments</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {others.map((o) => (
                <TreatmentCard key={o.slug} t={o} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
