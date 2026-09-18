export function normalizeFairnessValue(val: any): 'yes' | 'no' | 'unknown' {
  if (val === undefined || val === null) return 'unknown';
  if (Array.isArray(val)) {
    if (val.length === 0) return 'unknown';
    return normalizeFairnessValue(val[0]);
  }
  if (typeof val === 'string') {
    const v = val.trim().toLowerCase();
    if (v === 'yes' || v === 'true') return 'yes';
    if (v === 'no' || v === 'false') return 'no';
    if (v === 'na' || v === '') return 'unknown';
  }
  if (typeof val === 'boolean') return val ? 'yes' : 'no';
  return 'unknown';
}


export function getFairnessColor(norm: 'yes' | 'no' | 'unknown'): string {
  if (norm === 'yes') return '#6abf5c';
  if (norm === 'no') return '#f26e5f';
  return '#a8a9ad';
}
