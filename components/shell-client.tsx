"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

const BARE_ROUTES = new Set(["/login", "/signup", "/forgot"]);

export function ShellClient({
  hasSession,
  children,
}: {
  hasSession: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.has(pathname) || (pathname === "/" && !hasSession);
  if (bare) return <>{children}</>;
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
