import Link from "next/link";
import { tmdbImage } from "@/lib/utils";

interface CastSectionProps {
  cast: { id: number; name: string; character: string; profile_path: string | null }[];
}

export function CastSection({ cast }: CastSectionProps) {
  if (!cast.length) return null;

  return (
    <section className="mb-8 px-4">
      <h2 className="mb-4 text-lg font-semibold text-white">Cast</h2>
      <div className="flex flex-wrap gap-x-4 gap-y-6">
        {cast.slice(0, 15).map((person) => (
          <Link
            key={person.id}
            href={`/person/${person.id}`}
            className="group w-24 text-center transition-transform hover:scale-105"
          >
            <div className="mx-auto mb-2 h-24 w-24 overflow-hidden rounded-full bg-zinc-800 ring-2 ring-transparent transition-all group-hover:ring-accent/50">
              <img
                src={tmdbImage(person.profile_path, "w185")}
                alt={person.name}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="truncate text-xs font-medium text-white group-hover:text-accent">
              {person.name}
            </p>
            <p className="truncate text-xs text-white/50">{person.character}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
