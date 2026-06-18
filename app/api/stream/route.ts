import { NextRequest, NextResponse } from "next/server";
import { resolveStream } from "@/lib/stream-extractor";
import type { MediaType } from "@/lib/types";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tmdbId = params.get("tmdbId");
  const type = params.get("type") as MediaType | null;
  const season = params.get("season");
  const episode = params.get("episode");

  if (!tmdbId || !type) {
    return NextResponse.json(
      { error: "tmdbId and type are required" },
      { status: 400 }
    );
  }

  try {
    const result = await resolveStream({
      tmdbId: parseInt(tmdbId, 10),
      type,
      season: season ? parseInt(season, 10) : undefined,
      episode: episode ? parseInt(episode, 10) : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stream resolution failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
