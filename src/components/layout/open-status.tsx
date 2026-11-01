"use client";

import { useEffect, useState } from "react";
import { openStatus, type OpenStatus as Status } from "@/lib/hours";
import type { DayHours } from "@/lib/types";
import { cn } from "@/lib/utils";

/** "Open now · until 2 pm". Rendered after mount, so the time is the visitor's real time, not the build time. */
export function OpenStatus({ hours, className }: { hours: DayHours[]; className?: string }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const tick = () => setStatus(openStatus(hours));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  if (!status) return <span className={cn("inline-block h-5", className)} aria-hidden />;

  return (
    <span className={cn("inline-flex items-center gap-2 text-sm font-semibold", status.open ? "text-mint-700" : "text-ink-soft", className)}>
      <span className="relative flex size-2.5">
        {status.open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint-400 opacity-60" />}
        <span className={cn("relative inline-flex size-2.5 rounded-full", status.open ? "bg-mint-500" : "bg-ink-mute/50")} />
      </span>
      {status.label}
    </span>
  );
}
