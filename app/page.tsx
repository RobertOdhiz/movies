import { AppShell } from "@/components/layout/AppShell";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ContentRow } from "@/components/home/ContentRow";
import { getTrending, getNowPlaying, getPopular } from "@/lib/tmdb";
import { getHeroSlides } from "@/lib/hero";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [heroSlides, trending, nowPlaying, popularMovies, popularTv] =
    await Promise.all([
      getHeroSlides(3).catch(() => []),
      getTrending("all").catch(() => []),
      getNowPlaying().catch(() => []),
      getPopular("movie").catch(() => []),
      getPopular("tv").catch(() => []),
    ]);

  if (heroSlides.length === 0 && trending.length === 0) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-white/60">
            Configure TMDB_API_KEY in .env.local to get started.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <HeroCarousel slides={heroSlides} />

      <ContentRow
        title="New Releases"
        items={
          nowPlaying.length
            ? nowPlaying
            : trending.filter((t) => t.media_type === "movie")
        }
        mediaType="movie"
      />

      <ContentRow title="Trending Now" items={trending} />

      <ContentRow title="Popular Movies" items={popularMovies} mediaType="movie" />

      <ContentRow title="Popular TV Series" items={popularTv} mediaType="tv" />
    </AppShell>
  );
}
