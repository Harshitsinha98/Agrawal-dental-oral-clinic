"use client";

/**
 * WhatsApp booking. Nothing is stored on a server: the form builds a message and
 * opens WhatsApp with it, addressed to the clinic's booking number. The patient
 * presses Send in WhatsApp. A live preview shows exactly what will be sent.
 */

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCheck, ChevronDown, Phone, RotateCcw } from "lucide-react";
import { bookingMessage, bookingSchema, MAX_DAYS_AHEAD, normalisePhone, TIME_OPTIONS, todayIso, VISIT_OPTIONS, type Booking } from "@/lib/booking";
import { isClosedOn } from "@/lib/hours";
import type { DayHours } from "@/lib/types";
import { cn, formatPhone, telHref, waHref } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";

type Option = { slug: string; title: string };
type Errors = Partial<Record<keyof Booking, string>>;

const NOT_SURE = { slug: "check-up", title: "Not sure / Check-up" };

export function BookingForm({ treatments, initialTreatment, whatsapp, phone, hours }: { treatments: Option[]; initialTreatment?: string; whatsapp?: string | null; phone?: string | null; hours: DayHours[] }) {
  const options = useMemo(() => [NOT_SURE, ...treatments], [treatments]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    treatment: options.some((o) => o.slug === initialTreatment) ? initialTreatment! : NOT_SURE.slug,
    date: "",
    time: "any" as Booking["time"],
    visit: "new" as Booking["visit"],
    note: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [quickDays, setQuickDays] = useState<{ iso: string; label: string; sub: string }[]>([]);

  // Next few open days as one-tap choices. Worked out in the browser, in India time.
  useEffect(() => {
    const days: { iso: string; label: string; sub: string }[] = [];
    for (let i = 0; i < 14 && days.length < 5; i++) {
      const iso = todayIso(i);
      if (isClosedOn(hours, iso)) continue;
      const d = new Date(`${iso}T12:00:00+05:30`);
      const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Intl.DateTimeFormat("en-IN", { weekday: "short", timeZone: "Asia/Kolkata" }).format(d);
      const sub = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }).format(d);
      days.push({ iso, label, sub });
    }
    setQuickDays(days);
  }, [hours]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as keyof Booking]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const treatmentLabel = options.find((o) => o.slug === form.treatment)?.title ?? NOT_SURE.title;
  const closedWarning = form.date && isClosedOn(hours, form.date) ? "The clinic is closed on this day. Please choose another date." : null;

  const preview = bookingMessage(
    {
      name: form.name.trim() || "…",
      phone: normalisePhone(form.phone) || "…",
      treatment: form.treatment,
      date: form.date,
      time: form.time,
      visit: form.visit,
      note: form.note.trim() || undefined,
    },
    treatmentLabel,
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = bookingSchema.safeParse({ ...form, note: form.note || undefined });
    const errs: Errors = {};
    if (!parsed.success) for (const issue of parsed.error.issues) errs[issue.path[0] as keyof Booking] ??= issue.message;
    if (!errs.date && closedWarning) errs.date = closedWarning;
    setErrors(errs);
    if (Object.keys(errs).length || !parsed.success) {
      const first = Object.keys(errs)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }

    const url = waHref(whatsapp, bookingMessage(parsed.data, treatmentLabel))!;
    setSentUrl(url);
    // Phones hand wa.me straight to the WhatsApp app; on a computer open it in a new tab.
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch) window.location.href = url;
    else window.open(url, "_blank", "noopener,noreferrer");
  }

  if (!whatsapp) {
    return (
      <div className="rounded-[2rem] border border-line bg-white p-8 text-center shadow-soft">
        <p className="text-lg font-semibold text-ink">Online booking will be available shortly.</p>
        <p className="mt-2 text-ink-soft">{phone ? "Please call the clinic to book a visit." : "Please visit the clinic during opening hours."}</p>
        {phone && (
          <Button href={telHref(phone)!} className="mt-6" icon={<Phone className="size-4" />}>
            {formatPhone(phone)}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
      <AnimatePresence mode="wait">
        {sentUrl ? (
          <motion.div key="sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-[2rem] border border-line bg-white p-8 shadow-soft sm:p-10">
            <span className="grid size-16 place-items-center rounded-2xl bg-mint-50 text-mint-600">
              <CheckCheck className="size-8" />
            </span>
            <h2 className="mt-6 text-2xl font-bold text-ink sm:text-3xl">Almost done: press Send in WhatsApp</h2>
            <p className="mt-3 text-lg leading-relaxed text-ink-soft">
              WhatsApp has opened with your request filled in. Once you press <strong className="text-ink">Send</strong>, the clinic will reply to confirm a time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={sentUrl} variant="whatsapp">
                Open WhatsApp again
              </Button>
              <Button variant="outline" icon={<RotateCcw className="size-4" />} onClick={() => setSentUrl(null)}>
                Change details
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} onSubmit={submit} noValidate className="space-y-7 rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Patient's name" error={errors.name}>
                <input id="f-name" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} className={input(errors.name)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} />
              </Field>
              <Field id="phone" label="Mobile number" error={errors.phone}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-medium text-ink-mute">+91</span>
                  <input
                    id="f-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={cn(input(errors.phone), "pl-14")}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "e-phone" : undefined}
                  />
                </div>
              </Field>
            </div>

            <Field id="treatment" label="What do you need?" error={errors.treatment}>
              <div className="relative">
                <select id="f-treatment" value={form.treatment} onChange={(e) => set("treatment", e.target.value)} className={cn(input(errors.treatment), "appearance-none pr-12")}>
                  {options.map((o) => (
                    <option key={o.slug} value={o.slug}>
                      {o.title}
                    </option>
                  ))}
                </select>
                <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-ink-mute" />
              </div>
            </Field>

            <fieldset>
              <legend className="mb-2.5 text-sm font-semibold text-ink">Preferred day</legend>
              <div className="flex flex-wrap gap-2">
                {quickDays.map((d) => (
                  <Chip key={d.iso} active={form.date === d.iso} onClick={() => set("date", d.iso)}>
                    <span className="block font-semibold">{d.label}</span>
                    <span className="block text-xs opacity-75">{d.sub}</span>
                  </Chip>
                ))}
                <label className={cn("relative flex min-w-[9rem] cursor-pointer flex-col justify-center rounded-2xl border px-4 py-2 text-left text-sm transition-colors", form.date && !quickDays.some((d) => d.iso === form.date) ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line bg-canvas text-ink hover:border-brand-200")}>
                  <span className="font-semibold">Other date</span>
                  <input
                    id="f-date"
                    type="date"
                    min={todayIso()}
                    max={todayIso(MAX_DAYS_AHEAD)}
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-xs outline-none"
                    aria-invalid={!!errors.date}
                    aria-describedby={errors.date ? "e-date" : undefined}
                  />
                </label>
              </div>
              {(errors.date || closedWarning) && (
                <p id="e-date" className="mt-2 text-sm font-medium text-red-600">
                  {errors.date ?? closedWarning}
                </p>
              )}
            </fieldset>

            <div className="grid gap-7 sm:grid-cols-2">
              <Segmented label="Preferred time" value={form.time} options={TIME_OPTIONS} onChange={(v) => set("time", v)} />
              <Segmented label="Visit" value={form.visit} options={VISIT_OPTIONS} onChange={(v) => set("visit", v)} />
            </div>

            <Field id="note" label="Tell us about the problem (optional)" error={errors.note} hint={`${form.note.length}/300`}>
              <textarea id="f-note" rows={3} maxLength={300} value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="e.g. Pain in a lower back tooth for 3 days" className={cn(input(errors.note), "h-auto resize-none py-3")} />
            </Field>

            <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-mute">Your details go only to the clinic&apos;s WhatsApp. Nothing is saved on this website.</p>
              <Button type="submit" variant="whatsapp" size="lg" className="shrink-0">
                Send on WhatsApp
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Live preview of the message, styled like a WhatsApp chat. */}
      <aside aria-label="Message preview" className="lg:sticky lg:top-28 lg:self-start">
        <div className="overflow-hidden rounded-[2rem] border border-line bg-[#efeae2] shadow-soft">
          <div className="flex items-center gap-3 bg-whatsapp-dark px-5 py-3.5 text-white">
            <span className="grid size-9 place-items-center rounded-full bg-white/15">
              <WhatsAppIcon className="size-5" />
            </span>
            <span className="text-sm leading-tight">
              <strong className="block">Clinic WhatsApp</strong>
              <span className="text-white/75">{formatPhone(whatsapp)}</span>
            </span>
          </div>
          <div className="p-5">
            <motion.div layout className="ml-auto max-w-[92%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-4 py-3 text-[0.875rem] leading-relaxed text-[#111b21] shadow-sm">
              <WaText text={preview} />
            </motion.div>
            <p className="mt-4 text-center text-xs text-[#54656f]">This is the message that will be sent.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

/** Renders WhatsApp *bold* and _italic_ in the preview. */
function WaText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*\n]+\*|_[^_\n]+_)/g).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <strong key={i}>{part.slice(1, -1)}</strong>
        ) : part.startsWith("_") && part.endsWith("_") ? (
          <em key={i} className="text-[#54656f]">
            {part.slice(1, -1)}
          </em>
        ) : (
          part
        ),
      )}
    </>
  );
}

