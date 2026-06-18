import { NextRequest, NextResponse } from "next/server";
import { getWatchProviderOptions } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get("region") ?? "US";

  try {
    const providers = await getWatchProviderOptions(region);
    return NextResponse.json({ providers, region });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load providers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
