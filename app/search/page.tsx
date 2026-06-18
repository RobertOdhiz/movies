"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { tmdbImage, formatYear } from "@/lib/utils";
import type { TmdbSearchResult } from "@/lib/types";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((d) => setResults(d.results ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  if (!query) {
    return (
      <p className="text-white/50">Enter a search term to find movies and TV series.</p>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (results.length === 0) {
    return <p className="text-white/50">No results found for &ldquo;{query}&rdquo;</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {results.map((item) => {
        const title = item.title ?? item.name ?? "Unknown";
        const type = item.media_type ?? "movie";
        const href = type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;

        return (
          <Link key={`${type}-${item.id}`} href={href} className="group">
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-800">
              <img
                src={tmdbImage(item.poster_path, "w342")}
                alt={title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <p className="mt-2 truncate text-sm font-medium text-white">{title}</p>
            <p className="text-xs text-white/50 capitalize">
              {type} · {formatYear(item.release_date ?? item.first_air_date)}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

export default function SearchPage() {
  return (
    <AppShell>
      <div className="px-4 pb-8">
        <h1 className="mb-6 text-3xl font-bold text-white">Search</h1>
        <Suspense fallback={<div className="text-white/50">Loading...</div>}>
          <SearchResults />
        </Suspense>
      </div>
    </AppShell>
  );
}
