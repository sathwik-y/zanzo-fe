"use client";

import { usePathname } from "next/navigation";
import { BackendBanner } from "@/components/backend-status";
import { Sidebar } from "@/components/sidebar";

// Routes that render without the app chrome (sidebar + content column).
const BARE_ROUTES = new Set(["/", "/login", "/signup", "/forgot"]);

export function ShellClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (BARE_ROUTES.has(pathname)) return <>{children}</>;
  return (
    <div className="zone-app flex min-h-screen flex-col">
      <BackendBanner />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
