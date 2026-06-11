"use client";

import { useCallback, useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { api, CATEGORY_META, Stats } from "@/lib/api";
import { AccountSettings } from "@/components/account-settings";

export default function SettingsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setStats(await api<Stats>("stats"));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to load");
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Your account, Instagram link and library stats.
      </p>

      {error && (
        <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          Backend unreachable: {error}
        </div>
      )}

      <AccountSettings />

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="flex items-center gap-2 font-medium">
          <Wallet className="size-4 text-violet-400" /> Your library
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Stat label="Items total" value={stats?.total_items ?? "—"} />
          <Stat label="Last 7 days" value={stats?.items_last_7_days ?? "—"} />
          <Stat label="AI spend (month)" value={stats ? `$${stats.llm_cost_month_usd.toFixed(3)}` : "—"} />
          <Stat label="AI spend (total)" value={stats ? `$${stats.llm_cost_total_usd.toFixed(3)}` : "—"} />
        </dl>
        <div className="mt-5 space-y-2">
          {stats &&
            Object.entries(stats.by_category)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, count]) => {
                const meta = CATEGORY_META[cat] ?? CATEGORY_META.OTHER;
                const pct = stats.total_items ? Math.round((count / stats.total_items) * 100) : 0;
                return (
                  <div key={cat} className="flex items-center gap-3 text-sm">
                    <span className="w-28 text-zinc-400">{meta.label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800">
                      <div className="h-full rounded-full bg-violet-500/70" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-zinc-300">{count}</span>
                  </div>
                );
              })}
          {stats && stats.failed_count > 0 && (
            <p className="pt-2 text-xs text-red-300/80">
              {stats.failed_count} item{stats.failed_count === 1 ? "" : "s"} failed processing — see the Failed tab.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-zinc-800/50 px-3 py-2.5">
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="mt-0.5 font-medium text-zinc-200">{value}</dd>
    </div>
  );
}
