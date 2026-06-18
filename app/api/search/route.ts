import { NextRequest, NextResponse } from "next/server";
import { searchMultiPaginated } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  const page = Math.max(1, parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10) || 1);

  if (!query?.trim()) {
    return NextResponse.json({ results: [], page: 1, totalPages: 0, totalResults: 0 });
  }

  try {
    const data = await searchMultiPaginated(query, page);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
