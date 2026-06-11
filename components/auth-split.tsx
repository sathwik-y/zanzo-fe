import Link from "next/link";
import { Suspense } from "react";
import { Logo, LogoMark } from "@/components/logo";
import { AuthCard } from "@/components/auth-card";

/* Standalone auth layout: brand panel left, form right. */
export function AuthSplit({ initialMode }: { initialMode: "login" | "signup" }) {
  return (
    <div className="flex min-h-screen">
      {/* brand panel */}
      <div className="grain relative hidden flex-1 flex-col justify-between overflow-hidden border-r border-line bg-surface p-10 lg:flex">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 100%, rgba(192,118,58,0.14) 0%, transparent 70%), radial-gradient(50% 40% at 90% 0%, rgba(192,118,58,0.06) 0%, transparent 70%)",
          }}
        />
        <Link href="/" className="relative z-10 w-fit">
          <Logo />
        </Link>
        <div className="relative z-10">
          <LogoMark size={56} />
          <h1 className="mt-6 max-w-md font-display text-4xl leading-tight text-ink">
            The reel scrolls past.
            <br />
            <em className="text-copper-300">The afterimage stays.</em>
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-dim">
            Every reel you save or DM — transcribed, categorized, and broken down into data you
            can actually use. Recipes with quantities. Events with dates. Places with names.
          </p>
        </div>
        <p className="relative z-10 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ink-faint">
          Self-hosted · Open source · Your data
        </p>
      </div>

      {/* form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </Link>
          <Suspense>
            <AuthCard initialMode={initialMode} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
