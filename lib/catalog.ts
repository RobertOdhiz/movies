import type { MediaType, TmdbSearchResult } from "./types";
import type { WatchPlatformFilter } from "./watch-platform";
import {
  discoverByPlatform,
  filterResultsByPlatform,
  getNowPlaying,
  getPopular,
  getTrending,
  searchMultiPaginated,
} from "./tmdb";

export async function getCatalogPopular(
  type: MediaType,
  filter: WatchPlatformFilter
): Promise<TmdbSearchResult[]> {
  if (!filter.providerId) return getPopular(type);
  return discoverByPlatform(type, filter.providerId, filter.region);
}

export async function getCatalogTrending(
  type: "all" | MediaType,
  filter: WatchPlatformFilter
): Promise<TmdbSearchResult[]> {
  if (!filter.providerId) return getTrending(type);

  if (type === "all") {
    const [movies, tv] = await Promise.all([
      discoverByPlatform("movie", filter.providerId, filter.region),
      discoverByPlatform("tv", filter.providerId, filter.region),
    ]);
    return [...movies, ...tv].sort((a, b) => b.vote_average - a.vote_average);
  }

  return discoverByPlatform(type, filter.providerId, filter.region);
}

export async function getCatalogNowPlaying(
  filter: WatchPlatformFilter
): Promise<TmdbSearchResult[]> {
  if (!filter.providerId) return getNowPlaying();
  return discoverByPlatform("movie", filter.providerId, filter.region);
}

export async function searchCatalogPaginated(
  query: string,
  page: number,
  filter: WatchPlatformFilter
) {
  const data = await searchMultiPaginated(query, page);

  if (!filter.providerId) return data;

  const filtered = await filterResultsByPlatform(
    data.results,
    filter.providerId,
    filter.region
  );

  return {
    ...data,
    results: filtered,
    totalResults: filtered.length,
    totalPages: filtered.length > 0 ? data.totalPages : 0,
  };
}
