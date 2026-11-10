/**
 * The four states a criterion can be in, as recorded in the rf-rdis data:
 *  - "yes" / "no": compliance / non-compliance, supported by evidence;
 *  - "not applicable": a conditional criterion that does not apply to this repository
 *    (e.g. authentication type for a repository without authentication for data access);
 *  - "unknown": not assessed, no evidence from the interview or the registry record.
 * "not applicable" and "unknown" are both excluded from every score denominator.
 */
export type FairnessAnswer = 'yes' | 'no' | 'not applicable' | 'unknown';

export function normalizeFairnessValue(val: any): FairnessAnswer {
  if (val === undefined || val === null) return 'unknown';
  if (Array.isArray(val)) {
    if (val.length === 0) return 'unknown';
    return normalizeFairnessValue(val[0]);
  }
  if (typeof val === 'string') {
    const v = val.trim().toLowerCase();
    if (v === 'yes' || v === 'true') return 'yes';
    if (v === 'no' || v === 'false') return 'no';
    if (v === 'not applicable' || v === 'not_applicable') return 'not applicable';
    if (v === 'na' || v === '') return 'unknown';
  }
  if (typeof val === 'boolean') return val ? 'yes' : 'no';
  return 'unknown';
}


export function getFairnessColor(norm: FairnessAnswer): string {
  if (norm === 'yes') return '#6abf5c';
  if (norm === 'no') return '#f26e5f';
  return '#a8a9ad';
}
