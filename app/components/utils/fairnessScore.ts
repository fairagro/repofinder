// Pure FAIRness scoring over the raw `FAIRness` compound of an rf-rdis record.
// Used by the cards, the detail pages and the JSON API so every surface agrees.
import { FAIRNESS_CRITERIA, FAIR_PILLARS, type FairPillar } from "./fairnessConstants";
import { normalizeFairnessValue } from "./fairnessUtils";

export type Answer = "yes" | "no" | "unknown";

export interface CriterionResult {
  key: string;
  field: string;
  label: string;
  rdaCode: string;
  pillar: string;
  /** The interview answer as recorded. */
  answer: Answer;
  /** 1 = compliance / 0 = non-compliance as in the methodology paper; null when not assessed. */
  met: boolean | null;
  rawValue: unknown;
}

export interface PillarScore {
  /** Percentage of answered criteria that are met, 0-100 (null when nothing was answered). */
  score: number | null;
  met: number;
  answered: number;
  total: number;
}

export interface FairnessSummary {
  score: number | null;
  pillars: Record<FairPillar, PillarScore>;
  assessmentDate: string | null;
  assessmentMethod: string | null;
  overallFAIRScore: string | null;
}

/** Flattens the compound into { fieldName: rawAnswer }. */
export function answersByField(rawFairness: any): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const pillar of FAIR_PILLARS) {
    const group = rawFairness?.[pillar]?.value;
    if (!group || typeof group !== "object") continue;
    for (const [field, node] of Object.entries(group as Record<string, any>)) {
      out[field] = node && typeof node === "object" && "value" in node ? node.value : undefined;
    }
  }
  return out;
}

export function criteriaResults(rawFairness: any): CriterionResult[] {
  const byField = answersByField(rawFairness);
  return FAIRNESS_CRITERIA.map((crit) => {
    const answer = normalizeFairnessValue(byField[crit.field]);
    return {
      key: crit.key,
      field: crit.field,
      label: crit.label,
      rdaCode: crit.rdaCode,
      pillar: crit.pillar,
      answer,
      met: answer === "unknown" ? null : answer === "yes",
      rawValue: byField[crit.field] ?? null,
    };
  });
}

export function scoreResults(results: CriterionResult[]): PillarScore {
  const answered = results.filter((r) => r.met !== null).length;
  const met = results.filter((r) => r.met === true).length;
  return {
    score: answered > 0 ? Math.round((met / answered) * 100) : null,
    met,
    answered,
    total: results.length,
  };
}

export function fairnessSummary(rawFairness: any): FairnessSummary {
  const results = criteriaResults(rawFairness);
  const pillars = Object.fromEntries(
    FAIR_PILLARS.map((pillar) => [pillar, scoreResults(results.filter((r) => r.pillar.toLowerCase() === pillar))]),
  ) as Record<FairPillar, PillarScore>;
  const str = (key: string) => {
    const v = rawFairness?.[key]?.value;
    return typeof v === "string" && v.trim() !== "" ? v : null;
  };
  return {
    score: scoreResults(results).score,
    pillars,
    assessmentDate: str("assessmentDate"),
    assessmentMethod: str("assessmentMethod"),
    overallFAIRScore: str("overallFAIRScore"),
  };
}
