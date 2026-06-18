import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "cloudfront.net",
  "amazonaws.com",
  "akamaized.net",
  "fastly.net",
  "bunnycdn.com",
  "m3u8",
  "mp4",
  "stream",
  "cdn",
  "video",
  "media",
  "pluto",
  "embed",
  "proxy",
  "workers.dev",
  "vercel.app",
];

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    return ALLOWED_HOSTS.some((h) => host.includes(h));
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get("url");

  if (!targetUrl || !isAllowedUrl(targetUrl)) {
    return NextResponse.json({ error: "Invalid or disallowed URL" }, { status: 400 });
  }

  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: new URL(targetUrl).origin + "/",
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
    }

    const contentType = res.headers.get("content-type") ?? "application/octet-stream";
    const body = await res.arrayBuffer();

    const headers = new Headers({
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    });

    if (contentType.includes("mpegurl") || targetUrl.includes(".m3u8")) {
      let text = new TextDecoder().decode(body);
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf("/") + 1);

      text = text.replace(/^(?!#)([^\n#]+)$/gm, (line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("http")) {
          return `/api/proxy?url=${encodeURIComponent(trimmed)}`;
        }
        if (trimmed && !trimmed.startsWith("#")) {
          const absolute = new URL(trimmed, baseUrl).toString();
          return `/api/proxy?url=${encodeURIComponent(absolute)}`;
        }
        return line;
      });

      return new NextResponse(text, { headers: { ...Object.fromEntries(headers), "Content-Type": "application/vnd.apple.mpegurl" } });
    }

    return new NextResponse(body, { headers });
  } catch {
    return NextResponse.json({ error: "Proxy failed" }, { status: 502 });
  }
}
