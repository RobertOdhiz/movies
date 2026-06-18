import { AppShell } from "@/components/layout/AppShell";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ContentRow } from "@/components/home/ContentRow";
import { PlatformFilterNotice } from "@/components/layout/PlatformFilterNotice";
import { getCatalogPopular, getCatalogTrending } from "@/lib/catalog";
import { getHeroSlidesForMediaType } from "@/lib/hero";
import { getServerWatchPlatformFilter } from "@/lib/server-watch-platform";

export const dynamic = "force-dynamic";

export default async function TvPage() {
  const filter = await getServerWatchPlatformFilter();

  const [heroSlides, popular, trending] = await Promise.all([
    getHeroSlidesForMediaType("tv", 3, filter).catch(() => []),
    getCatalogPopular("tv", filter).catch(() => []),
    getCatalogTrending("tv", filter).catch(() => []),
  ]);

  return (
    <AppShell>
      <PlatformFilterNotice filter={filter} />
      {heroSlides.length > 0 && <HeroCarousel slides={heroSlides} />}

      <ContentRow title="Trending TV" items={trending} mediaType="tv" />
      <ContentRow title="Popular TV Series" items={popular} mediaType="tv" />
    </AppShell>
  );
}
