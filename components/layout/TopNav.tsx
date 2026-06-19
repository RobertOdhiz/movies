"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Mic,
  HelpCircle,
  Bell,
  ChevronDown,
  Loader2,
  Clapperboard,
} from "lucide-react";
import Link from "next/link";
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
import {
  PlatformFilterBadge,
  PlatformFilterDropdown,
} from "./PlatformFilterMenu";

type Panel = "help" | "notifications" | "profile" | "platform" | null;

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
};

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function TopNav() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const unreadCount = useUnreadCount();
  const displayName = useDisplayName();
  const initials = useProfileInitials();

  const goToSearchPage = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      setSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [router]
  );

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToSearchPage(query);
  };

  const handleSelect = (item: TmdbSearchResult) => {
    const type = item.media_type ?? "movie";
    const path = type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
    setQuery("");
    setSearchOpen(false);
    router.push(path);
  };

  const startVoiceSearch = () => {
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) {
      window.alert("Voice search is not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setQuery(transcript);
        goToSearchPage(transcript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
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
        if (listening) recognitionRef.current?.stop();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [listening]);

  return (
    <header className="fixed left-2 right-2 top-2 z-50 sm:left-4 sm:right-4 sm:top-4">
      <div
        ref={navRef}
        className="glass-pill mx-auto flex max-w-6xl flex-col gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5 md:flex-row md:items-center md:gap-4 md:px-5"
      >
        <div className="flex items-center justify-between gap-2 md:contents">
          <Logo />

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1 md:order-last">
            <div className="relative">
              <button
                type="button"
                onClick={() => togglePanel("platform")}
                aria-label="Streaming platform filter"
                className={cn(
                  "flex items-center gap-1 rounded-full px-1.5 py-1.5 transition-colors sm:gap-1.5 sm:px-2",
                  activePanel === "platform"
                    ? "bg-accent/20 text-accent"
                    : "text-white/50 hover:bg-white/10 hover:text-white"
                )}
              >
                <Clapperboard size={18} />
                <PlatformFilterBadge />
                <ChevronDown
                  size={14}
                  className={cn(
                    "hidden text-white/50 transition-transform sm:block",
                    activePanel === "platform" && "rotate-180"
                  )}
                />
              </button>
              {activePanel === "platform" && (
                <PlatformFilterDropdown onClose={() => setActivePanel(null)} />
              )}
            </div>

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
                aria-label="Profile menu"
                className={cn(
                  "flex items-center gap-1 rounded-full py-1 pl-1 pr-1 transition-colors sm:pr-2",
                  activePanel === "profile" ? "bg-white/15" : "hover:bg-white/10"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent/80 to-orange-500">
                  <span className="text-xs font-bold text-black">{initials}</span>
                </div>
                <span className="hidden max-w-[100px] truncate text-sm text-white/80 lg:block">
                  {displayName}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "hidden text-white/50 transition-transform sm:block",
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

        <div ref={searchRef} className="relative w-full min-w-0 md:flex-1">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-2 sm:gap-3 sm:px-4"
          >
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
              placeholder="Search movies & TV"
              className="w-full min-w-0 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
            />
            <button
              type="button"
              onClick={startVoiceSearch}
              aria-label={listening ? "Stop voice search" : "Voice search"}
              className={cn(
                "shrink-0 rounded-full p-0.5 transition-colors",
                listening
                  ? "text-accent animate-pulse"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              <Mic size={18} />
            </button>
          </form>

          {searchOpen && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-[min(60dvh,24rem)] overflow-y-auto rounded-2xl border border-white/10 bg-[#141414]/95 shadow-2xl backdrop-blur-xl">
              {results.slice(0, 8).map((item) => {
                const title = item.title ?? item.name ?? "Unknown";
                const type = item.media_type ?? "movie";
                return (
                  <button
                    key={`${type}-${item.id}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10"
                  >
                    <img
                      src={tmdbImage(item.poster_path, "w92")}
                      alt={title}
                      className="h-12 w-8 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{title}</p>
                      <p className="text-xs capitalize text-white/50">{type}</p>
                    </div>
                    <span className="shrink-0 text-xs text-accent">
                      {item.vote_average.toFixed(1)}
                    </span>
                  </button>
                );
              })}
              {query.trim() && (
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={() => setSearchOpen(false)}
                  className="block border-t border-white/10 px-4 py-3 text-center text-sm font-medium text-accent transition-colors hover:bg-white/5"
                >
                  View all results for &ldquo;{query.trim()}&rdquo;
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
