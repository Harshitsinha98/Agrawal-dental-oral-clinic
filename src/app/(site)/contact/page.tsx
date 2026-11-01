import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { getFaqs, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { formatPhone, telHref, waHref } from "@/lib/utils";
import { PageHero } from "@/components/layout/page-hero";
import { Visit } from "@/components/home/visit";
import { Faq } from "@/components/ui/faq";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Section, SectionHeading } from "@/components/ui/section";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({ title: "Contact & timings", description: `Address, timings, phone and directions for ${s.clinicName}. ${s.address}.`, path: "/contact" });
}

export default async function ContactPage() {
  const [s, faqs] = await Promise.all([getSettings(), getFaqs()]);
  const ways = [
    s.whatsapp && { href: waHref(s.whatsapp)!, label: "WhatsApp", value: formatPhone(s.whatsapp), icon: <WhatsAppIcon className="size-6" />, tone: "bg-mint-50 text-whatsapp-dark" },
    s.phone && { href: telHref(s.phone)!, label: "Call", value: formatPhone(s.phone), icon: <Phone className="size-6" />, tone: "bg-brand-50 text-brand-600" },
    s.email && { href: `mailto:${s.email}`, label: "Email", value: s.email, icon: <Mail className="size-6" />, tone: "bg-brand-50 text-brand-600" },
  ].filter(Boolean) as { href: string; label: string; value: string; icon: React.ReactNode; tone: string }[];

  return (
    <>
      <PageHero title="Contact & timings" intro="Call, send a WhatsApp message, or just walk in during clinic hours." crumbs={[{ href: "/contact", label: "Contact" }]} />

      {ways.length > 0 && (
        <section className="pb-6">
          <Stagger className="container-page grid gap-4 sm:grid-cols-3">
            {ways.map((w) => (
              <StaggerItem key={w.label}>
                <a href={w.href} {...(w.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex items-center gap-4 rounded-[1.75rem] border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <span className={`grid size-14 place-items-center rounded-2xl ${w.tone}`}>{w.icon}</span>
                  <span>
                    <span className="block text-sm text-ink-mute">{w.label}</span>
                    <span className="block font-bold text-ink">{w.value}</span>
                  </span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      <Section className="pt-10 sm:pt-12">
        <Visit settings={s} heading="Find the clinic" />
      </Section>

      {faqs.items.length > 0 && (
        <Section tone="white">
          <SectionHeading heading="Before you come" align="center" />
          <Faq items={faqs.items} className="mx-auto max-w-3xl" />
        </Section>
      )}
    </>
  );
}
