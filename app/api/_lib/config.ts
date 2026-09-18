/** Public origin used for absolute links inside API payloads (JSON-LD @id, HATEOAS links). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://rdi-fairness-interviews.vercel.app").replace(/\/$/, "");
export const API_BASE = `${SITE_URL}/api`;
