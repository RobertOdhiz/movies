import { AppShell } from "@/components/layout/AppShell";
import { SearchResultsGrid } from "@/components/search/SearchResultsGrid";
import { PlatformFilterNotice } from "@/components/layout/PlatformFilterNotice";
import { searchCatalogPaginated } from "@/lib/catalog";
import { getServerWatchPlatformFilter } from "@/lib/server-watch-platform";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const filter = await getServerWatchPlatformFilter();

  const data = query
    ? await searchCatalogPaginated(query, page, filter).catch(() => ({
        results: [],
        page: 1,
        totalPages: 0,
        totalResults: 0,
      }))
    : { results: [], page: 1, totalPages: 0, totalResults: 0 };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl pb-12">
        <PlatformFilterNotice filter={filter} className="mb-4" />
        <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Search</h1>
        {query ? (
          <>
            <p className="mb-6 text-white/60">
              Results for &ldquo;{query}&rdquo;
            </p>
            <SearchResultsGrid
              query={query}
              results={data.results}
              page={data.page}
              totalPages={data.totalPages}
              totalResults={data.totalResults}
            />
          </>
        ) : (
          <p className="text-white/50">
            Enter a search term to find movies and TV series.
          </p>
        )}
      </div>
    </AppShell>
  );
}
