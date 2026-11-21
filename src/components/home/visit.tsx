import { Navigation, Phone, MapPin } from "lucide-react";
import type { Settings } from "@/lib/types";
import { formatSessions, weekHours } from "@/lib/hours";
import { formatPhone, telHref } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { OpenStatus } from "@/components/layout/open-status";
import { HoursTable } from "./hours-table";

export function mapEmbedSrc(s: Settings) {
  return `https://www.google.com/maps?q=${encodeURIComponent(`${s.clinicName}, ${s.address}`)}&output=embed`;
}

export function Visit({ settings: s, heading }: { settings: Settings; heading?: string | null }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
      <Reveal className="flex flex-col rounded-[2rem] border border-line bg-pearl p-7 shadow-soft sm:p-9">
        {heading && <h2 className="font-display text-4xl font-medium text-ink sm:text-5xl">{heading}</h2>}
        <OpenStatus hours={s.hours} className="mt-4" />

        <p className="mt-7 flex gap-3 text-[1.0625rem] leading-relaxed text-ink">
          <MapPin className="mt-1 size-5 shrink-0 text-gold-500" />
          <span>
            {s.address}
            {s.landmark && <span className="block text-ink-mute">{s.landmark}</span>}
          </span>
        </p>

        {!!s.otherPhones?.length && (
          <p className="mt-4 flex gap-3 text-[0.9375rem] text-ink-soft">
            <Phone className="mt-0.5 size-5 shrink-0 text-gold-500" />
            <span>
              {[s.phone, ...s.otherPhones].filter(Boolean).map((n, i) => (
                <a key={n} href={telHref(n)} className="hover:text-brand-700">
                  {i > 0 && " · "}
                  {formatPhone(n)}
                </a>
              ))}
            </span>
          </p>
        )}

        <HoursTable hours={weekHours(s.hours).map((d) => ({ key: d.key, label: d.long, time: formatSessions(d.hours) }))} className="mt-7" />
        {s.hoursNote && <p className="mt-4 rounded-2xl bg-gold-50 px-4 py-3 text-sm font-medium text-gold-700 ring-1 ring-gold-200">{s.hoursNote}</p>}

        <div className="mt-auto flex flex-wrap gap-3 pt-8">
          {s.mapsUrl && (
            <Button href={s.mapsUrl} variant="primary" icon={<Navigation className="size-4" />} arrow={false}>
              Get directions
            </Button>
          )}
          {s.phone && (
            <Button href={telHref(s.phone)!} variant="outline" icon={<Phone className="size-4" />}>
              {formatPhone(s.phone)}
            </Button>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-line bg-mist shadow-soft">
        <iframe
          title={`Map showing ${s.clinicName}`}
          src={mapEmbedSrc(s)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0 grayscale-[0.3]"
        />
      </Reveal>
    </div>
  );
}
