import { json, notFound, serverError } from "@/app/api/_lib/http";
import { getFairnessSchemaBlock } from "@/app/components/utils/fairnessSchema";

export const dynamic = "force-static";

/** Only the FAIRness section of the schema (the block the assessments are validated against). */
export function GET() {
  try {
    const block = getFairnessSchemaBlock();
    if (!block) return notFound("FAIRness block missing from schema");
    return json(block);
  } catch (error) {
    return serverError(error);
  }
}
