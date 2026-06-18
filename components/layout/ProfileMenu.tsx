"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Heart,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getInitials,
  getUserPreferences,
  saveUserPreferences,
  type StreamingProvider,
} from "@/lib/user-preferences";

const providers: { id: StreamingProvider; label: string }[] = [
  { id: "vidfast", label: "VidFast" },
  { id: "vidrock", label: "VidRock" },
  { id: "vidsrc", label: "VidSrc" },
];

interface ProfileMenuProps {
  onClose: () => void;
}

export function ProfileMenu({ onClose }: ProfileMenuProps) {
  const [prefs, setPrefs] = useState(getUserPreferences);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(prefs.displayName);

  useEffect(() => {
    const sync = () => setPrefs(getUserPreferences());
    window.addEventListener("movies-prefs-change", sync);
    return () => window.removeEventListener("movies-prefs-change", sync);
  }, []);

  const saveName = () => {
    const trimmed = nameInput.trim() || "Guest";
    const updated = saveUserPreferences({ displayName: trimmed });
    setPrefs(updated);
    setEditing(false);
  };

  const setProvider = (provider: StreamingProvider) => {
    const updated = saveUserPreferences({ defaultProvider: provider });
    setPrefs(updated);
  };

  const menuLinks = [
    { href: "/history", icon: Clock, label: "Watch history" },
    { href: "/favorites", icon: Heart, label: "Favorites" },
  ];

  return (
    <div className="absolute top-full right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#141414]/95 shadow-2xl backdrop-blur-xl">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-orange-400 text-sm font-bold text-black">
            {getInitials(prefs.displayName)}
          </div>
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="flex gap-2">
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                  className="w-full rounded-lg bg-white/10 px-2 py-1 text-sm text-white outline-none ring-accent focus:ring-1"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={saveName}
                  className="shrink-0 rounded-lg bg-accent px-2 py-1 text-xs font-semibold text-black"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <p className="truncate text-sm font-semibold text-white">
                  {prefs.displayName}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(prefs.displayName);
                    setEditing(true);
                  }}
                  className="text-xs text-accent hover:underline"
                >
                  Edit name
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5">
          <Sparkles size={12} className="text-accent" />
          <span className="text-xs text-accent/90">Browsing as guest — no account needed</span>
        </div>
      </div>

      <div className="p-2">
        {menuLinks.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}

        <div className="my-2 border-t border-white/10" />

        <div className="px-3 py-2">
          <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/40">
            <Settings size={12} />
            Default source
          </p>
          <div className="flex flex-col gap-1">
            {providers.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProvider(p.id)}
                className={cn(
                  "rounded-xl px-3 py-2 text-left text-sm transition-all",
                  prefs.defaultProvider === p.id
                    ? "bg-accent font-semibold text-black"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="my-2 border-t border-white/10" />

        <button
          type="button"
          onClick={() => {
            saveUserPreferences({ displayName: "Guest", defaultProvider: "vidfast" });
            setPrefs(getUserPreferences());
            setNameInput("Guest");
            setEditing(false);
            onClose();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={16} />
          Reset profile
        </button>
      </div>
    </div>
  );
}

export function useDisplayName() {
  const [name, setName] = useState("Guest");

  useEffect(() => {
    setName(getUserPreferences().displayName);
    const sync = () => setName(getUserPreferences().displayName);
    window.addEventListener("movies-prefs-change", sync);
    return () => window.removeEventListener("movies-prefs-change", sync);
  }, []);

  return name;
}

export function useProfileInitials() {
  const name = useDisplayName();
  return getInitials(name);
}
