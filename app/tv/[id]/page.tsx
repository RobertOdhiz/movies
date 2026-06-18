import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TvDetailClient } from "./TvDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TvPage({ params }: PageProps) {
  const { id } = await params;
  const tvId = parseInt(id, 10);

  if (isNaN(tvId)) notFound();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <TvDetailClient tvId={tvId} />
    </Suspense>
  );
}
