import { AppShell } from "@/components/layout/AppShell";
import { WatchMovieExperience } from "@/components/watch/WatchMovieExperience";
import { getMovieDetails } from "@/lib/tmdb";
import { getCatalogPopular } from "@/lib/catalog";
import { notFound } from "next/navigation";
import { getServerWatchPlatformFilter } from "@/lib/server-watch-platform";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WatchMoviePage({ params }: PageProps) {
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
      <WatchMovieExperience
        movie={{ id: movie.id, title: movie.title, poster_path: movie.poster_path }}
        similar={similar}
      />
    </AppShell>
  );
}
