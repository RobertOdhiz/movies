"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { EpisodeCarousel } from "@/components/home/EpisodeCarousel";
import { tmdbImage } from "@/lib/utils";
import type { TmdbEpisode } from "@/lib/types";

interface WatchTvExperienceProps {
  show: {
    id: number;
    name: string;
    poster_path: string | null;
    number_of_seasons: number;
    seasons: { season_number: number }[];
  };
  season: number;
  episode: number;
  episodes: TmdbEpisode[];
}

export function WatchTvExperience({
  show,
  season,
  episode,
  episodes,
}: WatchTvExperienceProps) {
  const router = useRouter();
  const currentEp = episodes.find((e) => e.episode_number === episode);
  const title = currentEp
    ? `${show.name} — S${season}E${episode}: ${currentEp.name}`
    : show.name;

  return (
    <div className="mx-4 pb-12">
      <Link
        href={`/tv/${show.id}?season=${season}&episode=${episode}`}
        className="mb-4 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to {show.name}
      </Link>

      <VideoPlayer
        key={`${show.id}-${season}-${episode}`}
        tmdbId={show.id}
        type="tv"
        season={season}
        episode={episode}
        title={title}
        poster={tmdbImage(currentEp?.still_path ?? show.poster_path, "w780")}
      />

      <div className="mt-10">
        <h2 className="mb-2 text-lg font-semibold text-white">Episodes</h2>
        <EpisodeCarousel
          episodes={episodes}
          selectedEpisode={episode}
          selectedSeason={season}
          onSeasonChange={(nextSeason) => {
            router.push(`/watch/tv/${show.id}?season=${nextSeason}&episode=1`);
          }}
          availableSeasons={show.seasons
            .filter((s) => s.season_number > 0)
            .map((s) => s.season_number)}
          seasons={show.number_of_seasons}
          mediaId={show.id}
        />
      </div>
    </div>
  );
}
