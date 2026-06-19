"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clapperboard, Globe, LayoutGrid } from "lucide-react";
import { cn, tmdbImage } from "@/lib/utils";
import {
  DEFAULT_WATCH_REGION,
  FEATURED_WATCH_PLATFORMS,
  getPlatformName,
  readWatchPlatformCookies,
} from "@/lib/watch-platform";
import {
  getUserPreferences,
  saveUserPreferences,
} from "@/lib/user-preferences";
import type { TmdbWatchProviderOption } from "@/lib/tmdb";
import { navDropdownPanelClass } from "@/lib/nav-dropdown";

interface PlatformFilterPickerProps {
  onSelect?: () => void;
  className?: string;
  compact?: boolean;
}

export function PlatformFilterPicker({
  onSelect,
  className,
  compact = false,
}: PlatformFilterPickerProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [region, setRegion] = useState(DEFAULT_WATCH_REGION);
  const [providers, setProviders] = useState<TmdbWatchProviderOption[]>([]);

  useEffect(() => {
    const sync = () => {
      const prefs = getUserPreferences();
      setSelectedId(prefs.watchPlatformId ?? null);
      setRegion(prefs.watchRegion);
    };
    sync();
    window.addEventListener("movies-prefs-change", sync);
    return () => window.removeEventListener("movies-prefs-change", sync);
  }, []);

  useEffect(() => {
    fetch(`/api/watch-providers?region=${region}`)
      .then((r) => r.json())
      .then((d) => setProviders(d.providers ?? []))
      .catch(() => setProviders([]));
  }, [region]);

  const apply = (providerId: number | null, nextRegion = region) => {
    saveUserPreferences({
      watchPlatformId: providerId,
      watchRegion: nextRegion,
    });
    setSelectedId(providerId);
    setRegion(nextRegion);
    onSelect?.();
    router.refresh();
  };

  const featuredIds = new Set(FEATURED_WATCH_PLATFORMS.map((p) => p.providerId));
  const extraProviders = providers.filter((p) => !featuredIds.has(p.provider_id));

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-xs leading-relaxed text-white/45">
        {compact
          ? "Filter catalog by where titles stream in your region."
          : "Only show titles available to stream on the selected platform in your region."}
      </p>

      <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
        <Globe size={14} className="text-white/40" />
        <select
          value={region}
          onChange={(e) => apply(selectedId, e.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none"
        >
          <option value="US" className="bg-zinc-900">
            United States
          </option>
          <option value="GB" className="bg-zinc-900">
            United Kingdom
          </option>
          <option value="CA" className="bg-zinc-900">
            Canada
          </option>
          <option value="AU" className="bg-zinc-900">
            Australia
          </option>
          <option value="DE" className="bg-zinc-900">
            Germany
          </option>
          <option value="FR" className="bg-zinc-900">
            France
          </option>
        </select>
      </div>

      <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
        <PlatformOption
          name="All"
          logoPath={null}
          icon={<LayoutGrid size={14} className="text-inherit" />}
          active={selectedId == null}
          onClick={() => apply(null)}
          className="sticky top-0 z-10 bg-[#141414]/95 backdrop-blur-sm"
        />

        {FEATURED_WATCH_PLATFORMS.map((platform) => {
          const logo = providers.find((p) => p.provider_id === platform.providerId)?.logo_path;
          return (
            <PlatformOption
              key={platform.providerId}
              name={platform.name}
              logoPath={logo ?? null}
              active={selectedId === platform.providerId}
              onClick={() => apply(platform.providerId)}
            />
          );
        })}

        {extraProviders.length > 0 && (
          <p className="px-3 pt-2 text-[10px] font-medium uppercase tracking-wider text-white/30">
            More services
          </p>
        )}

        {extraProviders.map((platform) => (
          <PlatformOption
            key={platform.provider_id}
            name={platform.provider_name}
            logoPath={platform.logo_path}
            active={selectedId === platform.provider_id}
            onClick={() => apply(platform.provider_id)}
          />
        ))}
      </div>
    </div>
  );
}

function PlatformOption({
  name,
  logoPath,
  icon,
  active,
  onClick,
  className,
}: {
  name: string;
  logoPath: string | null;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-all",
        active
          ? "bg-accent font-semibold text-black"
          : "text-white/60 hover:bg-white/10 hover:text-white",
        className
      )}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/10">
        {logoPath ? (
          <img
            src={tmdbImage(logoPath, "w92")}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : icon ? (
          <span className={active ? "text-black/70" : "text-white/50"}>{icon}</span>
        ) : (
          <Clapperboard size={14} className={active ? "text-black/60" : "text-white/40"} />
        )}
      </div>
      <span className="truncate">{name}</span>
    </button>
  );
}

export function PlatformFilterDropdown({ onClose }: { onClose?: () => void }) {
  return (
    <div className={cn(navDropdownPanelClass("sm:w-72"), "p-3")}>
      <p className="mb-2 flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wider text-white/40">
        <Clapperboard size={12} />
        Streaming platform
      </p>
      <PlatformFilterPicker onSelect={onClose} />
    </div>
  );
}

export function PlatformFilterBadge({ className }: { className?: string }) {
  const [label, setLabel] = useState("All");

  useEffect(() => {
    const sync = () => {
      const prefs = getUserPreferences();
      setLabel(getPlatformName(prefs.watchPlatformId));
    };
    sync();
    window.addEventListener("movies-prefs-change", sync);
    return () => window.removeEventListener("movies-prefs-change", sync);
  }, []);

  useEffect(() => {
    const cookies = readWatchPlatformCookies();
    const prefs = getUserPreferences();
    if (cookies.providerId !== (prefs.watchPlatformId ?? null)) {
      saveUserPreferences({
        watchPlatformId: cookies.providerId,
        watchRegion: cookies.region,
      });
    }
  }, []);

  return (
    <span
      className={cn(
        "hidden max-w-[88px] truncate rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80 sm:inline",
        className
      )}
    >
      {label}
    </span>
  );
}
