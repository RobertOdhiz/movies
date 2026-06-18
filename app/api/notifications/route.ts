import { NextResponse } from "next/server";
import { getLatestMovies, getLatestEpisodes } from "@/lib/vidsrc";

export async function GET() {
  try {
    const [movies, episodes] = await Promise.all([
      getLatestMovies(1),
      getLatestEpisodes(1),
    ]);

    const notifications = [
      ...movies.results.slice(0, 3).map((m) => ({
        id: `movie-${m.tmdb_id}`,
        type: "new_release" as const,
        title: m.title ?? "New movie added",
        message: `Now available in ${m.quality}`,
        href: `/movie/${m.tmdb_id}`,
        time: m.time_added,
      })),
      ...episodes.results.slice(0, 2).map((e) => ({
        id: `ep-${e.tmdb_id}-${e.season}-${e.episode}`,
        type: "new_episode" as const,
        title: e.show_title ?? "New episode",
        message: `Season ${e.season}, Episode ${e.episode} · ${e.quality}`,
        href: `/tv/${e.tmdb_id}?season=${e.season}&episode=${e.episode}`,
        time: e.time_added,
      })),
    ];

    return NextResponse.json({ notifications });
  } catch {
    return NextResponse.json({
      notifications: [
        {
          id: "welcome",
          type: "info",
          title: "Welcome to movies",
          message: "Search, browse, and stream your favorites.",
          href: "/",
          time: new Date().toISOString(),
        },
      ],
    });
  }
}
