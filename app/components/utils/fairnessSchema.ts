// Server-only helpers that pair raw FAIRness answers with their schema definitions.
// Shared by the repository detail page and the /api/.../fairness route.
import fs from "fs";
import path from "path";

/** Reads the schema file and pulls only the FAIRness property definition block. */
export function getFairnessSchemaBlock(): any {
  try {
    const filePath = path.join(process.cwd(), "public", "MDS_FAIRagro_RDI_schema.json");
    const schema = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return schema?.properties?.fairagroData?.properties?.FAIRness || null;
  } catch (error) {
    console.error("Failed to parse FAIRness block schema:", error);
    return null;
  }
}

/** Normalizes a raw answer to a boolean, number or null according to its schema type. */
function toTypedValue(rawValue: any, type: string): boolean | number | string | null {
  if (rawValue === undefined || rawValue === null || rawValue === "") return null;

  if (type === "boolean") {
    const cleanStr = String(rawValue).trim().toLowerCase();
    if (cleanStr === "yes" || cleanStr === "true") return true;
    if (cleanStr === "no" || cleanStr === "false") return false;
    return null; // 'missing', 'none', 'unknown' and any unexpected placeholder
  }

  if (type === "number") {
    const num = Number(rawValue);
    return isNaN(num) ? null : num;
  }

  return rawValue;
}

function describe(schemaNode: any, type: string) {
  return {
    description: schemaNode?.description || "",
    display_name: schemaNode?.display_name || "",
    title: schemaNode?.title || "",
    additional_information: schemaNode?.additional_information || "",
    placeholder: schemaNode?.placeholder || "",
    type,
  };
}

/** Transforms the raw compound payload into flat, schema-annotated structures. */
export function conceptualizeFairnessData(rawFairness: any, fairnessSchema: any) {
  if (!rawFairness) return null;

  const serialized: Record<string, any> = {};
  const schemaProps = fairnessSchema?.properties || {};

  for (const key in rawFairness) {
    const rawNode = rawFairness[key];
    const schemaNode = schemaProps[key];
    if (!rawNode) continue;

    if (rawNode.typeClass === "compound" && rawNode.value) {
      const pillarGroup: Record<string, any> = {
        description: schemaNode?.description || "",
        display_name: schemaNode?.display_name || "",
        title: schemaNode?.title || "",
        type: schemaNode?.type || "object",
      };

      for (const subKey in rawNode.value) {
        const subNode = rawNode.value[subKey];
        if (!subNode) continue;
        const subSchema = schemaNode?.properties?.[subKey];
        const targetType = subSchema?.type || "string";
        pillarGroup[subKey] = {
          value: toTypedValue(subNode.value, targetType),
          ...describe(subSchema, targetType),
        };
      }
      serialized[key] = pillarGroup;
    } else {
      const targetType = schemaNode?.type || "string";
      serialized[key] = {
        value: toTypedValue(rawNode.value, targetType),
        ...describe(schemaNode, targetType),
      };
    }
  }

  return serialized;
}
