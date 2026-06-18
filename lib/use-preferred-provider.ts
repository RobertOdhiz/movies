"use client";

import { useEffect, useState } from "react";
import {
  getUserPreferences,
  saveUserPreferences,
  type StreamingProvider,
} from "@/lib/user-preferences";

export function usePreferredProvider() {
  const [provider, setProvider] = useState<StreamingProvider>("vidfast");

  useEffect(() => {
    setProvider(getUserPreferences().defaultProvider);
    const sync = () => setProvider(getUserPreferences().defaultProvider);
    window.addEventListener("movies-prefs-change", sync);
    return () => window.removeEventListener("movies-prefs-change", sync);
  }, []);

  const setPreferredProvider = (next: StreamingProvider) => {
    saveUserPreferences({ defaultProvider: next });
    setProvider(next);
  };

  return { provider, setPreferredProvider };
}
