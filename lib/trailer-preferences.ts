const TRAILER_MUTE_KEY = "movies-trailer-muted";

export function getTrailerMutedPreference(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(TRAILER_MUTE_KEY);
    if (value === null) return null;
    return value === "true";
  } catch {
    return null;
  }
}

export function setTrailerMutedPreference(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TRAILER_MUTE_KEY, String(muted));
    window.dispatchEvent(new Event("movies-trailer-mute-change"));
  } catch {
    // ignore storage errors
  }
}

export function getInitialTrailerMuted(): boolean {
  return getTrailerMutedPreference() ?? true;
}
