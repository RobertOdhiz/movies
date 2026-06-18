"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Tv,
  Film,
  Clock,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/tv", icon: Tv, label: "TV Series" },
  { href: "/movies", icon: Film, label: "Movies" },
  { href: "/history", icon: Clock, label: "History" },
  { href: "/favorites", icon: Heart, label: "Favorites" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-4 top-1/2 z-50 -translate-y-1/2">
      <div className="glass-pill flex flex-col items-center gap-1 p-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200",
                active
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
