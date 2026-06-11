"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { api, NextPoll } from "@/lib/api";

/* "Next sweep in m:ss" — when the poller will next look at Instagram. */
export function NextPollCountdown() {
  const [next, setNext] = useState<NextPoll | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const load = () => api<NextPoll>("poller/next").then(setNext).catch(() => {});
    load();
    const refetch = setInterval(load, 60_000);
    const tick = setInterval(() => setNow(Date.now()), 1_000);
    return () => {
      clearInterval(refetch);
      clearInterval(tick);
    };
  }, []);

  if (!next) return null;

  let label: string;
  if (next.status !== "running") {
    label = "paused";
  } else if (!next.next_poll_at) {
    label = "first sweep soon";
  } else {
    const remaining = Math.floor((new Date(next.next_poll_at).getTime() - now) / 1000);
    if (remaining <= 0) {
      label = "sweeping now…";
    } else {
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      label = `next sweep in ${m}:${String(s).padStart(2, "0")}`;
    }
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/60 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-dim">
      <RefreshCw className={`size-3 text-copper-400 ${label === "sweeping now…" ? "animate-spin" : ""}`} />
      {label}
    </span>
  );
}
