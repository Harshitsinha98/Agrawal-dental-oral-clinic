"use client";

/**
 * A one-line booking form (name, mobile, treatment). Like the full booking page, it
 * stores nothing: "Book now" opens WhatsApp with a ready message to the clinic.
 * Without a WhatsApp number it links to the booking page instead.
 */

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { normalisePhone } from "@/lib/booking";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn, waHref } from "@/lib/utils";

const field = "h-12 w-full rounded-xl border border-line bg-white px-4 text-[0.9375rem] text-ink placeholder:text-ink-mute focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200";

export function QuickBooking({
  heading,
  intro,
  buttonLabel,
  whatsapp,
  options,
  kind = "booking",
  className,
}: {
  heading?: string | null;
  intro?: string | null;
  buttonLabel?: string | null;
  whatsapp?: string | null;
  /** Treatments for the booking form. Leave empty for the camp request form. */
  options?: { slug: string; title: string }[];
  kind?: "booking" | "camp";
  className?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [choice, setChoice] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const mobile = normalisePhone(phone);
    if (name.trim().length < 2) return setError(kind === "camp" ? "Please enter the name of your school, society or company." : "Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(mobile)) return setError("Enter a 10-digit mobile number.");
    setError(null);
    const treatment = options?.find((o) => o.slug === choice)?.title;
    const text =
      kind === "camp"
        ? `Hello, we'd like to request a free dental camp.\n\n*Organisation:* ${name.trim()}\n*Mobile:* ${mobile}\n\n_Sent from the clinic website_`
        : `Hello, I'd like to book an appointment.\n\n*Name:* ${name.trim()}\n*Mobile:* ${mobile}\n*Treatment:* ${treatment ?? "Not sure / Check-up"}\n\n_Sent from the clinic website_`;
    window.open(waHref(whatsapp, text), "_blank", "noopener,noreferrer");
  };

  return (
    <div className={cn("rounded-[1.75rem] border border-gold-100 bg-gradient-to-r from-gold-50 via-white to-brand-50 p-6 shadow-soft sm:p-8", className)}>
      <div className="grid items-center gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-8">
        <div>
          {heading && <h2 className="font-display text-2xl font-medium leading-tight text-ink sm:text-3xl">{heading}</h2>}
          {intro && <p className="mt-2 text-ink-soft">{intro}</p>}
        </div>
        {whatsapp ? (
          <form onSubmit={submit} noValidate className={cn("grid gap-3 sm:grid-cols-2", options?.length ? "lg:grid-cols-[1fr_1fr_1.35fr_auto]" : "lg:grid-cols-[1.5fr_1fr_auto]")}>
            <label className="sr-only" htmlFor={`${kind}-name`}>
              {kind === "camp" ? "School, society or company" : "Your name"}
            </label>
            <input id={`${kind}-name`} value={name} onChange={(e) => setName(e.target.value)} placeholder={kind === "camp" ? "School / society / company" : "Your name"} autoComplete={kind === "camp" ? "organization" : "name"} className={field} />
            <label className="sr-only" htmlFor={`${kind}-phone`}>
              Mobile number
            </label>
            <input id={`${kind}-phone`} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile number" inputMode="tel" autoComplete="tel" className={field} />
            {options?.length ? (
              <>
                <label className="sr-only" htmlFor={`${kind}-treatment`}>
                  Treatment
                </label>
                <span className="relative">
                  <select id={`${kind}-treatment`} value={choice} onChange={(e) => setChoice(e.target.value)} className={cn(field, "appearance-none pr-10")}>
                    <option value="">Not sure / Check-up</option>
                    {options.map((o) => (
                      <option key={o.slug} value={o.slug}>
                        {o.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-mute" />
                </span>
              </>
            ) : null}
            <button type="submit" className={cn("inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-950 px-6 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand-800", !options?.length && "sm:col-span-2 lg:col-span-1")}>
              <WhatsAppIcon className="size-5 text-whatsapp" />
              {buttonLabel || "Book now"}
            </button>
            {error && (
              <p role="alert" className="text-sm font-medium text-logo-red sm:col-span-2 lg:col-span-full">
                {error}
              </p>
            )}
          </form>
        ) : (
          <Link href="/book" className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-950 px-6 font-semibold text-white">
            {buttonLabel || "Book now"}
          </Link>
        )}
      </div>
    </div>
  );
}
