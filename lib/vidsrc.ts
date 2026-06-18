import type { VidsrcLatestItem } from "./types";

const VIDSRC_API = "https://vidsrc-embed.ru";

async function fetchVidsrcJson<T>(path: string): Promise<T> {
  const res = await fetch(`${VIDSRC_API}${path}`, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`VidSrc API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function getLatestMovies(page = 1): Promise<{
  results: VidsrcLatestItem[];
  pages: number;
}> {
  const data = await fetchVidsrcJson<{
    result: VidsrcLatestItem[];
    pages: number;
  }>(`/movies/latest/page-${page}.json`);

  return { results: data.result, pages: data.pages };
}

export async function getLatestTvShows(page = 1): Promise<{
  results: VidsrcLatestItem[];
  pages: number;
}> {
  const data = await fetchVidsrcJson<{
    result: VidsrcLatestItem[];
    pages: number;
  }>(`/tvshows/latest/page-${page}.json`);

  return { results: data.result, pages: data.pages };
}

export async function getLatestEpisodes(page = 1): Promise<{
  results: VidsrcLatestItem[];
  pages: number;
}> {
  const data = await fetchVidsrcJson<{
    result: VidsrcLatestItem[];
    pages: number;
  }>(`/episodes/latest/page-${page}.json`);

  return { results: data.result, pages: data.pages };
}
