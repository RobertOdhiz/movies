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
    <section className="mb-8 px-4">
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
      <div className="group/row relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover/row:opacity-100"
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
                className="w-36 shrink-0"
              />
            );
          })}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover/row:opacity-100"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </section>
  );
}
