"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Mic,
  HelpCircle,
  Bell,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { cn, tmdbImage } from "@/lib/utils";
import type { TmdbSearchResult } from "@/lib/types";
import { HelpPanel } from "./HelpPanel";
import {
  NotificationsPanel,
  markNotificationsRead,
  useUnreadCount,
} from "./NotificationsPanel";
import { ProfileMenu, useDisplayName, useProfileInitials } from "./ProfileMenu";
import { Logo } from "./Logo";

type Panel = "help" | "notifications" | "profile" | null;

export function TopNav() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const unreadCount = useUnreadCount();
  const displayName = useDisplayName();
  const initials = useProfileInitials();

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearchOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setSearchOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = (item: TmdbSearchResult) => {
    const type = item.media_type ?? "movie";
    const path = type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
    setQuery("");
    setSearchOpen(false);
    router.push(path);
  };

  const togglePanel = (panel: Panel) => {
    setActivePanel((current) => (current === panel ? null : panel));
    setSearchOpen(false);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setActivePanel(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="fixed top-4 right-4 left-4 z-50">
      <div ref={navRef} className="glass-pill mx-auto flex max-w-6xl items-center gap-4 px-5 py-2.5">
        <Logo />

        <div ref={searchRef} className="relative flex-1">
          <div className="flex items-center gap-3 rounded-full bg-black/40 px-4 py-2">
            {loading ? (
              <Loader2 size={18} className="shrink-0 animate-spin text-white/40" />
            ) : (
              <Search size={18} className="shrink-0 text-white/40" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => results.length > 0 && setSearchOpen(true)}
              placeholder="Search movie or tv series"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
            />
            <Mic size={18} className="shrink-0 cursor-pointer text-white/40 hover:text-white/70" />
          </div>

          {searchOpen && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#141414]/95 shadow-2xl backdrop-blur-xl">
              {results.slice(0, 8).map((item) => {
                const title = item.title ?? item.name ?? "Unknown";
                const type = item.media_type ?? "movie";
                return (
                  <button
                    key={`${type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10"
                  >
                    <img
                      src={tmdbImage(item.poster_path, "w92")}
                      alt={title}
                      className="h-12 w-8 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{title}</p>
                      <p className="text-xs text-white/50 capitalize">{type}</p>
                    </div>
                    <span className="text-xs text-accent">
                      {item.vote_average.toFixed(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <div className="relative">
            <button
              type="button"
              onClick={() => togglePanel("help")}
              aria-label="Help"
              className={cn(
                "rounded-full p-2 transition-colors",
                activePanel === "help"
                  ? "bg-accent/20 text-accent"
                  : "text-white/50 hover:bg-white/10 hover:text-white"
              )}
            >
              <HelpCircle size={20} />
            </button>
            {activePanel === "help" && (
              <HelpPanel onClose={() => setActivePanel(null)} />
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => togglePanel("notifications")}
              aria-label="Notifications"
              className={cn(
                "relative rounded-full p-2 transition-colors",
                activePanel === "notifications"
                  ? "bg-accent/20 text-accent"
                  : "text-white/50 hover:bg-white/10 hover:text-white"
              )}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-black">
                  {unreadCount}
                </span>
              )}
            </button>
            {activePanel === "notifications" && (
              <NotificationsPanel
                onClose={() => setActivePanel(null)}
                onMarkRead={markNotificationsRead}
              />
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => togglePanel("profile")}
              className={cn(
                "flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors",
                activePanel === "profile"
                  ? "bg-white/15"
                  : "hover:bg-white/10"
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent/80 to-orange-500">
                <span className="text-xs font-bold text-black">{initials}</span>
              </div>
              <span className="hidden max-w-[100px] truncate text-sm text-white/80 md:block">
                {displayName}
              </span>
              <ChevronDown
                size={16}
                className={cn(
                  "text-white/50 transition-transform",
                  activePanel === "profile" && "rotate-180"
                )}
              />
            </button>
            {activePanel === "profile" && (
              <ProfileMenu onClose={() => setActivePanel(null)} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
