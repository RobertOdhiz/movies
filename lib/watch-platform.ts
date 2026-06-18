export const DEFAULT_WATCH_REGION = "US";

export interface WatchPlatformFilter {
  providerId: number | null;
  region: string;
}

/** Popular US streaming services — pinned at top of the picker. */
export const FEATURED_WATCH_PLATFORMS: {
  providerId: number;
  name: string;
}[] = [
  { providerId: 8, name: "Netflix" },
  { providerId: 350, name: "Apple TV+" },
  { providerId: 337, name: "Disney+" },
  { providerId: 1899, name: "Max" },
  { providerId: 15, name: "Hulu" },
  { providerId: 9, name: "Prime Video" },
  { providerId: 531, name: "Paramount+" },
  { providerId: 386, name: "Peacock" },
];

export function getPlatformName(
  providerId: number | null | undefined,
  providers?: { provider_id: number; provider_name: string }[]
): string {
  if (providerId == null) return "All";
  const featured = FEATURED_WATCH_PLATFORMS.find((p) => p.providerId === providerId);
  if (featured) return featured.name;
  return providers?.find((p) => p.provider_id === providerId)?.provider_name ?? "Platform";
}

export function setWatchPlatformCookies(
  providerId: number | null,
  region = DEFAULT_WATCH_REGION
) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `movies-watch-platform=${providerId ?? "all"};path=/;max-age=${maxAge};SameSite=Lax`;
  document.cookie = `movies-watch-region=${region};path=/;max-age=${maxAge};SameSite=Lax`;
}

export function readWatchPlatformCookies(): WatchPlatformFilter {
  if (typeof document === "undefined") {
    return { providerId: null, region: DEFAULT_WATCH_REGION };
  }

  const map = Object.fromEntries(
    document.cookie.split("; ").map((part) => {
      const [key, ...rest] = part.split("=");
      return [key, rest.join("=")];
    })
  );

  const raw = map["movies-watch-platform"];
  const region = map["movies-watch-region"] ?? DEFAULT_WATCH_REGION;

  if (!raw || raw === "all") {
    return { providerId: null, region };
  }

  const providerId = parseInt(raw, 10);
  return {
    providerId: Number.isNaN(providerId) ? null : providerId,
    region,
  };
}
