"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn, tmdbImage } from "@/lib/utils";
import { TrailerPlayer, TrailerMuteButton } from "@/components/player/TrailerPlayer";
import { WatchlistButton } from "@/components/home/WatchlistButton";
import { EpisodeCarousel } from "@/components/home/EpisodeCarousel";
import {
  getInitialTrailerMuted,
  getTrailerMutedPreference,
  setTrailerMutedPreference,
} from "@/lib/trailer-preferences";
import type { TmdbEpisode } from "@/lib/types";

const CINEMA_DELAY_MS = 4500;

interface HeroSectionProps {
  title: string;
  overview: string;
  backdropPath: string | null;
  posterPath: string | null;
  rating: number;
  year: string;
  runtime?: string;
  seasons?: number;
  availableSeasons?: number[];
  genres: string[];
  trailerKey?: string | null;
  mediaType: "movie" | "tv";
  mediaId: number;
  episodes?: TmdbEpisode[];
  selectedSeason?: number;
  onSeasonChange?: (season: number) => void;
  selectedEpisode?: number;
  onEpisodeSelect?: (episode: number) => void;
}

export function HeroSection({
  title,
  overview,
  backdropPath,
  posterPath,
  rating,
  year,
  runtime,
  seasons,
  availableSeasons,
  genres,
  trailerKey,
  mediaType,
  mediaId,
  episodes,
  selectedSeason = 1,
  onSeasonChange,
  selectedEpisode = 1,
  onEpisodeSelect,
}: HeroSectionProps) {
  const [trailerFailed, setTrailerFailed] = useState(false);
  const [trailerMuted, setTrailerMuted] = useState(getInitialTrailerMuted);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTrailer = Boolean(trailerKey && !trailerFailed);
  const isMinimal = showTrailer && cinemaMode && !expanded;

  useEffect(() => {
    setTrailerFailed(false);
    setTrailerMuted(getTrailerMutedPreference() ?? true);
    setCinemaMode(false);
    setExpanded(false);
  }, [trailerKey]);

  const toggleTrailerMute = () => {
    setTrailerMuted((prev) => {
      const next = !prev;
      setTrailerMutedPreference(next);
      return next;
    });
  };

  useEffect(() => {
    if (!showTrailer) {
      setCinemaMode(false);
      return;
    }

    const timer = setTimeout(() => setCinemaMode(true), CINEMA_DELAY_MS);
    return () => clearTimeout(timer);
  }, [showTrailer, trailerKey]);

  const handleMouseEnter = () => {
    if (!cinemaMode) return;
    setExpanded(true);
    if (collapseTimer.current) clearTimeout(collapseTimer.current);
  };

  const handleMouseLeave = () => {
    if (!cinemaMode) return;
    collapseTimer.current = setTimeout(() => setExpanded(false), 2500);
  };

  useEffect(() => {
    return () => {
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
    };
  }, []);

  const watchUrl =
    mediaType === "tv"
      ? `/watch/tv/${mediaId}?season=${selectedSeason}&episode=${selectedEpisode}`
      : `/watch/movie/${mediaId}`;

  return (
    <section
      className="relative overflow-hidden rounded-3xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          "relative w-full",
          episodes && episodes.length > 0
            ? "min-h-[480px] sm:min-h-[560px] md:min-h-[680px]"
            : "min-h-[380px] sm:min-h-[460px] md:min-h-[520px]"
        )}
      >
        {showTrailer && trailerKey ? (
          <TrailerPlayer
            youtubeKey={trailerKey}
            className="absolute inset-0 h-full w-full"
            muted={trailerMuted}
            cinemaMode={isMinimal}
            posterUrl={tmdbImage(backdropPath ?? posterPath, "original")}
          />
        ) : backdropPath ? (
          <>
            <Image
              src={tmdbImage(backdropPath, "original")}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 hero-gradient" />
            <div className="absolute inset-0 hero-gradient-bottom" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
        )}

        {showTrailer && (
          <TrailerMuteButton
            muted={trailerMuted}
            onToggle={toggleTrailerMute}
            className={cn(
              "absolute bottom-4 right-4 z-30 transition-all duration-700 ease-in-out sm:bottom-6 sm:right-6",
              isMinimal && "scale-110"
            )}
          />
        )}

        {showTrailer && (
          <h1
            className={cn(
              "pointer-events-none absolute bottom-4 left-4 z-30 max-w-[85%] font-bold text-white drop-shadow-lg transition-all duration-700 ease-in-out sm:bottom-6 sm:left-6 sm:max-w-[70%] md:left-10",
              isMinimal
                ? "translate-y-0 text-lg opacity-100 sm:text-2xl"
                : "translate-y-4 text-lg opacity-0 sm:text-2xl"
            )}
          >
            {title}
          </h1>
        )}

        <div className="pointer-events-none relative z-10 flex min-h-[inherit] flex-col justify-end p-4 pb-16 sm:p-6 sm:pb-14 md:p-10 md:pb-8">
          <div
            className={cn(
              "pointer-events-auto max-w-2xl transition-all duration-700 ease-in-out",
              isMinimal && "pointer-events-none translate-y-8 opacity-0"
            )}
          >
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white drop-shadow-lg sm:mb-3 sm:text-3xl md:text-5xl">
              {title}
            </h1>

            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/70">
              <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-black">
                IMDb {rating.toFixed(1)}
              </span>
              {seasons && (
                <span>
                  {seasons} Season{seasons > 1 ? "s" : ""}
                </span>
              )}
              {runtime && <span>{runtime}</span>}
              <span>{year}</span>
              <span className="rounded border border-white/30 px-1.5 py-0.5 text-xs">
                18+
              </span>
            </div>

            <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-white/60">
              {overview}
            </p>

            <div className="mb-6 flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 backdrop-blur-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Link
                href={watchUrl}
                className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90 sm:px-6"
              >
                <Play size={16} fill="currentColor" />
                Watch Now
              </Link>
              <WatchlistButton
                mediaId={mediaId}
                mediaType={mediaType}
                title={title}
                posterPath={posterPath}
              />
            </div>
          </div>

          {episodes && episodes.length > 0 && !isMinimal && mediaType === "tv" && (
            <div className="pointer-events-auto mt-2 w-full">
              <EpisodeCarousel
                episodes={episodes}
                selectedEpisode={selectedEpisode}
                onEpisodeSelect={onEpisodeSelect}
                selectedSeason={selectedSeason}
                onSeasonChange={onSeasonChange}
                availableSeasons={availableSeasons}
                seasons={seasons}
                mediaId={mediaId}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
