"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn, clipWords, tmdbImage } from "@/lib/utils";

const PREVIEW_WIDTH = 280;
const PREVIEW_GAP = 12;

interface MediaCardProps {
  href: string;
  title: string;
  posterPath: string | null;
  rating?: number;
  overview?: string;
  genres?: string;
  year?: string;
  badge?: string;
  subtitle?: string;
  className?: string;
  showMetaBelow?: boolean;
}

export function MediaCard({
  href,
  title,
  posterPath,
  rating,
  overview,
  genres,
  year,
  badge,
  subtitle,
  className,
  showMetaBelow = false,
}: MediaCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const updatePosition = useCallback(() => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;
    const showRight =
      spaceRight >= PREVIEW_WIDTH + PREVIEW_GAP || spaceRight >= spaceLeft;

    let left = showRight
      ? rect.right + PREVIEW_GAP
      : rect.left - PREVIEW_WIDTH - PREVIEW_GAP;

    let top = rect.top + rect.height / 2;
    const previewHeight = 220;
    const minTop = previewHeight / 2 + 8;
    const maxTop = window.innerHeight - previewHeight / 2 - 8;
    top = Math.min(Math.max(top, minTop), maxTop);

    left = Math.min(
      Math.max(left, 8),
      window.innerWidth - PREVIEW_WIDTH - 8
    );

    setCoords({ top, left });
  }, []);

  const showPreview = () => {
    updatePosition();
    setVisible(true);
  };

  const hidePreview = () => setVisible(false);

  useEffect(() => {
    if (!visible) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [visible, updatePosition]);

  const clippedOverview = clipWords(overview, 25);

  return (
    <>
      <Link
        ref={cardRef}
        href={href}
        onMouseEnter={showPreview}
        onMouseLeave={hidePreview}
        onFocus={showPreview}
        onBlur={hidePreview}
        className={cn(
          "group/card block transition-transform hover:scale-105",
          className
        )}
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-800">
          <img
            src={tmdbImage(posterPath, "w342")}
            alt={title}
            className="h-full w-full object-cover"
          />
          {badge && (
            <span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium uppercase text-white/80">
              {badge}
            </span>
          )}
        </div>
        {showMetaBelow && (
          <>
            <p className="mt-2 truncate text-sm font-medium text-white">{title}</p>
            {(subtitle || year || rating !== undefined) && (
              <p className="truncate text-xs text-white/50">
                {[subtitle, year, rating !== undefined ? rating.toFixed(1) : ""]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </>
        )}
      </Link>

      {mounted &&
        visible &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[200] w-[280px] -translate-y-1/2 rounded-xl border border-white/10 bg-[#1a1a1a]/95 p-4 shadow-2xl backdrop-blur-xl"
            style={{ top: coords.top, left: coords.left }}
            role="tooltip"
          >
            <p className="text-base font-semibold leading-snug text-white">{title}</p>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              {rating !== undefined && rating > 0 && (
                <span className="inline-flex items-center gap-1 font-medium text-accent">
                  <Star size={12} className="fill-accent" />
                  {rating.toFixed(1)}
                </span>
              )}
              {year && <span className="text-white/50">{year}</span>}
            </div>

            {genres && (
              <p className="mt-2 text-xs font-medium text-white/70">{genres}</p>
            )}

            {subtitle && (
              <p className="mt-2 text-xs text-white/50">{subtitle}</p>
            )}

            {clippedOverview && (
              <p className="mt-3 text-xs leading-relaxed text-white/60">
                {clippedOverview}
              </p>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
