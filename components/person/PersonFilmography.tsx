import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaCard } from "@/components/media/MediaCard";
import { cn, formatYear } from "@/lib/utils";
import type { MediaType, TmdbPersonCredit } from "@/lib/types";

const PAGE_SIZE = 24;

type FilterType = "all" | MediaType;

interface PersonFilmographyProps {
  personId: number;
  credits: TmdbPersonCredit[];
  page: number;
  filter: FilterType;
}

function buildHref(personId: number, page: number, filter: FilterType): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (filter !== "all") params.set("type", filter);
  const query = params.toString();
  return query ? `/person/${personId}?${query}` : `/person/${personId}`;
}

export function PersonFilmography({
  personId,
  credits,
  page,
  filter,
}: PersonFilmographyProps) {
  const filtered =
    filter === "all" ? credits : credits.filter((c) => c.mediaType === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "movie", label: "Movies" },
    { value: "tv", label: "TV Shows" },
  ];

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">
          Filmography
          <span className="ml-2 text-sm font-normal text-white/50">
            ({filtered.length})
          </span>
        </h2>

        <div className="flex gap-2">
          {filters.map(({ value, label }) => (
            <Link
              key={value}
              href={buildHref(personId, 1, value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                filter === value
                  ? "bg-accent text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-white/50">No credits found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((credit) => {
            const href =
              credit.mediaType === "tv"
                ? `/tv/${credit.id}`
                : `/movie/${credit.id}`;

            return (
              <MediaCard
                key={`${credit.mediaType}-${credit.id}-${credit.character}`}
                href={href}
                title={credit.title}
                posterPath={credit.posterPath}
                rating={credit.voteAverage}
                year={formatYear(credit.releaseDate)}
                badge={credit.mediaType}
                subtitle={`as ${credit.character}`}
                showMetaBelow
              />
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          className="mt-8 flex items-center justify-center gap-2"
          aria-label="Pagination"
        >
          <Link
            href={buildHref(personId, currentPage - 1, filter)}
            aria-disabled={currentPage <= 1}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15",
              currentPage <= 1 && "pointer-events-none opacity-30"
            )}
          >
            <ChevronLeft size={20} />
          </Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalPages ||
                Math.abs(p - currentPage) <= 2
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
                  href={buildHref(personId, item, filter)}
                  className={cn(
                    "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors",
                    item === currentPage
                      ? "bg-accent text-black"
                      : "bg-white/10 text-white hover:bg-white/15"
                  )}
                >
                  {item}
                </Link>
              )
            )}

          <Link
            href={buildHref(personId, currentPage + 1, filter)}
            aria-disabled={currentPage >= totalPages}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15",
              currentPage >= totalPages && "pointer-events-none opacity-30"
            )}
          >
            <ChevronRight size={20} />
          </Link>
        </nav>
      )}
    </section>
  );
}
