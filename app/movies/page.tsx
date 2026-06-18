import { AppShell } from "@/components/layout/AppShell";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ContentRow } from "@/components/home/ContentRow";
import { PlatformFilterNotice } from "@/components/layout/PlatformFilterNotice";
import {
  getCatalogNowPlaying,
  getCatalogPopular,
  getCatalogTrending,
} from "@/lib/catalog";
import { getHeroSlidesForMediaType } from "@/lib/hero";
import { getServerWatchPlatformFilter } from "@/lib/server-watch-platform";

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  const filter = await getServerWatchPlatformFilter();

  const [heroSlides, nowPlaying, popular, trending] = await Promise.all([
    getHeroSlidesForMediaType("movie", 3, filter).catch(() => []),
    getCatalogNowPlaying(filter).catch(() => []),
    getCatalogPopular("movie", filter).catch(() => []),
    getCatalogTrending("movie", filter).catch(() => []),
  ]);

  return (
    <AppShell>
      <PlatformFilterNotice filter={filter} />
      {heroSlides.length > 0 && <HeroCarousel slides={heroSlides} />}

      <ContentRow title="Now Playing" items={nowPlaying} mediaType="movie" />
      <ContentRow title="Trending Movies" items={trending} mediaType="movie" />
      <ContentRow title="Popular Movies" items={popular} mediaType="movie" />
    </AppShell>
  );
}
