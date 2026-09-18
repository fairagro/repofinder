import { API_BASE, json } from "@/app/api/_lib/http";
import { FAIRNESS_CRITERIA } from "@/app/components/utils/fairnessConstants";

export const dynamic = "force-static";

/** The 20 FAIRness criteria assessed in RDI manager interviews, mapped to the RDA FAIR Data Maturity Model. */
export function GET() {
  return json({
    meta: { total: FAIRNESS_CRITERIA.length },
    data: FAIRNESS_CRITERIA.map((c) => ({ ...c, links: { self: `${API_BASE}/indicators/${c.key}` } })),
  });
}
