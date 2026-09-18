// Small response helpers shared by every route handler under /api.
import { NextResponse } from "next/server";

export { API_BASE, SITE_URL } from "./config";

const CACHE_HEADERS = { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" };

export function json(body: unknown, init: ResponseInit = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: { ...CACHE_HEADERS, ...(init.headers || {}) },
  });
}

export function text(body: string, contentType: string, init: ResponseInit = {}) {
  return new NextResponse(body, {
    ...init,
    headers: { "Content-Type": contentType, ...CACHE_HEADERS, ...(init.headers || {}) },
  });
}

export function notFound(detail: string) {
  return NextResponse.json({ error: { status: 404, title: "Not Found", detail } }, { status: 404 });
}

export function badRequest(detail: string) {
  return NextResponse.json({ error: { status: 400, title: "Bad Request", detail } }, { status: 400 });
}

export function serverError(error: unknown) {
  console.error("API error:", error);
  return NextResponse.json({ error: { status: 500, title: "Internal Server Error" } }, { status: 500 });
}
