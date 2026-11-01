import Link from "next/link";
import { CalendarDays, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { telHref, waHref } from "@/lib/utils";

/** Bottom bar on phones: the three things patients actually want to do. */
export function MobileBar({ phone, whatsapp }: { phone?: string | null; whatsapp?: string | null }) {
  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[0.75rem] font-semibold";
  return (
    <nav aria-label="Quick actions" className="fixed inset-x-3 bottom-3 z-40 flex overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-lift backdrop-blur-xl md:hidden" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
      {phone && (
        <a href={telHref(phone)} className={`${item} text-ink`}>
          <Phone className="size-5 text-brand-600" />
          Call
        </a>
      )}
      {whatsapp && (
        <a href={waHref(whatsapp)} target="_blank" rel="noopener noreferrer" className={`${item} text-ink`}>
          <WhatsAppIcon className="text-whatsapp-dark" />
          WhatsApp
        </a>
      )}
      <Link href="/book" className={`${item} bg-brand-600 text-white`}>
        <CalendarDays className="size-5" />
        Book a visit
      </Link>
    </nav>
  );
}
