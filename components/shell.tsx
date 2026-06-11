"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

const BARE_ROUTES = new Set(["/login", "/signup"]);

// App chrome: sidebar + content column, except on auth pages.
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (BARE_ROUTES.has(pathname)) return <>{children}</>;
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 py-6 md:px-8 lg:px-12 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
