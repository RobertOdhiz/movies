"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { tmdbImage, formatYear } from "@/lib/utils";
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
            const title = item.title ?? item.name ?? "Unknown";
            const type = mediaType ?? item.media_type ?? "movie";
            const href = type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
            const year = formatYear(item.release_date ?? item.first_air_date);

            return (
              <Link
                key={`${type}-${item.id}`}
                href={href}
                className="group/card w-36 shrink-0 transition-transform hover:scale-105"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-800">
                  <img
                    src={tmdbImage(item.poster_path, "w342")}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover/card:opacity-100" />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 transition-opacity group-hover/card:opacity-100">
                    <p className="truncate text-xs font-medium text-white">{title}</p>
                    <p className="text-xs text-white/60">{year}</p>
                  </div>
                </div>
              </Link>
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
