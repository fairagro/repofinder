import { API_BASE, json, serverError } from "@/app/api/_lib/http";
import { fairnessMatrix } from "@/app/api/_lib/rdi";
import { FAIRNESS_CRITERIA, FAIR_PILLARS } from "@/app/components/utils/fairnessConstants";

export const dynamic = "force-static";

/** Every repository as one row: pillar scores plus the yes/no/unknown answer for each of the 20 criteria. */
export function GET() {
  try {
    const rows = fairnessMatrix();
    return json({
      meta: {
        total: rows.length,
        columns: ["id", "title", "score", ...FAIR_PILLARS, ...FAIRNESS_CRITERIA.map((c) => c.field)],
        cellValues: ["met", "not met", "unknown"],
      },
      links: { csv: `${API_BASE}/fairness/csv`, stats: `${API_BASE}/fairness/stats`, indicators: `${API_BASE}/indicators` },
      data: rows,
    });
  } catch (error) {
    return serverError(error);
  }
}
