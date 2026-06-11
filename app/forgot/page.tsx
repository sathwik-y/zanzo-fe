import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Reset password — Zanzo" };

export default function ForgotPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="rounded-2xl border border-line bg-surface/80 p-7">
          <div className="flex size-10 items-center justify-center rounded-full border border-line bg-raised">
            <KeyRound className="size-4 text-copper-300" />
          </div>
          <h1 className="mt-4 font-display text-2xl text-ink">Reset your password</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-dim">
            Zanzo instances are self-hosted and don&apos;t send email, so password resets go
            through the person running your instance. Ask your admin to reset it — they can do
            this from the server in one command.
          </p>
          <p className="mt-3 rounded-lg border border-line bg-paper/70 px-3 py-2 font-mono text-xs text-ink-dim">
            python -m scripts.reset_password you@example.com
          </p>
          <p className="mt-3 text-xs text-ink-faint">
            Running your own instance? That command is in the backend repo&apos;s{" "}
            <code className="text-ink-dim">scripts/</code> directory.
          </p>
        </div>
        <p className="mt-5 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-ink-dim transition-colors hover:text-copper-300"
          >
            <ArrowLeft className="size-3.5" /> Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
