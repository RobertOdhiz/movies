export type StreamingProvider = "vidfast" | "vidrock" | "vidsrc";

export interface UserPreferences {
  displayName: string;
  defaultProvider: StreamingProvider;
  notificationsReadAt: string | null;
  watchPlatformId: number | null;
  watchRegion: string;
}

const PREFS_KEY = "movies-user-prefs";

const defaults: UserPreferences = {
  displayName: "Guest",
  defaultProvider: "vidfast",
  notificationsReadAt: null,
  watchPlatformId: null,
  watchRegion: "US",
};

export function getUserPreferences(): UserPreferences {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

import {
  setWatchPlatformCookies,
} from "@/lib/watch-platform";

export function saveUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const current = getUserPreferences();
  const next = { ...current, ...prefs };
  localStorage.setItem(PREFS_KEY, JSON.stringify(next));

  if (
    typeof document !== "undefined" &&
    ("watchPlatformId" in prefs || "watchRegion" in prefs)
  ) {
    setWatchPlatformCookies(next.watchPlatformId, next.watchRegion);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("movies-prefs-change", { detail: next }));
  }
  return next;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "G";
}
