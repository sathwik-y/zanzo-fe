"use client";

import { useEffect, useState } from "react";
import { ServerOff } from "lucide-react";

/* Probes the backend through the proxy and shows a banner while it's down
   (e.g. the EC2 box is stopped outside demo hours). Rendered on auth pages
   and inside the app shell — never on the landing page. */
export function BackendBanner() {
  const [down, setDown] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function probe() {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 6000);
        const resp = await fetch("/api/backend/health", {
          cache: "no-store",
          signal: ctrl.signal,
        });
        clearTimeout(t);
        if (!cancelled) setDown(!resp.ok);
      } catch {
        if (!cancelled) setDown(true);
      }
    }

    probe();
    const interval = setInterval(probe, 30000);
    const onFocus = () => probe();
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  if (!down) return null;
  return (
    <div className="flex items-center justify-center gap-2.5 border-b border-ochre-500/30 bg-ochre-500/10 px-4 py-2.5 text-sm text-ochre-200">
      <ServerOff className="size-4 shrink-0" />
      Backend is inactive — please contact the admin.
    </div>
  );
}
