import type { HeroSlide, MediaType } from "./types";
import type { WatchPlatformFilter } from "./watch-platform";
import {
  getMovieDetails,
  getTvDetails,
  discoverByPlatform,
  getTrailerKey,
} from "./tmdb";
import {
  getCatalogNowPlaying,
  getCatalogPopular,
  getCatalogTrending,
} from "./catalog";
import { getLatestMovies, getLatestTvShows } from "./vidsrc";
import { formatRuntime, formatYear } from "./utils";

async function buildSlide(id: number, type: MediaType): Promise<HeroSlide | null> {
  try {
    if (type === "movie") {
      const movie = await getMovieDetails(id);
      return {
        id: movie.id,
        mediaType: "movie",
        title: movie.title,
        overview: movie.overview,
        backdropPath: movie.backdrop_path,
        posterPath: movie.poster_path,
        rating: movie.vote_average,
        year: formatYear(movie.release_date),
        runtime: formatRuntime(movie.runtime),
        genres: movie.genres.map((g) => g.name),
        trailerKey: getTrailerKey(movie.videos),
        cast: movie.credits?.cast ?? [],
      };
    }

    const show = await getTvDetails(id);
    return {
      id: show.id,
      mediaType: "tv",
      title: show.name,
      overview: show.overview,
      backdropPath: show.backdrop_path,
      posterPath: show.poster_path,
      rating: show.vote_average,
      year: formatYear(show.first_air_date),
      seasons: show.number_of_seasons,
      genres: show.genres.map((g) => g.name),
      trailerKey: getTrailerKey(show.videos),
      cast: show.credits?.cast ?? [],
    };
  } catch {
    return null;
  }
}

export async function getHeroSlides(
  limit = 3,
  filter: WatchPlatformFilter = { providerId: null, region: "US" }
): Promise<HeroSlide[]> {
  return getHeroSlidesForMediaType("all", limit, filter);
}

export async function getHeroSlidesForMediaType(
  mediaType: MediaType | "all",
  limit = 3,
  filter: WatchPlatformFilter = { providerId: null, region: "US" }
): Promise<HeroSlide[]> {
  const pool: { id: number; type: MediaType }[] = [];
  const seen = new Set<number>();

  const add = (id: number, type: MediaType) => {
    if (Number.isNaN(id) || seen.has(id)) return;
    if (mediaType !== "all" && type !== mediaType) return;
    seen.add(id);
    pool.push({ id, type });
  };

  if (filter.providerId) {
    if (mediaType === "movie" || mediaType === "all") {
      const movies = await discoverByPlatform(
        "movie",
        filter.providerId,
        filter.region
      ).catch(() => []);
      for (const item of movies.slice(0, 8)) add(item.id, "movie");
    }
    if (mediaType === "tv" || mediaType === "all") {
      const tv = await discoverByPlatform("tv", filter.providerId, filter.region).catch(
        () => []
      );
      for (const item of tv.slice(0, 8)) add(item.id, "tv");
    }
  } else {
    const [latestMovies, latestTv, nowPlaying, trendingMovies, trendingTv] =
      await Promise.all([
        mediaType === "tv"
          ? Promise.resolve({ results: [] })
          : getLatestMovies(1).catch(() => ({ results: [] })),
        mediaType === "movie"
          ? Promise.resolve({ results: [] })
          : getLatestTvShows(1).catch(() => ({ results: [] })),
        mediaType === "tv"
          ? Promise.resolve([])
          : getCatalogNowPlaying(filter).catch(() => []),
        mediaType === "tv"
          ? Promise.resolve([])
          : getCatalogTrending("movie", filter).catch(() => []),
        mediaType === "movie"
          ? Promise.resolve([])
          : getCatalogTrending("tv", filter).catch(() => []),
      ]);

    for (const item of latestMovies.results.slice(0, 4)) {
      add(parseInt(item.tmdb_id, 10), "movie");
    }
    for (const item of latestTv.results.slice(0, 4)) {
      add(parseInt(item.tmdb_id, 10), "tv");
    }
    for (const item of nowPlaying) add(item.id, "movie");
    for (const item of trendingMovies) add(item.id, "movie");
    for (const item of trendingTv) add(item.id, "tv");

    if (mediaType === "movie" || mediaType === "all") {
      const popularMovies = await getCatalogPopular("movie", filter).catch(() => []);
      for (const item of popularMovies) add(item.id, "movie");
    }
    if (mediaType === "tv" || mediaType === "all") {
      const popularTv = await getCatalogPopular("tv", filter).catch(() => []);
      for (const item of popularTv) add(item.id, "tv");
    }
  }

  const slides: HeroSlide[] = [];

  for (const { id, type } of pool) {
    if (slides.length >= limit) break;
    const slide = await buildSlide(id, type);
    if (slide?.backdropPath) slides.push(slide);
  }

  return slides;
}
