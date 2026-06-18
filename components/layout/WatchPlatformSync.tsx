"use client";

import { useEffect } from "react";
import { getUserPreferences } from "@/lib/user-preferences";
import { setWatchPlatformCookies } from "@/lib/watch-platform";

export function WatchPlatformSync() {
  useEffect(() => {
    const prefs = getUserPreferences();
    setWatchPlatformCookies(prefs.watchPlatformId, prefs.watchRegion);
  }, []);

  return null;
}
