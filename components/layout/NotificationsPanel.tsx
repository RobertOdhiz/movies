"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Film, Sparkles, Tv } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  href: string;
  time: string;
}

interface NotificationsPanelProps {
  onClose: () => void;
  onMarkRead: () => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationsPanel({ onClose, onMarkRead }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications ?? []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const iconFor = (type: string) => {
    if (type === "new_episode") return Tv;
    if (type === "new_release") return Film;
    return Sparkles;
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-96 overflow-hidden rounded-2xl border border-white/10 bg-[#141414]/95 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Notifications</p>
          <p className="text-xs text-white/40">Fresh picks & new episodes</p>
        </div>
        <button
          type="button"
          onClick={() => {
            onMarkRead();
            onClose();
          }}
          className="text-xs text-accent transition-colors hover:text-accent/80"
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-white/40">
            You&apos;re all caught up.
          </p>
        ) : (
          notifications.map((n) => {
            const Icon = iconFor(n.type);
            return (
              <Link
                key={n.id}
                href={n.href}
                onClick={onClose}
                className="flex gap-3 border-b border-white/5 px-4 py-3 transition-colors last:border-0 hover:bg-white/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{n.title}</p>
                  <p className="truncate text-xs text-white/50">{n.message}</p>
                  <p className="mt-1 text-[10px] text-white/30">{timeAgo(n.time)}</p>
                </div>
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

export function useUnreadCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const check = async () => {
      const readAt = localStorage.getItem("movies-notifications-read");
      if (readAt) {
        setCount(0);
        return;
      }
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        setCount(data.notifications?.length ?? 0);
      } catch {
        setCount(0);
      }
    };
    check();
    window.addEventListener("movies-notifications-read", check);
    return () => window.removeEventListener("movies-notifications-read", check);
  }, []);

  return count;
}

export function markNotificationsRead() {
  localStorage.setItem("movies-notifications-read", new Date().toISOString());
  window.dispatchEvent(new Event("movies-notifications-read"));
}
