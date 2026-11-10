import { json, serverError } from "@/app/api/_lib/http";
import { fairnessStats } from "@/app/api/_lib/rdi";

export const dynamic = "force-static";

/** Aggregate view across all repositories: average pillar scores and per-criterion met rates (no overall score, no ranking). */
export function GET() {
  try {
    return json(fairnessStats());
  } catch (error) {
    return serverError(error);
  }
}
