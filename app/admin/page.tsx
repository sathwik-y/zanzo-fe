"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Loader2,
  PlayCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AdminUserRow, api, PollerStatus, Stats } from "@/lib/api";
import { BotAccounts } from "@/components/bot-accounts";
import { EngagementSettings } from "@/components/engagement-settings";
import { useUser } from "@/lib/use-user";

export default function AdminPage() {
  const { user, loading, isAdmin } = useUser();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [poller, setPoller] = useState<PollerStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resuming, setResuming] = useState(false);

  const load = useCallback(async () => {
    try {
      const [s, u, p] = await Promise.all([
        api<Stats>("admin/stats"),
        api<AdminUserRow[]>("admin/users"),
        api<PollerStatus>("poller/status"),
      ]);
      setStats(s);
      setUsers(u);
      setPoller(p);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to load");
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [isAdmin, load]);

  async function resume() {
    setResuming(true);
    try {
      setPoller(await api<PollerStatus>("poller/resume", { method: "POST" }));
    } finally {
      setResuming(false);
    }
  }

  if (loading) return null;
  if (!user || !isAdmin) {
    return (
      <div className="mt-12 text-center text-sm text-zinc-500">
        This page needs admin access.
      </div>
    );
  }

  const challenge = poller?.status === "challenge_required";

  return (
    <div className="max-w-4xl">
      <h1 className="flex items-center gap-2 font-display text-3xl tracking-tight">
        <ShieldCheck className="size-6 text-copper-400" /> Admin
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        Instance-wide stats, users, poller health and auto-engagement controls.
      </p>

      {error && (
        <div className="mt-6 rounded-lg border border-clay-500/30 bg-clay-500/10 p-4 text-sm text-clay-300">
          Backend unreachable: {error}
        </div>
      )}

      <section className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="font-medium">Instance stats</h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Stat label="Items total" value={stats?.total_items ?? "—"} />
          <Stat label="Last 7 days" value={stats?.items_last_7_days ?? "—"} />
          <Stat label="Failed" value={stats?.failed_count ?? "—"} />
          <Stat label="AI spend (month)" value={stats ? `$${stats.llm_cost_month_usd.toFixed(3)}` : "—"} />
        </dl>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="flex items-center gap-2 font-medium">
          <Users className="size-4 text-copper-400" /> Users
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-zinc-500">
              <tr className="border-b border-zinc-800">
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Role</th>
                <th className="py-2 pr-4 font-medium">Instagram</th>
                <th className="py-2 pr-4 font-medium">Bot</th>
                <th className="py-2 pr-4 font-medium">Items</th>
                <th className="py-2 pr-4 font-medium">Joined</th>
                <th className="py-2 font-medium">Last login</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-zinc-800/50 text-zinc-300">
                  <td className="py-2.5 pr-4">
                    {u.email}
                    {u.display_name && (
                      <span className="ml-2 text-xs text-zinc-600">{u.display_name}</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-xs ${
                        u.role === "ADMIN"
                          ? "bg-copper-500/15 text-copper-300"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {u.role.toLowerCase()}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">
                    {u.ig_username ? (
                      <span className={u.ig_verified ? "text-sage-300" : "text-ochre-300"}>
                        @{u.ig_username}
                        {!u.ig_verified && " (unverified)"}
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4">
                    {u.bot_username ? (
                      <span className="font-mono text-xs text-zinc-400">@{u.bot_username}</span>
                    ) : (
                      <span className="text-zinc-600">env</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4">{u.item_count}</td>
                  <td className="py-2.5 pr-4 text-zinc-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 text-zinc-500">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-zinc-600">
                    no users yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-medium">
            <Activity className="size-4 text-copper-400" /> Instagram poller
          </h2>
          {poller &&
            (challenge ? (
              <span className="flex items-center gap-1.5 text-sm text-ochre-300">
                <AlertCircle className="size-4" /> needs attention
              </span>
            ) : poller.status === "running" ? (
              <span className="flex items-center gap-1.5 text-sm text-sage-300">
                <CheckCircle2 className="size-4" /> running
              </span>
            ) : (
              <span className="text-sm text-zinc-400">{poller.status}</span>
            ))}
        </div>

        {challenge && (
          <div className="mt-4 rounded-lg border border-ochre-500/30 bg-ochre-500/10 p-4 text-sm text-ochre-200">
            <p className="font-medium">Instagram is asking for manual verification.</p>
            <p className="mt-1 text-ochre-200/80">
              Open Instagram, log into the bot account, approve the login (&quot;It was me&quot;),
              then click resume.
            </p>
            <button
              onClick={resume}
              disabled={resuming}
              className="mt-3 flex items-center gap-2 rounded-lg bg-ochre-500/20 px-3 py-1.5 text-ochre-100 hover:bg-ochre-500/30 disabled:opacity-50"
            >
              {resuming ? <Loader2 className="size-4 animate-spin" /> : <PlayCircle className="size-4" />}
              Resume poller
            </button>
          </div>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Stat label="Last run" value={poller?.last_run_at ? new Date(poller.last_run_at).toLocaleTimeString() : "—"} />
          <Stat label="New last run" value={poller?.last_new_items ?? "—"} />
          <Stat label="Queue depth" value={poller?.queue_depth ?? "—"} />
          <Stat label="Status" value={poller?.status ?? "—"} />
        </dl>
        {poller?.last_error && !challenge && (
          <p className="mt-3 text-xs text-clay-300/80">last error: {poller.last_error}</p>
        )}
      </section>

      <BotAccounts />

      <EngagementSettings />
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
