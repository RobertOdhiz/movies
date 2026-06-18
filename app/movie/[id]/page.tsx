import { AppShell } from "@/components/layout/AppShell";
import { HeroSection } from "@/components/home/HeroSection";
import { CastSection } from "@/components/home/CastSection";
import { ContentRow } from "@/components/home/ContentRow";
import { getMovieDetails, getTrailerKey } from "@/lib/tmdb";
import { getCatalogPopular } from "@/lib/catalog";
import { formatRuntime, formatYear } from "@/lib/utils";
import { getServerWatchPlatformFilter } from "@/lib/server-watch-platform";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  if (isNaN(movieId)) notFound();

  let movie;
  try {
    movie = await getMovieDetails(movieId);
  } catch {
    notFound();
  }

  const filter = await getServerWatchPlatformFilter();
  const similar = await getCatalogPopular("movie", filter).catch(() => []);

  return (
    <AppShell>
      <HeroSection
        title={movie.title}
        overview={movie.overview}
        backdropPath={movie.backdrop_path}
        posterPath={movie.poster_path}
        rating={movie.vote_average}
        year={formatYear(movie.release_date)}
        runtime={formatRuntime(movie.runtime)}
        genres={movie.genres.map((g) => g.name)}
        trailerKey={getTrailerKey(movie.videos)}
        mediaType="movie"
        mediaId={movie.id}
      />

      <CastSection cast={movie.credits?.cast ?? []} />

      <ContentRow title="More Movies" items={similar.filter((m) => m.id !== movie.id)} mediaType="movie" />
    </AppShell>
  );
}
