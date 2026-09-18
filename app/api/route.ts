import { API_BASE, json, SITE_URL } from "./_lib/http";

export const dynamic = "force-static";

export function GET() {
  return json({
    name: "FAIRagro RDI Inventory API",
    version: "1.0",
    description:
      "Read-only JSON API over the FAIRness assessments of research data infrastructures (RDIs) in the FAIRagro Search Hub.",
    documentation: `${SITE_URL}/api-docs`,
    openapi: `${API_BASE}/openapi`,
    endpoints: {
      repositories: `${API_BASE}/resource/repository?q=&subject=&collection=&minScore=&sort=&order=&page=&limit=`,
      repository: `${API_BASE}/resource/repository/{rdiId}`,
      repositoryFairness: `${API_BASE}/resource/repository/{rdiId}/fairness`,
      repositoryRe3data: `${API_BASE}/resource/repository/{rdiId}/re3data`,
      repositoryRaw: `${API_BASE}/resource/repository/{rdiId}/raw`,
      fairnessMatrix: `${API_BASE}/fairness`,
      fairnessCsv: `${API_BASE}/fairness/csv`,
      fairnessStats: `${API_BASE}/fairness/stats`,
      indicators: `${API_BASE}/indicators`,
      indicator: `${API_BASE}/indicators/{key}`,
      facets: `${API_BASE}/facets`,
      schema: `${API_BASE}/schema`,
      schemaFairness: `${API_BASE}/schema/fairness`,
    },
  });
}
