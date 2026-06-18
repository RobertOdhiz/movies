import { NextRequest, NextResponse } from "next/server";
import {
  getMovieDetails,
  getTvDetails,
  getSeasonEpisodes,
  getTrending,
  getNowPlaying,
  getPopular,
  getTvRecommendations,
} from "@/lib/tmdb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const segments = path ?? [];

  try {
    if (segments[0] === "movie" && segments[1] && segments.length === 2) {
      const data = await getMovieDetails(parseInt(segments[1], 10));
      return NextResponse.json(data);
    }

    if (segments[0] === "tv" && segments[1] && segments.length === 2) {
      const data = await getTvDetails(parseInt(segments[1], 10));
      return NextResponse.json(data);
    }

    if (
      segments[0] === "tv" &&
      segments[1] &&
      segments[2] === "recommendations" &&
      segments.length === 3
    ) {
      const data = await getTvRecommendations(parseInt(segments[1], 10));
      return NextResponse.json({ results: data });
    }

    if (
      segments[0] === "tv" &&
      segments[1] &&
      segments[2] === "season" &&
      segments[3]
    ) {
      const episodes = await getSeasonEpisodes(
        parseInt(segments[1], 10),
        parseInt(segments[3], 10)
      );
      return NextResponse.json({ episodes });
    }

    if (segments[0] === "trending") {
      const data = await getTrending(
        (segments[1] as "all" | "movie" | "tv") ?? "all"
      );
      return NextResponse.json({ results: data });
    }

    if (segments[0] === "now-playing") {
      const data = await getNowPlaying();
      return NextResponse.json({ results: data });
    }

    if (segments[0] === "popular" && segments[1]) {
      const data = await getPopular(segments[1] as "movie" | "tv");
      return NextResponse.json({ results: data });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "TMDB fetch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
