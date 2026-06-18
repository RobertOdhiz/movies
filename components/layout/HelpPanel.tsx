"use client";

import { Keyboard, Play, Search, Volume2 } from "lucide-react";

const tips = [
  {
    icon: Search,
    title: "Search anything",
    body: "Type a movie or show name in the search bar. Results appear instantly as you type.",
  },
  {
    icon: Play,
    title: "Switch streaming sources",
    body: "If playback stutters, pick VidFast, VidRock, or VidSrc from the source panel beside the player.",
  },
  {
    icon: Volume2,
    title: "Trailers",
    body: "Hero trailers autoplay muted. Tap the speaker icon in the bottom-right corner to hear audio.",
  },
  {
    icon: Keyboard,
    title: "Keyboard shortcut",
    body: "Press / anywhere to jump straight to search.",
  },
];

interface HelpPanelProps {
  onClose: () => void;
}

export function HelpPanel({ onClose }: HelpPanelProps) {
  return (
    <div className="absolute top-full right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#141414]/95 shadow-2xl backdrop-blur-xl">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-semibold text-white">Help & tips</p>
        <p className="text-xs text-white/40">Get the most out of movies</p>
      </div>

      <div className="max-h-80 overflow-y-auto p-2">
        {tips.map((tip) => (
          <div
            key={tip.title}
            className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-white/5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
              <tip.icon size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{tip.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-white/50">{tip.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-white/10 py-2 text-xs font-medium text-white transition-colors hover:bg-white/15"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
