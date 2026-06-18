import type { HeroSlide, MediaType } from "./types";
import {
  getMovieDetails,
  getTvDetails,
  getNowPlaying,
  getTrending,
  getTrailerKey,
} from "./tmdb";
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

export async function getHeroSlides(limit = 3): Promise<HeroSlide[]> {
  const [latestMovies, latestTv, nowPlaying, trending] = await Promise.all([
    getLatestMovies(1).catch(() => ({ results: [] })),
    getLatestTvShows(1).catch(() => ({ results: [] })),
    getNowPlaying().catch(() => []),
    getTrending("all").catch(() => []),
  ]);

  const pool: { id: number; type: MediaType }[] = [];
  const seen = new Set<number>();

  const add = (id: number, type: MediaType) => {
    if (seen.has(id)) return;
    seen.add(id);
    pool.push({ id, type });
  };

  for (const item of latestMovies.results.slice(0, 4)) {
    add(parseInt(item.tmdb_id, 10), "movie");
  }

  for (const item of latestTv.results.slice(0, 2)) {
    add(parseInt(item.tmdb_id, 10), "tv");
  }

  for (const item of nowPlaying) {
    add(item.id, "movie");
  }

  for (const item of trending) {
    const type = item.media_type;
    if (type === "movie" || type === "tv") {
      add(item.id, type);
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
