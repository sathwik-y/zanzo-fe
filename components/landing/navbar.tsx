"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GitHubIcon } from "@/components/icons";
import { Logo } from "@/components/logo";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#pipeline", label: "Pipeline" },
  { href: "#features", label: "What comes out" },
  { href: "#open-source", label: "Open source" },
];

/* Floating navbar that condenses on scroll: full-width and quiet at the top,
   a narrower bordered capsule once you move. */
export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`flex w-full items-center gap-6 rounded-full border px-5 py-2.5 transition-all duration-300 ${
          scrolled
            ? "max-w-4xl border-line bg-paper/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md"
            : "max-w-6xl border-transparent bg-transparent"
        }`}
      >
        <Link href="/" className="shrink-0">
          <Logo size={20} />
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-ink-dim transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <a
            href="https://github.com/sathwik-y/zanzo"
            target="_blank"
            rel="noreferrer"
            title="Backend on GitHub"
            className="rounded-full p-2 text-ink-dim transition-colors hover:bg-raised hover:text-ink"
          >
            <GitHubIcon className="size-4" />
          </a>
          <Link
            href="/login"
            className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-paper transition-colors hover:bg-copper-200"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
