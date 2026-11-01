import type { DayHours, DayKey } from "./types";

export const DAYS: { key: DayKey; short: string; long: string }[] = [
  { key: "mon", short: "Mon", long: "Monday" },
  { key: "tue", short: "Tue", long: "Tuesday" },
  { key: "wed", short: "Wed", long: "Wednesday" },
  { key: "thu", short: "Thu", long: "Thursday" },
  { key: "fri", short: "Fri", long: "Friday" },
  { key: "sat", short: "Sat", long: "Saturday" },
  { key: "sun", short: "Sun", long: "Sunday" },
];

/** "17:00" → "5 pm", "10:30" → "10:30 am". */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")} ${suffix}` : `${hour} ${suffix}`;
}

export function formatSessions(day: DayHours | undefined) {
  if (!day || day.closed || !day.sessions?.length) return "Closed";
  return day.sessions.map((s) => `${formatTime(s.from)} – ${formatTime(s.to)}`).join(", ");
}

/** Hours sorted Monday → Sunday, with any missing day treated as closed. */
export function weekHours(hours: DayHours[]) {
  return DAYS.map((d) => ({ ...d, hours: hours.find((h) => h.day === d.key) }));
}

/** Current day and minutes in India, regardless of the visitor's or server's time zone. */
export function nowInIndia(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dayIndex = DAYS.findIndex((d) => d.short === get("weekday"));
  return { dayIndex, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export type OpenStatus = { open: boolean; label: string };

export function openStatus(hours: DayHours[], date = new Date()): OpenStatus | null {
  if (!hours.length) return null;
  const { dayIndex, minutes } = nowInIndia(date);
  const week = weekHours(hours);
  const today = week[dayIndex]?.hours;

  if (today && !today.closed) {
    for (const s of today.sessions ?? []) {
      if (minutes >= toMinutes(s.from) && minutes < toMinutes(s.to)) return { open: true, label: `Open now · until ${formatTime(s.to)}` };
      if (minutes < toMinutes(s.from)) return { open: false, label: `Closed now · opens ${formatTime(s.from)}` };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const next = week[(dayIndex + i) % 7];
    const first = !next.hours?.closed && next.hours?.sessions?.[0];
    if (first) return { open: false, label: `Closed now · opens ${formatTime(first.from)} ${i === 1 ? "tomorrow" : next.short}` };
  }
  return null;
}

/** True if the clinic has no timings on the given ISO date (yyyy-mm-dd). */
export function isClosedOn(hours: DayHours[], isoDate: string) {
  const d = new Date(`${isoDate}T12:00:00+05:30`);
  const idx = (d.getUTCDay() + 6) % 7; // Monday = 0
  const day = hours.find((h) => h.day === DAYS[idx].key);
  return !day || Boolean(day.closed) || !day.sessions?.length;
}
