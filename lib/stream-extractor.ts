import type { MediaType, StreamResponse, StreamSource } from "./types";
import { getProviderEmbedUrls } from "./providers";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const M3U8_PATTERN = /https?:\/\/[^\s"'<>\\]+\.m3u8[^\s"'<>\\]*/gi;
const MP4_PATTERN = /https?:\/\/[^\s"'<>\\]+\.mp4[^\s"'<>\\]*/gi;
const FILE_PATTERN = /file\s*:\s*["']([^"']+)["']/gi;
const SOURCE_PATTERN = /["']file["']\s*:\s*["']([^"']+)["']/gi;

async function fetchWithRedirects(
  url: string,
  maxRedirects = 5
): Promise<{ html: string; finalUrl: string } | null> {
  let currentUrl = url;

  for (let i = 0; i < maxRedirects; i++) {
    try {
      const res = await fetch(currentUrl, {
        headers: {
          "User-Agent": USER_AGENT,
          Referer: new URL(currentUrl).origin + "/",
          Accept: "text/html,application/xhtml+xml,*/*",
        },
        redirect: "manual",
        signal: AbortSignal.timeout(15000),
      });

      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (!location) return null;
        currentUrl = new URL(location, currentUrl).toString();
        continue;
      }

      if (!res.ok) return null;

      const html = await res.text();
      return { html, finalUrl: currentUrl };
    } catch {
      return null;
    }
  }

  return null;
}

function extractStreamUrls(html: string): string[] {
  const urls = new Set<string>();

  for (const match of html.matchAll(M3U8_PATTERN)) {
    urls.add(match[0].replace(/\\$/g, ""));
  }
  for (const match of html.matchAll(MP4_PATTERN)) {
    urls.add(match[0].replace(/\\$/g, ""));
  }
  for (const match of html.matchAll(FILE_PATTERN)) {
    const url = match[1];
    if (url.includes(".m3u8") || url.includes(".mp4")) {
      urls.add(url);
    }
  }
  for (const match of html.matchAll(SOURCE_PATTERN)) {
    const url = match[1];
    if (url.includes(".m3u8") || url.includes(".mp4")) {
      urls.add(url);
    }
  }

  const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeMatch) {
    urls.add(iframeMatch[1]);
  }

  return Array.from(urls);
}

async function resolveFromEmbedPage(
  embedUrl: string,
  provider: string
): Promise<StreamSource[]> {
  const sources: StreamSource[] = [];
  const page = await fetchWithRedirects(embedUrl);

  if (!page) return sources;

  const found = extractStreamUrls(page.html);

  for (const url of found) {
    if (url.includes(".m3u8")) {
      sources.push({ provider, url, type: "hls" });
    } else if (url.includes(".mp4")) {
      sources.push({ provider, url, type: "mp4" });
    } else if (url.startsWith("http") && !url.includes(embedUrl)) {
      const nested = await fetchWithRedirects(url);
      if (nested) {
        const nestedFound = extractStreamUrls(nested.html);
        for (const nestedUrl of nestedFound) {
          if (nestedUrl.includes(".m3u8")) {
            sources.push({ provider, url: nestedUrl, type: "hls" });
          } else if (nestedUrl.includes(".mp4")) {
            sources.push({ provider, url: nestedUrl, type: "mp4" });
          }
        }
      }
    }
  }

  return sources;
}

export async function resolveStream(opts: {
  tmdbId: number;
  type: MediaType;
  season?: number;
  episode?: number;
}): Promise<StreamResponse> {
  const embedUrls = getProviderEmbedUrls(opts);
  const allSources: StreamSource[] = [];

  const results = await Promise.allSettled(
    embedUrls.map(async ({ provider, url }) => {
      const sources = await resolveFromEmbedPage(url, provider);
      return sources;
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      allSources.push(...result.value);
    }
  }

  const uniqueSources = allSources.filter(
    (s, i, arr) => arr.findIndex((x) => x.url === s.url) === i
  );

  if (uniqueSources.length > 0) {
    return { sources: uniqueSources };
  }

  return {
    sources: [],
    embedFallback: embedUrls[0]?.url,
  };
}
