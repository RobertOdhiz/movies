"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { HeroSection } from "@/components/home/HeroSection";
import { CastSection } from "@/components/home/CastSection";
import { ContentRow } from "@/components/home/ContentRow";
import { formatYear } from "@/lib/utils";
import type { TmdbEpisode, TmdbSearchResult, TmdbTvDetails } from "@/lib/types";

interface TvDetailClientProps {
  tvId: number;
}

function getTrailerKey(
  videos?: { results: { key: string; site: string; type: string }[] }
): string | null {
  if (!videos?.results?.length) return null;
  const trailer =
    videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
    videos.results.find((v) => v.site === "YouTube");
  return trailer?.key ?? null;
}

export function TvDetailClient({ tvId }: TvDetailClientProps) {
  const searchParams = useSearchParams();
  const initialSeason = parseInt(searchParams.get("season") ?? "1", 10);
  const initialEpisode = parseInt(searchParams.get("episode") ?? "1", 10);

  const [show, setShow] = useState<TmdbTvDetails | null>(null);
  const [episodes, setEpisodes] = useState<TmdbEpisode[]>([]);
  const [recommended, setRecommended] = useState<TmdbSearchResult[]>([]);
  const [season, setSeason] = useState(initialSeason);
  const [episode, setEpisode] = useState(initialEpisode);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [detailsRes, episodesRes, recommendedRes] = await Promise.all([
          fetch(`/api/tmdb/tv/${tvId}`),
          fetch(`/api/tmdb/tv/${tvId}/season/${season}`),
          fetch(`/api/tmdb/tv/${tvId}/recommendations`),
        ]);
        const details = await detailsRes.json();
        const eps = await episodesRes.json();
        const recs = await recommendedRes.json();
        setShow(details);
        setEpisodes(eps.episodes ?? []);
        setRecommended(recs.results ?? []);
      } catch {
        setShow(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tvId, season]);

  if (loading || !show) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="-mx-3 mb-6 overflow-hidden rounded-none sm:mx-0 sm:rounded-3xl">
        <HeroSection
          title={show.name}
          overview={show.overview}
          backdropPath={show.backdrop_path}
          posterPath={show.poster_path}
          rating={show.vote_average}
          year={formatYear(show.first_air_date)}
          seasons={show.number_of_seasons}
          availableSeasons={show.seasons
            .filter((s) => s.season_number > 0)
            .map((s) => s.season_number)}
          genres={show.genres.map((g) => g.name)}
          trailerKey={getTrailerKey(show.videos)}
          mediaType="tv"
          mediaId={show.id}
          episodes={episodes}
          selectedSeason={season}
          onSeasonChange={setSeason}
          selectedEpisode={episode}
          onEpisodeSelect={setEpisode}
        />
      </div>

      <CastSection cast={show.credits?.cast ?? []} />

      {recommended.length > 0 && (
        <ContentRow
          title="Recommended Shows"
          items={recommended.filter((item) => item.id !== show.id)}
          mediaType="tv"
        />
      )}
    </AppShell>
  );
}
