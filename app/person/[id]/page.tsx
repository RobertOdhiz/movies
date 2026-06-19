import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PersonFilmography } from "@/components/person/PersonFilmography";
import { getPersonCombinedCredits, getPersonDetails } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/utils";
import type { MediaType } from "@/lib/types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; type?: string }>;
}

function parseFilter(type?: string): "all" | MediaType {
  if (type === "movie" || type === "tv") return type;
  return "all";
}

export default async function PersonPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { page: pageParam, type: typeParam } = await searchParams;
  const personId = parseInt(id, 10);
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const filter = parseFilter(typeParam);

  if (isNaN(personId)) notFound();

  let person;
  let credits;
  try {
    [person, credits] = await Promise.all([
      getPersonDetails(personId),
      getPersonCombinedCredits(personId),
    ]);
  } catch {
    notFound();
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl pb-12 pt-2">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="mx-auto h-40 w-40 shrink-0 overflow-hidden rounded-full bg-zinc-800 sm:mx-0">
            <img
              src={tmdbImage(person.profile_path, "w342")}
              alt={person.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{person.name}</h1>
            {person.known_for_department && (
              <p className="mt-1 text-sm text-accent">{person.known_for_department}</p>
            )}
            {(person.birthday || person.place_of_birth) && (
              <p className="mt-2 text-sm text-white/50">
                {[person.birthday, person.place_of_birth].filter(Boolean).join(" · ")}
              </p>
            )}
            {person.biography && (
              <p className="mt-4 line-clamp-6 text-sm leading-relaxed text-white/70">
                {person.biography}
              </p>
            )}
          </div>
        </div>

        <PersonFilmography
          personId={personId}
          credits={credits}
          page={page}
          filter={filter}
        />
      </div>
    </AppShell>
  );
}
