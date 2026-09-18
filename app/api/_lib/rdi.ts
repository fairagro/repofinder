// Serializers that turn rf-rdis records into the shapes returned by the public API.
import { getAllRdis, getRdiById } from "rf-rdis";
import { FAIRNESS_CRITERIA, FAIR_PILLARS } from "@/app/components/utils/fairnessConstants";
import {
  criteriaResults as scoreCriteria,
  fairnessSummary as scoreSummary,
  type CriterionResult,
  type FairnessSummary,
} from "@/app/components/utils/fairnessScore";
import {
  extractCollections,
  extractDatasetSearchId,
  extractRdiDisplayData,
  extractRepositoryUrl,
} from "@/app/components/utils/rdiDataExtraction";
import { fieldsToObject, nullifyEmpty, unwrap, type DvField } from "./dataverse";
import { API_BASE, SITE_URL } from "./config";

export type Rdi = ReturnType<typeof getAllRdis>[number];
export type { Answer, CriterionResult, FairnessSummary, PillarScore } from "@/app/components/utils/fairnessScore";

// ---------------------------------------------------------------------------
// Lookup

export function allRdis(): Rdi[] {
  return getAllRdis().filter((rdi) => typeof rdi.id === "string" && rdi.id);
}

export function findRdi(id: string): Rdi | undefined {
  return getRdiById(id);
}

export function rdiIds(): string[] {
  return allRdis().map((rdi) => rdi.id as string);
}

// ---------------------------------------------------------------------------
// Metadata access

function citationFields(rdi: Rdi): DvField[] {
  return rdi.raw?.datasetVersion?.metadataBlocks?.citation?.fields || [];
}

function fairagroFields(rdi: Rdi): DvField[] {
  return rdi.raw?.datasetVersion?.metadataBlocks?.MDS_fairagro?.fields || [];
}

function fairagroData(rdi: Rdi): Record<string, any> {
  const field = fairagroFields(rdi).find((f) => f.typeName === "MDS_fairagro.fairagroData");
  return (field?.value as Record<string, any>) || {};
}

export function rawFairness(rdi: Rdi): Record<string, any> | undefined {
  return fairagroData(rdi).FAIRness?.value;
}

export function re3Data(rdi: Rdi): Record<string, unknown> | null {
  const field = fairagroFields(rdi).find((f) => f.typeName === "MDS_fairagro.re3Data");
  if (!field?.value || typeof field.value !== "object" || Array.isArray(field.value)) return null;
  return nullifyEmpty(unwrap(field) as Record<string, unknown>);
}

export function subjects(rdi: Rdi): string[] {
  const field = citationFields(rdi).find((f) => f.typeName === "subject");
  return Array.isArray(field?.value) ? (field!.value as string[]) : [];
}

// ---------------------------------------------------------------------------
// FAIRness

export function criteriaResults(rdi: Rdi): CriterionResult[] {
  return scoreCriteria(rawFairness(rdi));
}

export function fairnessSummary(rdi: Rdi): FairnessSummary {
  return scoreSummary(rawFairness(rdi));
}

// ---------------------------------------------------------------------------
// Serializers

export function links(id: string) {
  return {
    self: `${API_BASE}/resource/repository/${id}`,
    fairness: `${API_BASE}/resource/repository/${id}/fairness`,
    re3data: `${API_BASE}/resource/repository/${id}/re3data`,
    raw: `${API_BASE}/resource/repository/${id}/raw`,
    html: `${SITE_URL}/resource/repository/${id}`,
  };
}

export function serializeSummary(rdi: Rdi) {
  const id = rdi.id as string;
  const { title, description } = extractRdiDisplayData(rdi);
  const summary = fairnessSummary(rdi);
  return {
    id,
    title,
    description: description || null,
    repositoryUrl: extractRepositoryUrl(rdi.raw) || null,
    subjects: subjects(rdi),
    collections: extractCollections(rdi.raw),
    datasetsSearchCollectionId: extractDatasetSearchId(rdi.raw) || null,
    fairness: {
      score: summary.score,
      pillars: Object.fromEntries(
        Object.entries(summary.pillars).map(([k, v]) => [k, v.score]),
      ),
    },
    links: links(id),
  };
}

export function serializeDetail(rdi: Rdi) {
  const id = rdi.id as string;
  const citation = nullifyEmpty(fieldsToObject(citationFields(rdi))) as Record<string, any>;
  const data = nullifyEmpty(unwrap(fairagroData(rdi)) as Record<string, any>) || {};
  const version = rdi.raw?.datasetVersion || {};
  const summary = fairnessSummary(rdi);

  return {
    ...serializeSummary(rdi),
    authors: citation.author ?? [],
    contacts: citation.datasetContact ?? [],
    termsOfUse: citation.termsOfUse ?? null,
    productionDate: citation.productionDate ?? null,
    distributionDate: citation.distributionDate ?? null,
    license: version.license ?? null,
    metadataVersion: version.versionNumber ?? null,
    persistentId: version.datasetPersistentId ?? null,
    lawAndEthics: data.lawAndEthics ?? null,
    technicalInfo: data.technicalInfo ?? null,
    agriculturalContext: data.agriculturalContext ?? null,
    fairness: {
      ...summary,
      criteria: criteriaResults(rdi),
    },
    re3data: re3Data(rdi),
    links: links(id),
  };
}

