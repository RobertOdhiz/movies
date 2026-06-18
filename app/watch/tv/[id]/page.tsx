import { AppShell } from "@/components/layout/AppShell";
import { WatchTvExperience } from "@/components/watch/WatchTvExperience";
import { getTvDetails, getSeasonEpisodes } from "@/lib/tmdb";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; episode?: string }>;
}

export default async function WatchTvPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { season: seasonParam, episode: episodeParam } = await searchParams;
  const tvId = parseInt(id, 10);
  const season = parseInt(seasonParam ?? "1", 10);
  const episode = parseInt(episodeParam ?? "1", 10);

  if (isNaN(tvId)) notFound();

  let show;
  let episodes;
  try {
    [show, episodes] = await Promise.all([
      getTvDetails(tvId),
      getSeasonEpisodes(tvId, season),
    ]);
  } catch {
    notFound();
  }

  return (
    <AppShell>
      <WatchTvExperience
        show={{
          id: show.id,
          name: show.name,
          poster_path: show.poster_path,
          number_of_seasons: show.number_of_seasons,
          seasons: show.seasons,
        }}
        season={season}
        episode={episode}
        episodes={episodes}
      />
    </AppShell>
  );
}
