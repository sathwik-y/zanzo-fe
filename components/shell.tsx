import { ShellClient } from "@/components/shell-client";

// App chrome: bare for landing/auth routes, sidebar + content elsewhere.
// Route protection itself lives in proxy.ts; this is purely presentational.
export function Shell({ children }: { children: React.ReactNode }) {
  return <ShellClient>{children}</ShellClient>;
}
