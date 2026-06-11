"use client";

import { useCallback, useEffect, useState } from "react";
import { AtSign, CheckCircle2, Loader2, Send, Unlink } from "lucide-react";
import { api, IgLinkStatus } from "@/lib/api";
import { useUser } from "@/lib/use-user";

export function AccountSettings() {
  const { user } = useUser();
  const [link, setLink] = useState<IgLinkStatus | null>(null);
  const [igUsername, setIgUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLink(await api<IgLinkStatus>("auth/instagram/link"));
    } catch {
      /* service-key mode has no user account */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // While a code is pending, poll for the poller-side verification.
  useEffect(() => {
    if (!link?.pending_code) return;
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [link?.pending_code, load]);

  async function startLink(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      setLink(
        await api<IgLinkStatus>("auth/instagram/link", {
          method: "POST",
          body: JSON.stringify({ ig_username: igUsername }),
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed");
    } finally {
      setBusy(false);
    }
  }

  async function unlink() {
    setBusy(true);
    try {
      setLink(await api<IgLinkStatus>("auth/instagram/link", { method: "DELETE" }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h2 className="flex items-center gap-2 font-medium">
        <AtSign className="size-4 text-copper-400" /> Instagram account
      </h2>
      {user && (
        <p className="mt-1 text-sm text-zinc-500">
          Signed in as {user.email}
          {user.role === "ADMIN" && " · admin"}
        </p>
      )}

      {link?.ig_verified ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm text-sage-300">
            <CheckCircle2 className="size-4" /> @{link.ig_username} verified
          </span>
          <p className="w-full text-sm text-zinc-400">
            DM any reel from @{link.ig_username} to{" "}
            <span className="text-zinc-200">@{link.bot_username ?? "the bot account"}</span> and it
            lands in your library within minutes — transcribed, categorized and extracted.
          </p>
          <button
            onClick={unlink}
            disabled={busy}
            className="flex items-center gap-2 rounded-lg bg-zinc-800/80 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700/80 disabled:opacity-50"
          >
            <Unlink className="size-3.5" /> Unlink
          </button>
        </div>
      ) : link?.pending_code ? (
        <div className="mt-4 rounded-lg border border-copper-500/30 bg-copper-500/10 p-4 text-sm">
          <p className="text-copper-200">
            To verify you own <span className="font-medium">@{link.ig_username}</span>, send this
            message to{" "}
            <span className="font-medium">@{link.bot_username ?? "the bot account"}</span> on
            Instagram from that account:
          </p>
          <p className="mt-3 select-all rounded-lg bg-zinc-950/60 px-3 py-2 font-mono text-base tracking-widest text-copper-100">
            ZANZO {link.pending_code}
          </p>
          <p className="mt-3 flex items-center gap-2 text-xs text-copper-300/70">
            <Loader2 className="size-3 animate-spin" /> Waiting for your DM — checked every poll
            cycle. Code expires{" "}
            {link.code_expires_at ? new Date(link.code_expires_at).toLocaleTimeString() : "soon"}.
          </p>
        </div>
      ) : (
        <form onSubmit={startLink} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="block grow max-w-xs">
            <span className="mb-1.5 block text-xs font-medium text-zinc-400">
              Your Instagram username
            </span>
            <input
              value={igUsername}
              onChange={(e) => setIgUsername(e.target.value)}
              required
              placeholder="@yourhandle"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-copper-500/60 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="flex items-center gap-2 rounded-lg bg-copper-500/90 px-3 py-2 text-sm font-medium text-white hover:bg-copper-500 disabled:opacity-50"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Get verification code
          </button>
          <p className="w-full text-xs text-zinc-500">
            Link your Instagram account, then DM reels to the bot to save them into your library.
          </p>
          {error && <p className="w-full text-xs text-clay-300/80">{error}</p>}
        </form>
      )}
    </section>
  );
}
