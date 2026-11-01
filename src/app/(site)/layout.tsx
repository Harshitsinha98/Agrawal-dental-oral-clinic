import "../globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { getSettings, getTreatments } from "@/lib/content";
import { clinicJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBar } from "@/components/layout/mobile-bar";
import { NoticeBar } from "@/components/layout/notice-bar";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: s.seo?.title || s.clinicName, template: `%s | ${s.shortName || s.clinicName}` },
    description: s.seo?.description ?? undefined,
    openGraph: { siteName: s.clinicName, locale: "en_IN", type: "website" },
  };
}

export const viewport: Viewport = { themeColor: "#f5f9fc" };

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, treatments] = await Promise.all([getSettings(), getTreatments()]);

  return (
    <Providers>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-lift">
        Skip to content
      </a>
      {settings.notice?.enabled && <NoticeBar text={settings.notice.text} />}
      <Header name={settings.clinicName} logo={settings.logo} phone={settings.phone} />
      <main id="main" className="-mt-[76px]">
        {children}
      </main>
      <Footer settings={settings} treatments={treatments} />
      <MobileBar phone={settings.phone} whatsapp={settings.whatsapp} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd(settings)).replace(/</g, "\\u003c") }} />
    </Providers>
  );
}
