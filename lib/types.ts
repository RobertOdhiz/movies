export type MediaType = "movie" | "tv";

export interface TmdbSearchResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: MediaType;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

export interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number | null;
  genres: { id: number; name: string }[];
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
      name: string;
    }[];
  };
  imdb_id?: string;
}

export interface TmdbTvDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
  number_of_seasons: number;
  genres: { id: number; name: string }[];
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
      name: string;
    }[];
  };
  external_ids?: { imdb_id: string | null };
  seasons: {
    season_number: number;
    episode_count: number;
    name: string;
    poster_path: string | null;
  }[];
}

export interface TmdbEpisode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
  runtime: number | null;
  air_date: string;
}

export interface VidsrcLatestItem {
  imdb_id: string;
  tmdb_id: string;
  title?: string;
  show_title?: string;
  season?: string;
  episode?: string;
  embed_url: string;
  embed_url_tmdb: string;
  quality: string;
  time_added: string;
}

export interface StreamSource {
  provider: string;
  url: string;
  type: "hls" | "mp4" | "embed";
  subtitles?: { lang: string; url: string }[];
}

export interface StreamResponse {
  sources: StreamSource[];
  embedFallback?: string;
}

export type StreamingProvider = "vidfast" | "vidrock" | "vidsrc";

export interface HeroSlide {
  id: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  backdropPath: string | null;
  posterPath: string | null;
  rating: number;
  year: string;
  runtime?: string;
  seasons?: number;
  genres: string[];
  trailerKey: string | null;
  cast: { id: number; name: string; character: string; profile_path: string | null }[];
}
