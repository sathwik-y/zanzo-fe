"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

type Mode = "login" | "signup";

/* The auth card is shared between the landing hero (embedded) and the
   standalone /login + /signup pages. Modes toggle in place. */
export function AuthCard({
  initialMode = "login",
  embedded = false,
}: {
  initialMode?: Mode;
  embedded?: boolean;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const body: Record<string, string> = { email, password };
      if (mode === "signup" && displayName) body.display_name = displayName;
      const resp = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const detail = data?.detail;
        setError(
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? (detail[0]?.msg ?? "request failed")
              : "request failed"
        );
        return;
      }
      router.replace(search.get("next") || "/");
      router.refresh();
    } catch {
      setError("could not reach the server");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`relative w-full max-w-md rounded-2xl border border-line bg-surface/80 p-7 backdrop-blur-sm ${
        embedded ? "shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)]" : ""
      }`}
    >
      {/* mode toggle */}
      <div className="flex items-center gap-1 rounded-full border border-line bg-paper/60 p-1 text-xs font-medium">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`flex-1 rounded-full px-3 py-1.5 uppercase tracking-[0.18em] transition-colors ${
              mode === m ? "bg-raised text-ink" : "text-ink-faint hover:text-ink-dim"
            }`}
          >
            {m === "login" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <h2 className="mt-6 font-display text-2xl text-ink">
        {mode === "login" ? "Welcome back" : "Start your archive"}
      </h2>
      <p className="mt-1.5 text-sm text-ink-dim">
        {mode === "login"
          ? "Sign in to your library."
          : "An account takes thirty seconds. Linking Instagram comes after."}
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "signup" && (
          <Field label="Display name" hint="optional">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={inputCls}
              placeholder="Ada"
              maxLength={80}
            />
          </Field>
        )}
        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>
        <Field
          label="Password"
          right={
            mode === "login" ? (
              <Link
                href="/forgot"
                className="text-xs text-ink-faint transition-colors hover:text-copper-300"
              >
                Forgot password?
              </Link>
            ) : undefined
          }
        >
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            placeholder={mode === "signup" ? "at least 8 characters" : "••••••••"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </Field>

        {error && (
          <p className="rounded-lg border border-clay-500/30 bg-clay-500/10 px-3 py-2 text-sm text-clay-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-copper-200 disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              {mode === "login" ? "Sign in" : "Create account"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-ink-faint">
        Self-hosted &amp; open source —{" "}
        <a
          href="https://github.com/sathwik-y/zanzo"
          target="_blank"
          rel="noreferrer"
          className="text-ink-dim underline decoration-line-strong underline-offset-2 transition-colors hover:text-copper-300"
        >
          run your own instance
        </a>
      </p>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-paper/70 px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-copper-500/60 focus:outline-none focus:ring-1 focus:ring-copper-500/30 transition-colors";

function Field({
  label,
  hint,
  right,
  children,
}: {
  label: string;
  hint?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-dim">
          {label}
          {hint && <span className="ml-2 normal-case tracking-normal text-ink-faint">{hint}</span>}
        </span>
        {right}
      </span>
      {children}
    </label>
  );
}
