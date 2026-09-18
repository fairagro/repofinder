import { API_BASE, json, notFound } from "@/app/api/_lib/http";
import { FAIRNESS_CRITERIA } from "@/app/components/utils/fairnessConstants";

export const dynamic = "force-static";

export function generateStaticParams() {
  return FAIRNESS_CRITERIA.map((c) => ({ key: c.key }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const criterion = FAIRNESS_CRITERIA.find((c) => c.key === key || c.field === key);
  if (!criterion) return notFound(`No indicator with key or field "${key}"`);
  return json({ ...criterion, links: { self: `${API_BASE}/indicators/${criterion.key}`, all: `${API_BASE}/indicators` } });
}
