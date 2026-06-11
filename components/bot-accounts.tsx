"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Bot, Loader2, Plus, Power, Trash2 } from "lucide-react";
import { api, BotRow } from "@/lib/api";

const STATUS_STYLE: Record<BotRow["status"], string> = {
  ACTIVE: "bg-sage-500/15 text-sage-300",
  CHALLENGE: "bg-ochre-500/15 text-ochre-300",
  DISABLED: "bg-zinc-800 text-zinc-500",
};

/* Admin: the pool of burner accounts users DM their reels to. New users are
   assigned to the least-loaded ACTIVE bot when they link their Instagram. */
export function BotAccounts() {
  const [bots, setBots] = useState<BotRow[]>([]);
  const [username, setUsername] = useState("");
  const [sessionid, setSessionid] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    api<BotRow[]>("admin/bots").then(setBots).catch(() => {});
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load]);

  async function addBot(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      setBots(
        await api<BotRow[]>("admin/bots", {
          method: "POST",
          body: JSON.stringify({ username, sessionid, note: note || undefined }),
        })
      );
      setUsername("");
      setSessionid("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(bot: BotRow) {
    setBots(
      await api<BotRow[]>(`admin/bots/${bot.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: bot.status === "DISABLED" ? "ACTIVE" : "DISABLED" }),
      })
    );
  }

  async function reactivate(bot: BotRow) {
    const fresh = window.prompt(
      `@${bot.username} hit an Instagram challenge. Approve the login in the app, ` +
        `then paste a fresh sessionid cookie (or leave as-is to retry with the old one):`,
      ""
    );
    if (fresh === null) return;
    setBots(
      await api<BotRow[]>(`admin/bots/${bot.id}`, {
        method: "PATCH",
        body: JSON.stringify(fresh.trim() ? { sessionid: fresh.trim() } : { status: "ACTIVE" }),
      })
    );
  }

  async function remove(bot: BotRow) {
    if (
      !window.confirm(
        `Delete @${bot.username}? Its ${bot.assigned_users} assigned user(s) will be respread across the remaining bots.`
      )
    )
      return;
    setBots(await api<BotRow[]>(`admin/bots/${bot.id}`, { method: "DELETE" }));
  }

  return (
    <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h2 className="flex items-center gap-2 font-medium">
        <Bot className="size-4 text-copper-400" /> Bot accounts
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        The burner accounts users DM reels to. New users are assigned to the least-loaded
        active bot; if a user DMs their verification code to a different bot, they re-bind to
        that one. With no bots here, the single account from <code>.env</code> is used.
      </p>

      <div className="mt-4 space-y-2">
        {bots.map((b) => (
          <div
            key={b.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-zinc-800 bg-zinc-950/40 px-4 py-3"
          >
            <span className="font-mono text-sm text-zinc-100">@{b.username}</span>
            <span className={`rounded-md px-1.5 py-0.5 text-xs ${STATUS_STYLE[b.status]}`}>
              {b.status.toLowerCase()}
            </span>
            <span className="text-xs text-zinc-500">
              {b.assigned_users} user{b.assigned_users === 1 ? "" : "s"}
            </span>
            <span className="text-xs text-zinc-600">
              last poll {b.last_poll_at ? new Date(b.last_poll_at).toLocaleTimeString() : "—"}
            </span>
            {b.note && <span className="text-xs text-zinc-600">· {b.note}</span>}
            <span className="ml-auto flex items-center gap-1">
              {b.status === "CHALLENGE" ? (
                <button
                  onClick={() => reactivate(b)}
                  className="flex items-center gap-1.5 rounded-lg bg-ochre-500/20 px-2.5 py-1.5 text-xs text-ochre-200 hover:bg-ochre-500/30"
                >
                  <AlertCircle className="size-3.5" /> Resolve challenge
                </button>
              ) : (
                <button
                  onClick={() => toggle(b)}
                  title={b.status === "DISABLED" ? "Activate" : "Disable"}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                >
                  <Power className="size-3.5" />
                </button>
              )}
              <button
                onClick={() => remove(b)}
                title="Delete bot"
                className="rounded-lg p-2 text-zinc-500 hover:bg-clay-500/15 hover:text-clay-300"
              >
                <Trash2 className="size-3.5" />
              </button>
            </span>
            {b.last_error && (
              <p className="w-full text-xs text-clay-300/80">last error: {b.last_error}</p>
            )}
          </div>
        ))}
        {bots.length === 0 && (
          <p className="rounded-lg border border-dashed border-zinc-800 px-4 py-6 text-center text-sm text-zinc-600">
            No pooled bots yet — running on the .env account. Add bots here to spread users
            across multiple burners.
          </p>
        )}
      </div>

      <form onSubmit={addBot} className="mt-4 flex flex-wrap items-end gap-3">
        <Field label="Instagram username">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="@burner.account"
            className={inputCls}
          />
        </Field>
        <Field label="sessionid cookie" hint="from a logged-in browser">
          <input
            value={sessionid}
            onChange={(e) => setSessionid(e.target.value)}
            required
            minLength={8}
            placeholder="paste sessionid"
            className={inputCls}
          />
        </Field>
        <Field label="Note" hint="optional">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. home-IP burner #2"
            className={inputCls}
          />
        </Field>
        <button
          type="submit"
          disabled={busy}
          className="flex items-center gap-2 rounded-lg bg-copper-500/90 px-3 py-2 text-sm font-medium text-white hover:bg-copper-500 disabled:opacity-50"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add bot
        </button>
        {error && <p className="w-full text-xs text-clay-300/80">{error}</p>}
      </form>
    </section>
  );
}

const inputCls =
  "w-44 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-copper-500/60 focus:outline-none";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-400">
        {label}
        {hint && <span className="ml-1.5 text-zinc-600">({hint})</span>}
      </span>
      {children}
    </label>
  );
}
