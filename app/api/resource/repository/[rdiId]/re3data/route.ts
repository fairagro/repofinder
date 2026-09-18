import { json, notFound, serverError } from "@/app/api/_lib/http";
import { findRdi, links, rdiIds, re3Data } from "@/app/api/_lib/rdi";

export const dynamic = "force-static";

export function generateStaticParams() {
  return rdiIds().map((rdiId) => ({ rdiId }));
}

/** The re3data.org profile harvested for this repository, with metadata wrappers removed. */
export async function GET(_request: Request, { params }: { params: Promise<{ rdiId: string }> }) {
  try {
    const { rdiId } = await params;
    const rdi = findRdi(rdiId);
    if (!rdi) return notFound(`No repository with id "${rdiId}"`);
    const profile = re3Data(rdi);
    if (!profile) return notFound(`Repository "${rdiId}" has no re3data profile`);
    return json({ id: rdiId, re3data: profile, links: links(rdiId) });
  } catch (error) {
    return serverError(error);
  }
}