const input = (error?: string) =>
  cn(
    "h-12 w-full rounded-2xl border bg-canvas px-4 text-base text-ink outline-none transition-colors placeholder:text-ink-mute/70 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100",
    error ? "border-red-400" : "border-line",
  );

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={`f-${id}`} className="text-sm font-semibold text-ink">
          {label}
        </label>
        {hint && <span className="text-xs text-ink-mute">{hint}</span>}
      </div>
      {children}
      {error && (
        <p id={`e-${id}`} className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn("min-w-[5.5rem] rounded-2xl border px-4 py-2 text-left text-sm transition-all", active ? "border-brand-600 bg-brand-600 text-white shadow-[0_6px_16px_-6px_rgb(30_90_168/0.6)]" : "border-line bg-canvas text-ink hover:border-brand-200")}
    >
      {children}
    </button>
  );
}

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-semibold text-ink">{label}</legend>
      <div className="flex rounded-2xl border border-line bg-canvas p-1">
        {options.map((o) => (
          <label key={o.value} className={cn("relative flex-1 cursor-pointer rounded-xl px-2 py-2.5 text-center text-sm font-semibold transition-colors", value === o.value ? "text-brand-700" : "text-ink-soft hover:text-ink")}>
            <input type="radio" name={label} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
            {value === o.value && <motion.span layoutId={`seg-${label}`} className="absolute inset-0 rounded-xl bg-white shadow-soft" transition={{ type: "spring", bounce: 0.2, duration: 0.45 }} />}
            <span className="relative">{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
