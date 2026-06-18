import { AppShell } from "@/components/layout/AppShell";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ContentRow } from "@/components/home/ContentRow";
import { PlatformFilterNotice } from "@/components/layout/PlatformFilterNotice";
import {
  getCatalogNowPlaying,
  getCatalogPopular,
  getCatalogTrending,
} from "@/lib/catalog";
import { getHeroSlides } from "@/lib/hero";
import { getServerWatchPlatformFilter } from "@/lib/server-watch-platform";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const filter = await getServerWatchPlatformFilter();

  const [heroSlides, trending, nowPlaying, popularMovies, popularTv] =
    await Promise.all([
      getHeroSlides(3, filter).catch(() => []),
      getCatalogTrending("all", filter).catch(() => []),
      getCatalogNowPlaying(filter).catch(() => []),
      getCatalogPopular("movie", filter).catch(() => []),
      getCatalogPopular("tv", filter).catch(() => []),
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
      <PlatformFilterNotice filter={filter} />
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
