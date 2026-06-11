import { cookies } from "next/headers";
import { Landing } from "@/components/landing/landing";
import { Feed } from "@/components/feed";
import { NextPollCountdown } from "@/components/next-poll";
import { REFRESH_COOKIE } from "@/lib/session";

// Logged out, `/` is the landing page; logged in, it's your library.
export default async function HomePage() {
  const hasSession = (await cookies()).has(REFRESH_COOKIE);
  if (!hasSession) return <Landing />;

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
