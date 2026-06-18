"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroSection } from "./HeroSection";
import { CastSection } from "./CastSection";
import type { HeroSlide } from "@/lib/types";

interface HeroCarouselProps {
  slides: HeroSlide[];
}

type Direction = "next" | "prev";

const TRANSITION_MS = 550;

function SlideView({ slide }: { slide: HeroSlide }) {
  return (
    <HeroSection
      title={slide.title}
      overview={slide.overview}
      backdropPath={slide.backdropPath}
      posterPath={slide.posterPath}
      rating={slide.rating}
      year={slide.year}
      runtime={slide.runtime}
      seasons={slide.seasons}
      genres={slide.genres}
      trailerKey={slide.trailerKey}
      mediaType={slide.mediaType}
      mediaId={slide.id}
    />
  );
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");
  const [castVisible, setCastVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const count = slides.length;

  const goTo = useCallback(
    (index: number, dir: Direction) => {
      if (count === 0 || transitioning) return;

      const nextIndex = ((index % count) + count) % count;
      if (nextIndex === activeIndex) return;

      if (timerRef.current) clearTimeout(timerRef.current);

      setFromIndex(activeIndex);
      setToIndex(nextIndex);
      setDirection(dir);
      setTransitioning(true);
      setCastVisible(false);

      timerRef.current = setTimeout(() => {
        setActiveIndex(nextIndex);
        setTransitioning(false);
        setCastVisible(true);
      }, TRANSITION_MS);
    },
    [activeIndex, count, transitioning]
  );

  const prev = useCallback(() => goTo(activeIndex - 1, "prev"), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1, "next"), [activeIndex, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (count === 0) return null;

  const activeSlide = slides[activeIndex];
  const outgoingSlide = slides[fromIndex];
  const incomingSlide = slides[toIndex];

  const outClass =
    direction === "next" ? "hero-slide-out-left" : "hero-slide-out-right";
  const inClass =
    direction === "next" ? "hero-slide-in-right" : "hero-slide-in-left";

  return (
    <>
      <div className="relative mx-4 mb-8 overflow-hidden rounded-3xl">
        <div className="relative min-h-[520px]">
          {transitioning ? (
            <>
              <div className={cn("absolute inset-0 z-0", outClass)}>
                <SlideView slide={outgoingSlide} />
              </div>
              <div className={cn("absolute inset-0 z-10", inClass)}>
                <SlideView slide={incomingSlide} />
              </div>
            </>
          ) : (
            <div className="relative">
              <SlideView slide={activeSlide} />
            </div>
          )}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              disabled={transitioning}
              aria-label="Previous featured title"
              className="pointer-events-auto absolute left-6 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-105 disabled:opacity-40"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={next}
              disabled={transitioning}
              aria-label="Next featured title"
              className="pointer-events-auto absolute right-6 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-105 disabled:opacity-40"
            >
              <ChevronRight size={22} />
            </button>

            <div className="pointer-events-auto absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    goTo(i, i > activeIndex ? "next" : "prev")
                  }
                  disabled={transitioning}
                  aria-label={`Go to ${s.title}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 disabled:opacity-40",
                    i === activeIndex
                      ? "w-8 bg-accent"
                      : "w-1.5 bg-white/40 hover:bg-white/60"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div
        className={cn(
          "transition-opacity duration-300",
          castVisible ? "hero-cast-fade-in opacity-100" : "opacity-0"
        )}
      >
        <CastSection cast={activeSlide.cast} />
      </div>
    </>
  );
}
