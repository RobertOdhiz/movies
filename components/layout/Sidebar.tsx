"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNavItems } from "@/lib/nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 md:block"
      aria-label="Main navigation"
    >
      <div className="flex flex-col items-center gap-1 rounded-full p-2 glass-pill">
        {mainNavItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200",
                active
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={20} className="shrink-0" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
