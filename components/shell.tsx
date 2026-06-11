import { cookies } from "next/headers";
import { ShellClient } from "@/components/shell-client";
import { REFRESH_COOKIE } from "@/lib/session";

// App chrome: sidebar + content column for signed-in app pages; bare for the
// landing page and auth screens.
export async function Shell({ children }: { children: React.ReactNode }) {
  const hasSession = (await cookies()).has(REFRESH_COOKIE);
  return <ShellClient hasSession={hasSession}>{children}</ShellClient>;
}
