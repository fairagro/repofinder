import { API_BASE, json, serverError } from "@/app/api/_lib/http";
import { fairnessMatrix } from "@/app/api/_lib/rdi";
import { FAIRNESS_CRITERIA, FAIR_PILLARS } from "@/app/components/utils/fairnessConstants";

export const dynamic = "force-static";

/** Every repository as one row: pillar scores plus met / not met / not applicable / unknown for each of the 20 criteria. */
export function GET() {
  try {
    const rows = fairnessMatrix();
    return json({
      meta: {
        total: rows.length,
        columns: ["id", "title", ...FAIR_PILLARS, ...FAIRNESS_CRITERIA.map((c) => c.field)],
        cellValues: ["met", "not met", "not applicable", "unknown"],
      },
      links: { csv: `${API_BASE}/fairness/csv`, stats: `${API_BASE}/fairness/stats`, indicators: `${API_BASE}/indicators` },
      data: rows,
    });
  } catch (error) {
    return serverError(error);
  }
}
