/**
 * Origin used for absolute links inside API payloads and docs.
 * Unset (default) → links are root-relative ("/api/...") and therefore correct on any host.
 * Set NEXT_PUBLIC_SITE_URL at build time (e.g. https://inventory.example.org) to emit absolute URLs.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
export const API_BASE = `${SITE_URL}/api`;
