"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
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
import { LogoMark } from "@/components/logo";

const NAV = [
  { href: "/home", label: "Feed", icon: Home },
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

/* Desktop: a quiet icon rail that expands on hover. Mobile: horizontal bar. */
export function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin } = useUser();
  const nav = isAdmin ? [...NAV, { href: "/admin", label: "Admin", icon: ShieldCheck }] : NAV;

  return (
    <>
      {/* mobile top bar */}
      <aside className="sticky top-0 z-20 w-full border-b border-line bg-paper/80 backdrop-blur md:hidden">
        <div className="flex items-center gap-1 overflow-x-auto p-3">
          <Link href="/" className="flex items-center gap-2 px-2 py-1">
            <LogoMark size={20} />
          </Link>
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === href
                  ? "bg-copper-500/15 text-copper-200"
                  : "text-ink-dim hover:bg-raised hover:text-ink"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </div>
      </aside>

      {/* desktop hover-expand rail */}
      <aside className="group/rail sticky top-0 z-20 hidden h-screen w-[68px] shrink-0 border-r border-line bg-paper transition-[width] duration-300 ease-out hover:w-56 md:block">
        <div className="flex h-full flex-col gap-1 overflow-hidden p-3">
          <Link href="/" className="mb-5 flex h-9 items-center px-2">
            <LogoMark size={22} />
            <span className="ml-2.5 origin-left font-display text-lg font-medium tracking-tight text-ink opacity-0 transition-opacity duration-200 group-hover/rail:opacity-100">
              zanzo
            </span>
          </Link>

          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={`flex h-9 items-center rounded-lg px-2.5 text-sm transition-colors ${
                  active
                    ? "bg-copper-500/15 text-copper-200"
                    : "text-ink-dim hover:bg-raised hover:text-ink"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span className="ml-3 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/rail:opacity-100">
                  {label}
                </span>
              </Link>
            );
          })}

          {user && (
            <div className="mt-auto flex h-11 items-center rounded-lg px-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-copper-500/20 font-mono text-[0.65rem] uppercase text-copper-200">
                {(user.display_name || user.email)[0]}
              </span>
              <span className="ml-3 min-w-0 flex-1 opacity-0 transition-opacity duration-200 group-hover/rail:opacity-100">
                <span className="block truncate text-xs text-ink">{user.display_name || user.email}</span>
                <span className="block truncate text-[0.65rem] text-ink-faint">{user.email}</span>
              </span>
              <button
                onClick={logout}
                title="Sign out"
                className="ml-1 shrink-0 rounded-md p-1.5 text-ink-faint opacity-0 transition-all hover:bg-raised hover:text-ink group-hover/rail:opacity-100"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
