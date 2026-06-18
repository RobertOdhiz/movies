import { AppShell } from "@/components/layout/AppShell";
import { ContentRow } from "@/components/home/ContentRow";
import { getNowPlaying, getPopular, getTrending } from "@/lib/tmdb";
import { getLatestMovies } from "@/lib/vidsrc";

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  const [nowPlaying, popular, trending, latest] = await Promise.all([
    getNowPlaying().catch(() => []),
    getPopular("movie").catch(() => []),
    getTrending("movie").catch(() => []),
    getLatestMovies(1).catch(() => ({ results: [] })),
  ]);

  return (
    <AppShell>
      <div className="px-4 pb-8">
        <h1 className="mb-6 text-3xl font-bold text-white">Movies</h1>
      </div>
      <ContentRow title="Now Playing" items={nowPlaying} mediaType="movie" />
      <ContentRow title="Trending Movies" items={trending} mediaType="movie" />
      <ContentRow title="Popular Movies" items={popular} mediaType="movie" />
    </AppShell>
  );
}
