"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { MediaCard } from "@/components/media/MediaCard";
import { formatGenreIds } from "@/lib/genres";
import { formatYear } from "@/lib/utils";
import type { TmdbSearchResult } from "@/lib/types";

interface ContentRowProps {
  title: string;
  items: TmdbSearchResult[];
  mediaType?: "movie" | "tv";
}

export function ContentRow({ title, items, mediaType }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
    setTimeout(updateScroll, 300);
  };

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-base font-semibold text-white sm:text-lg">{title}</h2>
      <div className="group/row relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white opacity-100 sm:-left-2 sm:h-10 sm:w-10 md:opacity-0 md:group-hover/row:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={updateScroll}
          className="scrollbar-hide flex gap-3 overflow-x-auto pb-2"
        >
          {items.map((item) => {
            const itemTitle = item.title ?? item.name ?? "Unknown";
            const type = mediaType ?? item.media_type ?? "movie";
            const href = type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
            const year = formatYear(item.release_date ?? item.first_air_date);
            const genres = formatGenreIds(item.genre_ids, type);

            return (
              <MediaCard
                key={`${type}-${item.id}`}
                href={href}
                title={itemTitle}
                posterPath={item.poster_path}
                rating={item.vote_average}
                overview={item.overview}
                genres={genres}
                year={year}
                className="w-28 shrink-0 sm:w-32 md:w-36"
              />
            );
          })}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white opacity-100 sm:-right-2 sm:h-10 sm:w-10 md:opacity-0 md:group-hover/row:opacity-100"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </section>
  );
}
