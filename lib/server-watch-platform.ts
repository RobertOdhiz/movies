import { cookies } from "next/headers";
import {
  DEFAULT_WATCH_REGION,
  type WatchPlatformFilter,
} from "@/lib/watch-platform";

export async function getServerWatchPlatformFilter(): Promise<WatchPlatformFilter> {
  const jar = await cookies();
  const raw = jar.get("movies-watch-platform")?.value;
  const region = jar.get("movies-watch-region")?.value ?? DEFAULT_WATCH_REGION;

  if (!raw || raw === "all") {
    return { providerId: null, region };
  }

  const providerId = parseInt(raw, 10);
  return {
    providerId: Number.isNaN(providerId) ? null : providerId,
    region,
  };
}
