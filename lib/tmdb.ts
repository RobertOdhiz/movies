import type {
  MediaType,
  TmdbEpisode,
  TmdbMovieDetails,
  TmdbPersonCredit,
  TmdbPersonDetails,
  TmdbSearchResult,
  TmdbTvDetails,
} from "./types";

const TMDB_BASE = "https://api.themoviedb.org/3";

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error("TMDB_API_KEY is not configured");
  }
  return key;
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", getApiKey());
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status} ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function searchMulti(query: string): Promise<TmdbSearchResult[]> {
  const data = await searchMultiPaginated(query, 1);
  return data.results;
}

export async function searchMultiPaginated(
  query: string,
  page = 1
): Promise<{
  results: TmdbSearchResult[];
  page: number;
  totalPages: number;
  totalResults: number;
}> {
  if (!query.trim()) {
    return { results: [], page: 1, totalPages: 0, totalResults: 0 };
  }

  const data = await tmdbFetch<{
    page: number;
    results: TmdbSearchResult[];
    total_pages: number;
    total_results: number;
  }>("/search/multi", {
    query: query.trim(),
    include_adult: "false",
    page: String(page),
  });

  return {
    results: data.results.filter(
      (r) => r.media_type === "movie" || r.media_type === "tv"
    ),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function getMovieDetails(id: number): Promise<TmdbMovieDetails> {
  return tmdbFetch<TmdbMovieDetails>(`/movie/${id}`, {
    append_to_response: "credits,videos,external_ids",
  });
}

export async function getTvDetails(id: number): Promise<TmdbTvDetails> {
  return tmdbFetch<TmdbTvDetails>(`/tv/${id}`, {
    append_to_response: "credits,videos,external_ids",
  });
}

export async function getSeasonEpisodes(
  tvId: number,
  season: number
): Promise<TmdbEpisode[]> {
  const data = await tmdbFetch<{ episodes: TmdbEpisode[] }>(
    `/tv/${tvId}/season/${season}`
  );
  return data.episodes;
}

export async function getTrending(
  type: "all" | "movie" | "tv" = "all"
): Promise<TmdbSearchResult[]> {
  const data = await tmdbFetch<{ results: TmdbSearchResult[] }>(
    `/trending/${type}/week`
  );
  return data.results;
}

export async function getNowPlaying(): Promise<TmdbSearchResult[]> {
  const data = await tmdbFetch<{ results: TmdbSearchResult[] }>("/movie/now_playing");
  return data.results;
}

export async function getPopular(type: MediaType): Promise<TmdbSearchResult[]> {
  const data = await tmdbFetch<{ results: TmdbSearchResult[] }>(`/${type}/popular`);
  return data.results;
}

export interface TmdbWatchProviderOption {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

export async function getWatchProviderOptions(
  region = "US"
): Promise<TmdbWatchProviderOption[]> {
  const data = await tmdbFetch<{
    results: TmdbWatchProviderOption[];
  }>(`/watch/providers/movie`, { watch_region: region });
  return data.results;
}

export async function discoverByPlatform(
  type: MediaType,
  providerId: number,
  region = "US",
  page = 1
): Promise<TmdbSearchResult[]> {
  const data = await tmdbFetch<{ results: TmdbSearchResult[] }>(`/discover/${type}`, {
    watch_region: region,
    with_watch_providers: String(providerId),
    with_watch_monetization_types: "flatrate",
    sort_by: "popularity.desc",
    page: String(page),
  });

  return data.results.map((item) => ({
    ...item,
    media_type: type,
  }));
}

export async function titleAvailableOnPlatform(
  id: number,
  type: MediaType,
  providerId: number,
  region = "US"
): Promise<boolean> {
  try {
    const data = await tmdbFetch<{
      results?: Record<
        string,
        { flatrate?: { provider_id: number }[] } | undefined
      >;
    }>(`/${type}/${id}/watch/providers`);

    const regional = data.results?.[region]?.flatrate ?? [];
    return regional.some((p) => p.provider_id === providerId);
  } catch {
    return false;
  }
}

export async function filterResultsByPlatform(
  results: TmdbSearchResult[],
  providerId: number,
  region = "US"
): Promise<TmdbSearchResult[]> {
  const checks = await Promise.all(
    results.map(async (item) => {
      const type = item.media_type ?? "movie";
      if (type !== "movie" && type !== "tv") return null;
      const available = await titleAvailableOnPlatform(item.id, type, providerId, region);
      return available ? item : null;
    })
  );

  return checks.filter((item): item is TmdbSearchResult => item !== null);
}

export async function getTvRecommendations(tvId: number): Promise<TmdbSearchResult[]> {
  const data = await tmdbFetch<{ results: TmdbSearchResult[] }>(
    `/tv/${tvId}/recommendations`
  );
  return data.results;
}

export async function getPersonDetails(id: number): Promise<TmdbPersonDetails> {
  return tmdbFetch<TmdbPersonDetails>(`/person/${id}`);
}

export async function getPersonCombinedCredits(
  personId: number
): Promise<TmdbPersonCredit[]> {
  const data = await tmdbFetch<{
    cast: {
      id: number;
      media_type: string;
      title?: string;
      name?: string;
      character: string;
      poster_path: string | null;
      release_date?: string;
      first_air_date?: string;
      vote_average?: number;
    }[];
  }>(`/person/${personId}/combined_credits`);

  return data.cast
    .filter((c) => c.media_type === "movie" || c.media_type === "tv")
    .map((c) => ({
      id: c.id,
      mediaType: c.media_type as MediaType,
      title: c.title ?? c.name ?? "Unknown",
      character: c.character,
      posterPath: c.poster_path,
      releaseDate: c.release_date ?? c.first_air_date ?? "",
      voteAverage: c.vote_average ?? 0,
    }))
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
}

export function getTrailerKey(
  videos?: { results: { key: string; site: string; type: string }[] }
): string | null {
  if (!videos?.results?.length) return null;
  const trailer =
    videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
    videos.results.find((v) => v.site === "YouTube" && v.type === "Teaser") ??
    videos.results.find((v) => v.site === "YouTube");
  return trailer?.key ?? null;
}