// ---------------------------------------------------------------------------
// Collections / aggregates

export interface Facet {
  value: string;
  count: number;
}

function countValues(values: string[]): Facet[] {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

export function facets(rdis: Rdi[] = allRdis()) {
  return {
    subjects: countValues(rdis.flatMap(subjects)),
    collections: countValues(rdis.flatMap((rdi) => extractCollections(rdi.raw))),
  };
}

export function fairnessStats(rdis: Rdi[] = allRdis()) {
  const perRdi = rdis.map((rdi) => ({ rdi, results: criteriaResults(rdi), summary: fairnessSummary(rdi) }));

  const criteria = FAIRNESS_CRITERIA.map((crit) => {
    const results = perRdi.map((r) => r.results.find((c) => c.key === crit.key)!);
    const met = results.filter((c) => c.met === true).length;
    const notMet = results.filter((c) => c.met === false).length;
    const unknown = results.length - met - notMet;
    return {
      key: crit.key,
      field: crit.field,
      label: crit.label,
      pillar: crit.pillar,
      rdaCode: crit.rdaCode,
      met,
      notMet,
      unknown,
      metRate: met + notMet > 0 ? Math.round((met / (met + notMet)) * 100) : null,
    };
  });

  const avg = (nums: (number | null)[]) => {
    const valid = nums.filter((n): n is number => n !== null);
    return valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
  };

  const pillars = Object.fromEntries(
    FAIR_PILLARS.map((p) => [p, { averageScore: avg(perRdi.map((r) => r.summary.pillars[p].score)) }]),
  );

  const ranked = perRdi
    .map((r) => ({ id: r.rdi.id as string, title: extractRdiDisplayData(r.rdi).title, score: r.summary.score }))
    .filter((r) => r.score !== null)
    .sort((a, b) => (b.score as number) - (a.score as number));

  return {
    repositories: rdis.length,
    averageScore: avg(perRdi.map((r) => r.summary.score)),
    pillars,
    criteria,
    ranking: ranked,
  };
}

/** One row per repository with a column per criterion — the basis of the matrix and CSV endpoints. */
export function fairnessMatrix(rdis: Rdi[] = allRdis()) {
  return rdis.map((rdi) => {
    const summary = fairnessSummary(rdi);
    const row: Record<string, unknown> = {
      id: rdi.id,
      title: extractRdiDisplayData(rdi).title,
      score: summary.score,
    };
    for (const p of FAIR_PILLARS) row[p] = summary.pillars[p].score;
    for (const c of criteriaResults(rdi)) row[c.field] = c.met === null ? "unknown" : c.met ? "met" : "not met";
    return row;
  });
}

// ---------------------------------------------------------------------------
// Search / filter / sort / paginate

export interface ListQuery {
  q?: string;
  subject?: string[];
  collection?: string[];
  minScore?: number;
  sort?: "id" | "title" | "score";
  order?: "asc" | "desc";
  page: number;
  limit: number;
}

export function searchRdis(query: ListQuery, rdis: Rdi[] = allRdis()): Rdi[] {
  const q = query.q?.trim().toLowerCase();
  let out = rdis.filter((rdi) => {
    if (query.subject?.length) {
      const s = subjects(rdi);
      if (!query.subject.some((v) => s.includes(v))) return false;
    }
    if (query.collection?.length) {
      const c = extractCollections(rdi.raw);
      if (!query.collection.some((v) => c.includes(v))) return false;
    }
    if (query.minScore !== undefined) {
      const score = fairnessSummary(rdi).score;
      if (score === null || score < query.minScore) return false;
    }
    if (q) {
      const { title, description } = extractRdiDisplayData(rdi);
      const haystack = [rdi.id, title, description, ...subjects(rdi), ...extractCollections(rdi.raw), extractRepositoryUrl(rdi.raw)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const dir = query.order === "desc" ? -1 : 1;
  const sortKey = query.sort || "id";
  out = [...out].sort((a, b) => {
    if (sortKey === "score") {
      const sa = fairnessSummary(a).score ?? -1;
      const sb = fairnessSummary(b).score ?? -1;
      return (sa - sb) * dir;
    }
    const va = sortKey === "title" ? extractRdiDisplayData(a).title : (a.id as string);
    const vb = sortKey === "title" ? extractRdiDisplayData(b).title : (b.id as string);
    return String(va).localeCompare(String(vb)) * dir;
  });
  return out;
}

export function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * limit;
  return {
    meta: { total, page: current, limit, totalPages },
    data: items.slice(start, start + limit),
  };
}
