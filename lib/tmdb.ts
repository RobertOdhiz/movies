import type {
  MediaType,
  TmdbEpisode,
  TmdbMovieDetails,
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
  if (!query.trim()) return [];
  const data = await tmdbFetch<{ results: TmdbSearchResult[] }>("/search/multi", {
    query: query.trim(),
    include_adult: "false",
  });
  return data.results.filter(
    (r) => r.media_type === "movie" || r.media_type === "tv"
  );
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

export async function getTvRecommendations(tvId: number): Promise<TmdbSearchResult[]> {
  const data = await tmdbFetch<{ results: TmdbSearchResult[] }>(
    `/tv/${tvId}/recommendations`
  );
  return data.results;
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
