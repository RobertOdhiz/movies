import { AppShell } from "@/components/layout/AppShell";
import { WatchlistGrid } from "@/components/home/WatchlistGrid";

export default function FavoritesPage() {
  return (
    <AppShell>
      <div className="px-4 pb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Watchlist</h1>
        <p className="mb-6 text-sm text-white/50">Titles you&apos;ve saved to watch later</p>
        <WatchlistGrid />
      </div>
    </AppShell>
  );
}
