import { serverError, text } from "@/app/api/_lib/http";
import { fairnessMatrix } from "@/app/api/_lib/rdi";
import { FAIRNESS_CRITERIA, FAIR_PILLARS } from "@/app/components/utils/fairnessConstants";

export const dynamic = "force-static";

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function GET() {
  try {
    const columns = ["id", "title", "score", ...FAIR_PILLARS, ...FAIRNESS_CRITERIA.map((c) => c.field)];
    const lines = [columns.join(","), ...fairnessMatrix().map((row) => columns.map((c) => cell(row[c])).join(","))];
    return text(lines.join("\r\n") + "\r\n", "text/csv; charset=utf-8", {
      headers: { "Content-Disposition": 'inline; filename="fairagro-rdi-fairness.csv"' },
    });
  } catch (error) {
    return serverError(error);
  }
}
