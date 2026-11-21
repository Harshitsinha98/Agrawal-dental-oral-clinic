import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import type { Settings, Treatment } from "@/lib/types";
import { formatSessions, weekHours } from "@/lib/hours";
import { formatPhone, telHref, waHref } from "@/lib/utils";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/ui/icons";
import { Aurora } from "@/components/fx/aurora";
import { Logo } from "./logo";
import { NAV } from "@/lib/nav";

export function Footer({ settings, treatments }: { settings: Settings; treatments: Treatment[] }) {
  const s = settings;
  const social = [
    { href: s.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: s.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: s.youtube, label: "YouTube", Icon: YouTubeIcon },
  ].filter((x) => x.href);
  const phones = [s.phone, ...(s.otherPhones ?? [])].filter((p): p is string => Boolean(p));

  // Group consecutive days with the same timings: "Mon – Sat".
  const groups: { days: string; time: string }[] = [];
  for (const d of weekHours(s.hours)) {
    const time = formatSessions(d.hours);
    const last = groups.at(-1);
    if (last && last.time === time) last.days = `${last.days.split(" – ")[0]} – ${d.short}`;
    else groups.push({ days: d.short, time });
  }

  return (
    <footer className="relative isolate overflow-hidden bg-brand-950 pb-28 text-white/75 md:pb-10">
      <Aurora intensity="soft" className="-z-10" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/60 to-transparent" />

      <div className="container-page pt-20">
        <p className="font-display max-w-3xl text-4xl font-medium leading-tight text-white sm:text-5xl">
          Specialist care for every <em className="text-gold italic">smile</em> in the family.
        </p>
      </div>

      <div className="container-page mt-14 grid gap-12 border-t border-white/10 pt-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo logo={s.logo} name={s.clinicName} invert />
          {s.tagline && <p className="mt-5 max-w-xs leading-relaxed text-white/60">{s.tagline}</p>}
          {social.length > 0 && (
            <ul className="mt-6 flex gap-2">
              {social.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href!} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-11 place-items-center rounded-full bg-white/8 text-white ring-1 ring-white/10 transition-colors hover:bg-gold-300 hover:text-brand-950">
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-4">
          <div>
            <h2 className="eyebrow text-gold-300">Clinic</h2>
            <ul className="mt-5 space-y-2.5 text-[0.9375rem]">
              {NAV.slice(1).map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="transition-colors hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/book" className="transition-colors hover:text-white">
                  Book a visit
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-gold-300">Treatments</h2>
            <ul className="mt-5 space-y-2.5 text-[0.9375rem]">
              {treatments.slice(0, 8).map((t) => (
                <li key={t.slug}>
                  <Link href={`/treatments/${t.slug}`} className="transition-colors hover:text-white">
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5 text-[0.9375rem] md:col-span-4">
          <h2 className="eyebrow text-gold-300">Visit</h2>
          <p className="flex gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-gold-300" />
            <span>
              {s.address}
              {s.landmark && <span className="block text-white/50">{s.landmark}</span>}
            </span>
          </p>
          {phones.length > 0 && (
            <p className="flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-gold-300" />
              <span className="flex flex-col gap-1">
                {phones.map((p) => (
                  <a key={p} href={telHref(p)} className="hover:text-white">
                    {formatPhone(p)}
                  </a>
                ))}
              </span>
            </p>
          )}
          {s.whatsapp && (
            <a href={waHref(s.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-white">
              <WhatsAppIcon className="text-gold-300" />
              WhatsApp {formatPhone(s.whatsapp)}
            </a>
          )}
          {s.email && (
            <a href={`mailto:${s.email}`} className="flex gap-3 hover:text-white">
              <Mail className="size-5 shrink-0 text-gold-300" />
              {s.email}
            </a>
          )}
          <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 border-t border-white/10 pt-5">
            {groups.map((g) => (
              <div key={g.days} className="contents">
                <dt className="text-white/50">{g.days}</dt>
                <dd>{g.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="container-page mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {s.clinicName}
        </p>
        <p>The information on this site is general and does not replace a dental examination.</p>
      </div>
    </footer>
  );
}
