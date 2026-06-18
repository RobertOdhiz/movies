"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrailerPlayerProps {
  youtubeKey: string;
  className?: string;
  muted?: boolean;
  cinemaMode?: boolean;
  posterUrl?: string | null;
}

function buildEmbedUrl(key: string, origin: string): string {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
    origin,
    iv_load_policy: "3",
    cc_load_policy: "0",
    disablekb: "1",
    fs: "0",
    hl: "en",
    color: "white",
  });

  return `https://www.youtube-nocookie.com/embed/${key}?${params}`;
}

export function TrailerPlayer({
  youtubeKey,
  className,
  muted = true,
  cinemaMode = false,
  posterUrl,
}: TrailerPlayerProps) {
  const [embedSrc, setEmbedSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [ended, setEnded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isVisibleRef = useRef(true);
  const endedRef = useRef(false);

  useEffect(() => {
    endedRef.current = ended;
  }, [ended]);

  useEffect(() => {
    setEmbedSrc(buildEmbedUrl(youtubeKey, window.location.origin));
    setReady(false);
    setEnded(false);
  }, [youtubeKey]);

  const sendCommand = useCallback((func: string, args: unknown = "") => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  }, []);

  useEffect(() => {
    if (!ready) return;
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "listening", id: 1 }),
      "*"
    );
  }, [ready]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("youtube")) return;
      try {
        const data = JSON.parse(event.data as string);
        const state =
          data.event === "onStateChange"
            ? data.info
            : data.event === "infoDelivery"
              ? data.info?.playerState
              : null;

        if (state === 0) {
          setEnded(true);
          sendCommand("pauseVideo");
        }
      } catch {
        // ignore non-json messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [sendCommand]);

  const startPlayback = useCallback(() => {
    if (endedRef.current) {
      setEnded(false);
      sendCommand("seekTo", [0, true]);
    }
    sendCommand("playVideo");
    sendCommand(muted ? "mute" : "unMute");
  }, [muted, sendCommand]);

  useEffect(() => {
    if (!ready || ended) return;
    sendCommand(muted ? "mute" : "unMute");
    if (isVisibleRef.current) sendCommand("playVideo");
  }, [muted, ready, ended, sendCommand]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const syncPlayback = (shouldPlay: boolean) => {
      if (!ready) return;
      if (shouldPlay) {
        startPlayback();
      } else {
        sendCommand("pauseVideo");
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.intersectionRatio >= 0.5;
        isVisibleRef.current = visible;
        syncPlayback(visible && !document.hidden);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    observer.observe(el);

    const handleVisibility = () => {
      syncPlayback(isVisibleRef.current && !document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [ready, startPlayback, sendCommand]);

  useEffect(() => {
    if (!ready || isVisibleRef.current) return;
    sendCommand("pauseVideo");
  }, [ready, sendCommand]);

  const showPoster = !ready || ended;
  const showVideo = ready && !ended;

  if (!embedSrc) {
    return <div className={cn("absolute inset-0 bg-zinc-900", className)} />;
  }

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {posterUrl && (
        <div
          className={cn(
            "absolute inset-0 z-[1] bg-cover bg-center transition-opacity duration-700",
            showPoster ? "opacity-100" : "opacity-0"
          )}
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      )}

      <div
        className={cn(
          "absolute inset-0 z-[2] overflow-hidden transition-opacity duration-700",
          showVideo ? "opacity-100" : "opacity-0"
        )}
      >
        <iframe
          ref={iframeRef}
          src={embedSrc}
          title="Trailer"
          className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setTimeout(() => setReady(true), 900)}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[3]">
        <div className="absolute -bottom-1 -right-1 h-20 w-36 bg-gradient-to-tl from-black via-black/90 to-transparent" />
        <div className="absolute -left-1 -top-1 h-14 w-48 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
      </div>

      <div
        className={cn(
          "absolute inset-0 z-[4] hero-gradient transition-opacity duration-700 ease-in-out",
          cinemaMode || ended ? "opacity-0" : "opacity-100"
        )}
      />
      <div
        className={cn(
          "absolute inset-0 z-[4] transition-opacity duration-700 ease-in-out",
          cinemaMode || ended
            ? "hero-cinema-bar opacity-100"
            : "hero-gradient-bottom opacity-100"
        )}
      />
    </div>
  );
}

export function TrailerMuteButton({
  muted,
  onToggle,
  className,
}: {
  muted: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70",
        className
      )}
      aria-label={muted ? "Unmute trailer" : "Mute trailer"}
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}
