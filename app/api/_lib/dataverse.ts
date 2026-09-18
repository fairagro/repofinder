// Helpers for the Dataverse-style metadata layout used by rf-rdis records:
// every value is wrapped as { typeName, typeClass, multiple, value }.

export interface DvField {
  typeName?: string;
  typeClass?: string;
  multiple?: boolean;
  value?: unknown;
}

// Source records contain stray zero-width spaces and padding (e.g. "ZALF (\u200b\u200b...)").
const INVISIBLE = /[\u200b-\u200d\ufeff]/g;

/** Recursively strips the { typeClass, value } wrappers, leaving plain JSON with tidy strings. */
export function unwrap(node: unknown): unknown {
  if (typeof node === "string") return node.replace(INVISIBLE, "").trim();
  if (Array.isArray(node)) return node.map(unwrap);
  if (node && typeof node === "object") {
    const obj = node as Record<string, unknown>;
    if ("typeClass" in obj && "value" in obj) return unwrap(obj.value);
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) out[k] = unwrap(v);
    return out;
  }
  return node;
}

/** Turns a metadata block's `fields` array into { fieldName: plainValue }. */
export function fieldsToObject(fields: DvField[] | undefined, stripPrefix = ""): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields || []) {
    if (!f.typeName) continue;
    const name = stripPrefix && f.typeName.startsWith(stripPrefix) ? f.typeName.slice(stripPrefix.length) : f.typeName;
    out[name] = unwrap(f);
  }
  return out;
}

/** Replaces "" and [] with null so consumers can rely on a single "no value" marker. */
export function nullifyEmpty<T>(value: T): T | null {
  if (value === "" || value === undefined) return null;
  if (Array.isArray(value) && value.length === 0) return null;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = nullifyEmpty(v);
    return out as T;
  }
  return value;
}
