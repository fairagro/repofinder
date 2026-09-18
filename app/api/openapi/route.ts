import { json } from "@/app/api/_lib/http";
import { spec } from "@/app/api/_lib/openapi";

export const dynamic = "force-static";

export function GET() {
  return json(spec);
}
