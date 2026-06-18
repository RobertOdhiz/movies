"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn, tmdbImage } from "@/lib/utils";
import type { TmdbEpisode } from "@/lib/types";

interface EpisodeCarouselProps {
  episodes: TmdbEpisode[];
  selectedEpisode: number;
  onEpisodeSelect?: (ep: number) => void;
  selectedSeason: number;
  onSeasonChange?: (season: number) => void;
  availableSeasons?: number[];
  seasons?: number;
  mediaId: number;
}

export function EpisodeCarousel({
  episodes,
  selectedEpisode,
  onEpisodeSelect,
  selectedSeason,
  onSeasonChange,
  availableSeasons,
  seasons,
  mediaId,
}: EpisodeCarouselProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const visibleCount = 5;
  const maxIndex = Math.max(0, episodes.length - visibleCount);

  const seasonOptions =
    availableSeasons ??
    Array.from({ length: seasons ?? 1 }, (_, i) => i + 1);

  return (
    <div className="mt-8 w-full">
      <div className="mb-4 flex items-center gap-2">
        <div className="relative inline-flex items-center">
          <select
            value={selectedSeason}
            onChange={(e) => {
              onSeasonChange?.(parseInt(e.target.value, 10));
              setCarouselIndex(0);
            }}
            className="cursor-pointer appearance-none rounded-lg bg-transparent py-1 pr-7 text-sm font-medium text-white outline-none"
          >
            {seasonOptions.map((s) => (
              <option key={s} value={s} className="bg-zinc-900">
                Season {s}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-0 text-white/60"
          />
        </div>
      </div>

      <div className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
          disabled={carouselIndex === 0}
          aria-label="Previous episodes"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 disabled:opacity-25"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex min-w-0 flex-1 gap-4 overflow-hidden">
          {episodes.slice(carouselIndex, carouselIndex + visibleCount).map((ep) => {
            const isSelected = selectedEpisode === ep.episode_number;
            const watchHref = `/watch/tv/${mediaId}?season=${ep.season_number}&episode=${ep.episode_number}`;

            return (
              <Link
                key={ep.id}
                href={watchHref}
                onClick={() => onEpisodeSelect?.(ep.episode_number)}
                className={cn(
                  "group min-w-0 flex-1 rounded-2xl p-1 transition-all duration-200",
                  isSelected
                    ? "border-2 border-white bg-white/5"
                    : "border-2 border-transparent hover:bg-white/5"
                )}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-800">
                  {ep.still_path ? (
                    <img
                      src={tmdbImage(ep.still_path, "w342")}
                      alt={ep.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/30">
                      <Play size={24} />
                    </div>
                  )}
                </div>

                <div className="px-1 pt-2.5 pb-1">
                  <p className="text-xs font-medium text-accent">
                    S{ep.season_number}-E{ep.episode_number}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-white">
                    {ep.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setCarouselIndex(Math.min(maxIndex, carouselIndex + 1))}
          disabled={carouselIndex >= maxIndex}
          aria-label="Next episodes"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 disabled:opacity-25"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
