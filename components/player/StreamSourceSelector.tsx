"use client";

import { cn } from "@/lib/utils";
import { STREAMING_PROVIDERS } from "@/lib/streaming-providers";
import type { StreamingProvider } from "@/lib/types";

interface StreamSourceSelectorProps {
  selected: StreamingProvider;
  onSelect: (provider: StreamingProvider) => void;
  className?: string;
}

export function StreamSourceSelector({
  selected,
  onSelect,
  className,
}: StreamSourceSelectorProps) {
  return (
    <aside className={cn("flex flex-col gap-3", className)}>
      <p className="text-xs font-medium uppercase tracking-wider text-white/40">
        Network
      </p>
      <p className="text-[11px] leading-relaxed text-white/35">
        Synced with your global preference in the nav bar.
      </p>

      <div className="flex flex-row gap-2 lg:flex-col">
        {STREAMING_PROVIDERS.map((p) => {
          const isActive = selected === p.id;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={cn(
                "flex-1 rounded-2xl px-4 py-3 text-center text-sm font-semibold transition-all duration-200 lg:w-full lg:text-left",
                isActive
                  ? "bg-accent text-black shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                  : "glass text-white/50 hover:bg-white/10 hover:text-white/80"
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
