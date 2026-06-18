import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaCard } from "@/components/media/MediaCard";
import { formatGenreIds } from "@/lib/genres";
import { cn, formatYear } from "@/lib/utils";
import type { TmdbSearchResult } from "@/lib/types";

interface SearchResultsGridProps {
  query: string;
  results: TmdbSearchResult[];
  page: number;
  totalPages: number;
  totalResults: number;
}

function buildHref(query: string, page: number): string {
  const params = new URLSearchParams({ q: query });
  if (page > 1) params.set("page", String(page));
  return `/search?${params}`;
}

export function SearchResultsGrid({
  query,
  results,
  page,
  totalPages,
  totalResults,
}: SearchResultsGridProps) {
  if (results.length === 0) {
    return <p className="text-white/50">No results found for &ldquo;{query}&rdquo;</p>;
  }

  return (
    <>
      <p className="mb-6 text-sm text-white/50">
        {totalResults.toLocaleString()} result{totalResults === 1 ? "" : "s"}
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {results.map((item) => {
          const title = item.title ?? item.name ?? "Unknown";
          const type = item.media_type ?? "movie";
          const href = type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
          const year = formatYear(item.release_date ?? item.first_air_date);
          const genres = formatGenreIds(item.genre_ids, type);

          return (
            <MediaCard
              key={`${type}-${item.id}`}
              href={href}
              title={title}
              posterPath={item.poster_path}
              rating={item.vote_average}
              overview={item.overview}
              genres={genres}
              year={year}
              badge={type}
              showMetaBelow
            />
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav
          className="mt-8 flex items-center justify-center gap-2"
          aria-label="Search pagination"
        >
          <Link
            href={buildHref(query, page - 1)}
            aria-disabled={page <= 1}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15",
              page <= 1 && "pointer-events-none opacity-30"
            )}
          >
            <ChevronLeft size={20} />
          </Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2
            )
            .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("ellipsis");
              acc.push(p);
              return acc;
            }, [])
            .map((item, i) =>
              item === "ellipsis" ? (
                <span key={`ellipsis-${i}`} className="px-1 text-white/40">
                  …
                </span>
              ) : (
                <Link
                  key={item}
                  href={buildHref(query, item)}
                  className={cn(
                    "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors",
                    item === page
                      ? "bg-accent text-black"
                      : "bg-white/10 text-white hover:bg-white/15"
                  )}
                >
                  {item}
                </Link>
              )
            )}

          <Link
            href={buildHref(query, page + 1)}
            aria-disabled={page >= totalPages}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15",
              page >= totalPages && "pointer-events-none opacity-30"
            )}
          >
            <ChevronRight size={20} />
          </Link>
        </nav>
      )}
    </>
  );
}
