import { getPlatformName } from "@/lib/watch-platform";
import type { WatchPlatformFilter } from "@/lib/watch-platform";
import { cn } from "@/lib/utils";

const REGION_LABELS: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
};

export function PlatformFilterNotice({
  filter,
  className,
}: {
  filter: WatchPlatformFilter;
  className?: string;
}) {
  if (!filter.providerId) return null;

  const platform = getPlatformName(filter.providerId);
  const region = REGION_LABELS[filter.region] ?? filter.region;

  return (
    <div
      className={cn(
        "mb-4 rounded-2xl border border-accent/20 bg-accent/10 px-3 py-2.5 text-xs text-accent/90 sm:px-4 sm:text-sm",
        className
      )}
    >
      Showing titles available on <strong className="text-accent">{platform}</strong> in{" "}
      {region}. Change via the platform filter in the nav bar.
    </div>
  );
}
