import type { MediaType } from "./types";

export interface WatchlistItem {
  id: number;
  type: MediaType;
  title: string;
  posterPath: string | null;
  addedAt: string;
}

const WATCHLIST_KEY = "movies-watchlist";

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? (JSON.parse(raw) as WatchlistItem[]) : [];
  } catch {
    return [];
  }
}

function saveWatchlist(items: WatchlistItem[]) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("movies-watchlist-change", { detail: items }));
}

export function isInWatchlist(id: number, type: MediaType): boolean {
  return getWatchlist().some((item) => item.id === id && item.type === type);
}

export function toggleWatchlist(item: Omit<WatchlistItem, "addedAt">): boolean {
  const list = getWatchlist();
  const index = list.findIndex((i) => i.id === item.id && i.type === item.type);

  if (index >= 0) {
    list.splice(index, 1);
    saveWatchlist(list);
    return false;
  }

  list.unshift({ ...item, addedAt: new Date().toISOString() });
  saveWatchlist(list);
  return true;
}

export function removeFromWatchlist(id: number, type: MediaType) {
  saveWatchlist(getWatchlist().filter((i) => !(i.id === id && i.type === type)));
}
