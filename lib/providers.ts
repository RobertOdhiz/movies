import type { MediaType, StreamingProvider } from "./types";

const VIDFAST_DOMAINS = [
  "vidfast.pro",
  "vidfast.in",
  "vidfast.io",
  "vidfast.me",
  "vidfast.net",
];

const VIDSRC_DOMAINS = [
  "vidsrc-embed.ru",
  "vidsrcme.su",
  "vsembed.ru",
  "vidsrc.me",
];

export interface ProviderEmbedOptions {
  tmdbId: number;
  type: MediaType;
  season?: number;
  episode?: number;
  imdbId?: string;
}

function buildVidfastUrl(domain: string, opts: ProviderEmbedOptions): string {
  const params = new URLSearchParams({
    autoPlay: "false",
    title: "false",
    poster: "false",
    hideServer: "false",
    theme: "FFD700",
  });

  if (opts.type === "movie") {
    return `https://${domain}/movie/${opts.tmdbId}?${params}`;
  }
  return `https://${domain}/tv/${opts.tmdbId}/${opts.season}/${opts.episode}?${params}`;
}

function buildVidrockUrl(opts: ProviderEmbedOptions): string {
  const params = new URLSearchParams({
    autoplay: "false",
    autonext: "false",
  });

  if (opts.type === "movie") {
    return `https://vidrock.ru/movie/${opts.tmdbId}?${params}`;
  }
  return `https://vidrock.ru/tv/${opts.tmdbId}/${opts.season}/${opts.episode}?${params}`;
}

function buildVidsrcUrl(domain: string, opts: ProviderEmbedOptions): string {
  const params = new URLSearchParams({ autoplay: "0" });

  if (opts.type === "movie") {
    return `https://${domain}/embed/movie/${opts.tmdbId}?${params}`;
  }
  return `https://${domain}/embed/tv/${opts.tmdbId}/${opts.season}/${opts.episode}?${params}`;
}

export function getProviderEmbedUrls(opts: ProviderEmbedOptions): {
  provider: StreamingProvider;
  url: string;
}[] {
  const urls: { provider: StreamingProvider; url: string }[] = [];

  for (const domain of VIDFAST_DOMAINS.slice(0, 2)) {
    urls.push({ provider: "vidfast", url: buildVidfastUrl(domain, opts) });
  }

  urls.push({ provider: "vidrock", url: buildVidrockUrl(opts) });

  for (const domain of VIDSRC_DOMAINS.slice(0, 2)) {
    urls.push({ provider: "vidsrc", url: buildVidsrcUrl(domain, opts) });
  }

  return urls;
}

export function getPrimaryEmbedUrl(opts: ProviderEmbedOptions): string {
  return buildVidfastUrl(VIDFAST_DOMAINS[0], opts);
}

export function getEmbedUrlByProvider(
  provider: StreamingProvider,
  opts: ProviderEmbedOptions
): string {
  switch (provider) {
    case "vidfast":
      return buildVidfastUrl(VIDFAST_DOMAINS[0], opts);
    case "vidrock":
      return buildVidrockUrl(opts);
    case "vidsrc":
      return buildVidsrcUrl(VIDSRC_DOMAINS[0], opts);
  }
}
