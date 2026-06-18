"use client";

import { MonitorPlay } from "lucide-react";
import { cn } from "@/lib/utils";
import { STREAMING_PROVIDERS } from "@/lib/streaming-providers";
import { usePreferredProvider } from "@/lib/use-preferred-provider";
import type { StreamingProvider } from "@/lib/user-preferences";

interface StreamingSourcePickerProps {
  selected: StreamingProvider;
  onSelect: (provider: StreamingProvider) => void;
  compact?: boolean;
  className?: string;
}

export function StreamingSourcePicker({
  selected,
  onSelect,
  compact = false,
  className,
}: StreamingSourcePickerProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {!compact && (
        <p className="mb-1 text-xs leading-relaxed text-white/45">
          Applies to all movies and shows site-wide. Playback always starts from
          this network.
        </p>
      )}
      {STREAMING_PROVIDERS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(p.id)}
          className={cn(
            "rounded-xl px-3 py-2 text-left transition-all",
            selected === p.id
              ? "bg-accent font-semibold text-black"
              : "text-white/60 hover:bg-white/10 hover:text-white"
          )}
        >
          <span className={cn("block", compact ? "text-sm" : "text-sm")}>
            {p.label}
          </span>
          {!compact && (
            <span
              className={cn(
                "mt-0.5 block text-xs",
                selected === p.id ? "text-black/70" : "text-white/40"
              )}
            >
              {p.description}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

interface StreamingSourceDropdownProps {
  onClose?: () => void;
}

export function StreamingSourceDropdown({ onClose }: StreamingSourceDropdownProps) {
  const { provider, setPreferredProvider } = usePreferredProvider();

  const handleSelect = (next: StreamingProvider) => {
    setPreferredProvider(next);
    onClose?.();
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#141414]/95 p-3 shadow-2xl backdrop-blur-xl">
      <p className="mb-2 flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wider text-white/40">
        <MonitorPlay size={12} />
        Streaming network
      </p>
      <StreamingSourcePicker
        selected={provider}
        onSelect={handleSelect}
        compact
      />
    </div>
  );
}

export function StreamingSourceBadge({ className }: { className?: string }) {
  const { provider } = usePreferredProvider();
  const label = STREAMING_PROVIDERS.find((p) => p.id === provider)?.label ?? provider;

  return (
    <span
      className={cn(
        "hidden rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent sm:inline",
        className
      )}
    >
      {label}
    </span>
  );
}
