import { json, notFound, serverError } from "@/app/api/_lib/http";
import { findRdi, rdiIds, serializeDetail } from "@/app/api/_lib/rdi";

export const dynamic = "force-static";

export function generateStaticParams() {
  return rdiIds().map((rdiId) => ({ rdiId }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ rdiId: string }> }) {
  try {
    const { rdiId } = await params;
    const rdi = findRdi(rdiId);
    if (!rdi) return notFound(`No repository with id "${rdiId}"`);
    return json(serializeDetail(rdi));
  } catch (error) {
    return serverError(error);
  }
}
