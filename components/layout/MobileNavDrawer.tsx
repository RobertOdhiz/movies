"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Clapperboard,
  HelpCircle,
  LogOut,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavItems } from "@/lib/nav-items";
import { HELP_TIPS } from "./HelpPanel";
import { PlatformFilterPicker } from "./PlatformFilterMenu";
import { StreamingSourcePicker } from "./StreamingSourceMenu";
import {
  getInitials,
  getUserPreferences,
  saveUserPreferences,
} from "@/lib/user-preferences";
import { markNotificationsRead } from "./NotificationsPanel";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  href: string;
  time: string;
}

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  unreadCount: number;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function MobileNavDrawer({ open, onClose, unreadCount }: MobileNavDrawerProps) {
  const pathname = usePathname();
  const [prefs, setPrefs] = useState(getUserPreferences);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setPrefs(getUserPreferences());
    setNotificationsLoading(true);
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications ?? []))
      .catch(() => setNotifications([]))
      .finally(() => setNotificationsLoading(false));
  }, [open]);

  const setProvider = (provider: typeof prefs.defaultProvider) => {
    const updated = saveUserPreferences({ defaultProvider: provider });
    setPrefs(updated);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-white/10 bg-[#0f0f0f]/98 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-orange-400 text-sm font-bold text-black">
              {getInitials(prefs.displayName)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{prefs.displayName}</p>
              <p className="text-xs text-white/40">Guest profile</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <nav aria-label="Main navigation">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
              Browse
            </p>
            <ul className="space-y-0.5">
              {mainNavItems.map(({ href, icon: Icon, label }) => {
                const active = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-accent/15 text-accent"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <Icon size={18} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="my-4 border-t border-white/10" />

          <div className="px-2">
            <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
              <Clapperboard size={12} />
              Streaming platform
            </p>
            <PlatformFilterPicker compact onSelect={onClose} />
          </div>

          <div className="my-4 border-t border-white/10" />

          <button
            type="button"
            onClick={() => setShowNotifications((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="flex items-center gap-3">
              <Bell size={18} />
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-black">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="mt-1 rounded-xl border border-white/10 bg-white/[0.03]">
              {notificationsLoading ? (
                <div className="flex justify-center py-6">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                </div>
              ) : notifications.length === 0 ? (
                <p className="px-3 py-4 text-center text-xs text-white/40">You&apos;re all caught up.</p>
              ) : (
                <>
                  <div className="max-h-48 overflow-y-auto">
                    {notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.href}
                        onClick={onClose}
                        className="block border-b border-white/5 px-3 py-2.5 last:border-0 hover:bg-white/5"
                      >
                        <p className="truncate text-sm font-medium text-white">{n.title}</p>
                        <p className="truncate text-xs text-white/50">{n.message}</p>
                        <p className="mt-0.5 text-[10px] text-white/30">{timeAgo(n.time)}</p>
                      </Link>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      markNotificationsRead();
                      onClose();
                    }}
                    className="w-full border-t border-white/10 py-2 text-xs text-accent"
                  >
                    Mark all read
                  </button>
                </>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowHelp((v) => !v)}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <HelpCircle size={18} />
            Help & tips
          </button>

          {showHelp && (
            <div className="mt-1 space-y-1 rounded-xl border border-white/10 bg-white/[0.03] p-2">
              {HELP_TIPS.map((tip) => (
                <div key={tip.title} className="flex gap-2 rounded-lg p-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <tip.icon size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">{tip.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-white/50">{tip.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="my-4 border-t border-white/10" />

          <div className="px-2">
            <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
              <Settings size={12} />
              Playback source
            </p>
            <StreamingSourcePicker selected={prefs.defaultProvider} onSelect={setProvider} />
          </div>

          <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-accent/10 px-3 py-2">
            <Sparkles size={12} className="shrink-0 text-accent" />
            <span className="text-[11px] leading-snug text-accent/90">
              Browsing as guest — no account needed
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              saveUserPreferences({ displayName: "Guest", defaultProvider: "vidfast" });
              setPrefs(getUserPreferences());
              onClose();
            }}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
            Reset profile
          </button>
        </div>
      </aside>
    </div>
  );
}
