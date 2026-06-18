"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { isInWatchlist, toggleWatchlist } from "@/lib/watchlist";
import type { MediaType } from "@/lib/types";

interface WatchlistButtonProps {
  mediaId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  className?: string;
}

export function WatchlistButton({
  mediaId,
  mediaType,
  title,
  posterPath,
  className,
}: WatchlistButtonProps) {
  const [inList, setInList] = useState(false);

  useEffect(() => {
    setInList(isInWatchlist(mediaId, mediaType));
    const sync = () => setInList(isInWatchlist(mediaId, mediaType));
    window.addEventListener("movies-watchlist-change", sync);
    return () => window.removeEventListener("movies-watchlist-change", sync);
  }, [mediaId, mediaType]);

  const handleClick = () => {
    const added = toggleWatchlist({
      id: mediaId,
      type: mediaType,
      title,
      posterPath,
    });
    setInList(added);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all",
        inList
          ? "border-accent bg-accent/20 text-accent hover:bg-accent/30"
          : "border-white/30 bg-white/10 text-white hover:bg-white/20",
        className
      )}
    >
      {inList ? <Check size={16} /> : <Plus size={16} />}
      {inList ? "In Watchlist" : "Watchlist"}
    </button>
  );
}
