import { API_BASE, json, serverError } from "@/app/api/_lib/http";
import { facets } from "@/app/api/_lib/rdi";

export const dynamic = "force-static";

/** Distinct subjects and collections with repository counts — the values accepted by the list endpoint's filters. */
export function GET() {
  try {
    return json({
      ...facets(),
      links: { repositories: `${API_BASE}/resource/repository` },
    });
  } catch (error) {
    return serverError(error);
  }
}
