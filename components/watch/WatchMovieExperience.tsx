"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { ContentRow } from "@/components/home/ContentRow";
import { tmdbImage } from "@/lib/utils";
import type { TmdbSearchResult } from "@/lib/types";

interface WatchMovieExperienceProps {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
  };
  similar: TmdbSearchResult[];
}

export function WatchMovieExperience({ movie, similar }: WatchMovieExperienceProps) {
  return (
    <div className="mx-4 pb-12">
      <Link
        href={`/movie/${movie.id}`}
        className="mb-4 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to {movie.title}
      </Link>

      <VideoPlayer
        tmdbId={movie.id}
        type="movie"
        title={movie.title}
        poster={tmdbImage(movie.poster_path, "w780")}
      />

      <div className="mt-10">
        <ContentRow
          title="More Like This"
          items={similar.filter((m) => m.id !== movie.id)}
          mediaType="movie"
        />
      </div>
    </div>
  );
}
