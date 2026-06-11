import type { Metadata } from "next";
import { Feed } from "@/components/feed";
import { NextPollCountdown } from "@/components/next-poll";

export const metadata: Metadata = { title: "Your saves — Zanzo" };

export default function HomePage() {
  return (
    <Feed
      header={
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl tracking-tight">Your saves</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Everything you saved or DMed, automatically organized.
            </p>
          </div>
          <NextPollCountdown />
        </div>
      }
    />
  );
}
