import { z } from "zod";

export const TIME_OPTIONS = [
  { value: "morning", label: "Morning" },
  { value: "evening", label: "Evening" },
  { value: "any", label: "Any time" },
] as const;

export const VISIT_OPTIONS = [
  { value: "new", label: "First visit" },
  { value: "returning", label: "Been here before" },
] as const;

/** "+91 98765-43210", "098765 43210" → "9876543210" */
export function normalisePhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return d;
}

/** Today in India as yyyy-mm-dd. */
export function todayIso(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(d);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(`${iso}T12:00:00+05:30`));
}

export const MAX_DAYS_AHEAD = 60;

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter the patient's name").max(60, "Please keep the name under 60 characters"),
  phone: z
    .string()
    .transform(normalisePhone)
    .refine((v) => /^[6-9]\d{9}$/.test(v), "Enter a 10-digit mobile number"),
  treatment: z.string().min(1, "Choose a treatment, or \"Not sure\""),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date")
    .refine((v) => v >= todayIso(), "This date has passed")
    .refine((v) => v <= todayIso(MAX_DAYS_AHEAD), `Choose a date within the next ${MAX_DAYS_AHEAD} days`),
  time: z.enum(["morning", "evening", "any"]),
  visit: z.enum(["new", "returning"]),
  note: z.string().trim().max(300, "Please keep this under 300 characters").optional(),
});

export type Booking = z.infer<typeof bookingSchema>;

export function bookingMessage(b: Booking, treatmentLabel: string) {
  const lines = [
    "Hello, I'd like to book an appointment.",
    "",
    `*Name:* ${b.name}`,
    `*Mobile:* ${b.phone}`,
    `*Treatment:* ${treatmentLabel}`,
    `*Preferred date:* ${b.date ? formatDate(b.date) : "…"}`,
    `*Preferred time:* ${TIME_OPTIONS.find((t) => t.value === b.time)?.label}`,
    `*Visit:* ${VISIT_OPTIONS.find((v) => v.value === b.visit)?.label}`,
  ];
  if (b.note) lines.push(`*Problem:* ${b.note}`);
  lines.push("", "_Sent from the clinic website_");
  return lines.join("\n");
}
