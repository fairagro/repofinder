import fs from "fs";
import path from "path";
import { json, serverError } from "@/app/api/_lib/http";

export const dynamic = "force-static";

/** The MDS FAIRagro RDI metadata schema that every record conforms to. */
export function GET() {
  try {
    const file = path.join(process.cwd(), "public", "MDS_FAIRagro_RDI_schema.json");
    return json(JSON.parse(fs.readFileSync(file, "utf8")));
  } catch (error) {
    return serverError(error);
  }
}
