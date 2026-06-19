"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tv, Film, Clock, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/tv", icon: Tv, label: "TV" },
  { href: "/movies", icon: Film, label: "Movies" },
  { href: "/history", icon: Clock, label: "History" },
  { href: "/favorites", icon: Heart, label: "Saved" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0a0a0a]/90 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl md:bottom-auto md:left-4 md:right-auto md:top-1/2 md:w-auto md:-translate-y-1/2 md:border-0 md:bg-transparent md:pb-0 md:backdrop-blur-none"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around gap-0 px-1 py-1.5 md:max-w-none md:flex-col md:items-center md:gap-1 md:rounded-full md:p-2 md:glass-pill">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 transition-all duration-200 md:h-11 md:w-11 md:flex-none md:rounded-full md:gap-0 md:px-0 md:py-0",
                active
                  ? "text-accent md:bg-white/15 md:text-white"
                  : "text-white/45 hover:text-white md:text-white/50 md:hover:bg-white/10 md:hover:text-white"
              )}
            >
              <Icon size={20} className="shrink-0" />
              <span className="truncate text-[10px] font-medium md:hidden">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
