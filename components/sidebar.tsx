"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  Bookmark,
  Calendar,
  ChefHat,
  Cpu,
  Gift,
  GraduationCap,
  Home,
  LogOut,
  Plane,
  Settings,
  Shapes,
  ShieldCheck,
} from "lucide-react";
import { logout } from "@/lib/api";
import { useUser } from "@/lib/use-user";

const NAV = [
  { href: "/", label: "Feed", icon: Home },
  { href: "/resources", label: "Resources", icon: Gift },
  { href: "/category/events", label: "Events", icon: Calendar },
  { href: "/category/recipes", label: "Recipes", icon: ChefHat },
  { href: "/category/travel", label: "Travel", icon: Plane },
  { href: "/category/educational", label: "Educational", icon: GraduationCap },
  { href: "/category/tech", label: "Tech", icon: Cpu },
  { href: "/category/other", label: "Other", icon: Shapes },
  { href: "/failed", label: "Failed", icon: AlertTriangle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin } = useUser();
  const nav = isAdmin ? [...NAV, { href: "/admin", label: "Admin", icon: ShieldCheck }] : NAV;

  return (
    <aside className="sticky top-0 h-auto md:h-screen w-full md:w-52 shrink-0 border-b md:border-b-0 md:border-r border-zinc-800/80 bg-zinc-950/60 backdrop-blur z-20">
      <div className="flex md:flex-col md:h-full items-center md:items-stretch gap-1 p-3 md:p-4 overflow-x-auto md:overflow-visible">
        <Link href="/" className="flex items-center gap-2 px-2 py-1 md:mb-6 shrink-0">
          <Bookmark className="size-5 text-violet-400" />
          <span className="text-lg font-semibold tracking-tight">Zanzo</span>
        </Link>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                active
                  ? "bg-violet-500/15 text-violet-200"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
        {user && (
          <div className="md:mt-auto flex items-center gap-2 rounded-lg px-3 py-2 shrink-0">
            <div className="min-w-0 hidden md:block">
              <p className="truncate text-sm text-zinc-300">{user.display_name || user.email}</p>
              <p className="truncate text-xs text-zinc-600">{user.email}</p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="ml-auto rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800/60 hover:text-zinc-200"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
