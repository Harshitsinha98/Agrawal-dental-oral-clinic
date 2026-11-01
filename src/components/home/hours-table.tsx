"use client";

import { useEffect, useState } from "react";
import { DAYS, nowInIndia } from "@/lib/hours";
import { cn } from "@/lib/utils";

/** Weekly timings with today highlighted (worked out in the browser, in India time). */
export function HoursTable({ hours, className }: { hours: { key: string; label: string; time: string }[]; className?: string }) {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(DAYS[nowInIndia().dayIndex]?.key ?? null), []);

  return (
    <dl className={cn("divide-y divide-line rounded-2xl border border-line", className)}>
      {hours.map((h) => (
        <div key={h.key} className={cn("flex justify-between gap-4 px-4 py-2.5 text-[0.9375rem]", today === h.key && "bg-brand-50/70 font-semibold")}>
          <dt className={today === h.key ? "text-brand-700" : "text-ink-soft"}>
            {h.label}
            {today === h.key && <span className="ml-2 text-xs font-semibold text-mint-600">Today</span>}
          </dt>
          <dd className={cn("text-right", h.time === "Closed" ? "text-ink-mute" : "text-ink")}>{h.time}</dd>
        </div>
      ))}
    </dl>
  );
}
