"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { HlsPlayer } from "./HlsPlayer";
import { EmbedPlayer } from "./EmbedPlayer";
import { StreamSourceSelector } from "./StreamSourceSelector";
import { getEmbedUrlByProvider } from "@/lib/providers";
import { getUserPreferences, saveUserPreferences } from "@/lib/user-preferences";
import type { MediaType, StreamSource, StreamingProvider } from "@/lib/types";

interface VideoPlayerProps {
  tmdbId: number;
  type: MediaType;
  season?: number;
  episode?: number;
  title?: string;
  poster?: string;
}

export function VideoPlayer({
  tmdbId,
  type,
  season,
  episode,
  title,
  poster,
}: VideoPlayerProps) {
  const [sources, setSources] = useState<StreamSource[]>([]);
  const [embedFallback, setEmbedFallback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<StreamingProvider>("vidfast");
  const [useEmbed, setUseEmbed] = useState(false);

  useEffect(() => {
    setSelectedProvider(getUserPreferences().defaultProvider);
    const sync = () => setSelectedProvider(getUserPreferences().defaultProvider);
    window.addEventListener("movies-prefs-change", sync);
    return () => window.removeEventListener("movies-prefs-change", sync);
  }, []);

  useEffect(() => {
    if (sources.length === 0) return;
    const providerSource = sources.find((s) => s.provider === selectedProvider);
    setUseEmbed(!providerSource);
  }, [selectedProvider, sources]);

  useEffect(() => {
    async function loadStream() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          tmdbId: String(tmdbId),
          type,
        });
        if (season) params.set("season", String(season));
        if (episode) params.set("episode", String(episode));

        const res = await fetch(`/api/stream?${params}`);
        const data = await res.json();

        if (data.sources?.length > 0) {
          setSources(data.sources);
          const preferred = getUserPreferences().defaultProvider;
          const providerSource = data.sources.find(
            (s: StreamSource) => s.provider === preferred
          );
          setUseEmbed(!providerSource);
        } else if (data.embedFallback) {
          setEmbedFallback(data.embedFallback);
          setUseEmbed(true);
        } else {
          const fallback = getEmbedUrlByProvider(getUserPreferences().defaultProvider, {
            tmdbId,
            type,
            season,
            episode,
          });
          setEmbedFallback(fallback);
          setUseEmbed(true);
        }
      } catch {
        setError("Failed to load stream");
        const fallback = getEmbedUrlByProvider(getUserPreferences().defaultProvider, {
          tmdbId,
          type,
          season,
          episode,
        });
        setEmbedFallback(fallback);
        setUseEmbed(true);
      } finally {
        setLoading(false);
      }
    }

    loadStream();
  }, [tmdbId, type, season, episode]);

  const activeSource = sources.find((s) => s.provider === selectedProvider) ?? sources[0];

  const embedUrl = getEmbedUrlByProvider(selectedProvider, {
    tmdbId,
    type,
    season,
    episode,
  });

  const playerClass =
    "h-[42vh] min-h-[220px] w-full rounded-xl sm:h-[50vh] sm:min-h-[280px] sm:rounded-2xl md:h-[60vh] lg:h-[70vh] lg:min-h-[420px]";

  if (loading) {
    return (
      <div className={cn(playerClass, "flex items-center justify-center bg-zinc-900")}>
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  if (error && !embedFallback) {
    return (
      <div
        className={cn(
          playerClass,
          "flex flex-col items-center justify-center gap-3 bg-zinc-900"
        )}
      >
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-white/60">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="min-w-0 flex-1">
          {!useEmbed && activeSource ? (
            <HlsPlayer
              src={activeSource.url}
              poster={poster}
              title={title}
              autoPlay
              className={playerClass}
            />
          ) : (
            <EmbedPlayer src={embedUrl} title={title} className={playerClass} />
          )}
        </div>

        <StreamSourceSelector
          selected={selectedProvider}
          onSelect={(provider) => {
            setSelectedProvider(provider);
            saveUserPreferences({ defaultProvider: provider });
            const providerSource = sources.find((s) => s.provider === provider);
            setUseEmbed(!providerSource);
          }}
          className="w-full shrink-0 lg:w-44"
        />
      </div>
    </div>
  );
}
