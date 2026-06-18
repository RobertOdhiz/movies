"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { MediaCard } from "@/components/media/MediaCard";
import { getWatchlist, removeFromWatchlist, type WatchlistItem } from "@/lib/watchlist";

export function WatchlistGrid() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    const load = () => setItems(getWatchlist());
    load();
    window.addEventListener("movies-watchlist-change", load);
    return () => window.removeEventListener("movies-watchlist-change", load);
  }, []);

  if (items.length === 0) {
    return (
      <p className="text-white/50">
        Your watchlist is empty. Add titles from any movie or show page.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => {
        const href = item.type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
        return (
          <div key={`${item.type}-${item.id}`} className="group relative">
            <MediaCard
              href={href}
              title={item.title}
              posterPath={item.posterPath}
              badge={item.type}
              showMetaBelow
              subtitle={item.type}
            />
            <button
              type="button"
              onClick={() => removeFromWatchlist(item.id, item.type)}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-red-500/80 group-hover:opacity-100"
              aria-label={`Remove ${item.title} from watchlist`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
