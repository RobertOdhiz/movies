import { AppShell } from "@/components/layout/AppShell";
import { ContentRow } from "@/components/home/ContentRow";
import { getPopular, getTrending } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export default async function TvPage() {
  const [popular, trending] = await Promise.all([
    getPopular("tv").catch(() => []),
    getTrending("tv").catch(() => []),
  ]);

  return (
    <AppShell>
      <div className="px-4 pb-8">
        <h1 className="mb-6 text-3xl font-bold text-white">TV Series</h1>
      </div>
      <ContentRow title="Trending TV" items={trending} mediaType="tv" />
      <ContentRow title="Popular TV Series" items={popular} mediaType="tv" />
    </AppShell>
  );
}
