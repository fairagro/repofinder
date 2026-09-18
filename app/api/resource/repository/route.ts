import type { NextRequest } from "next/server";
import { API_BASE, badRequest, json, serverError } from "@/app/api/_lib/http";
import { paginate, searchRdis, serializeSummary, type ListQuery } from "@/app/api/_lib/rdi";

const SORTS = ["id", "title", "score"] as const;
const ORDERS = ["asc", "desc"] as const;

function parseQuery(params: URLSearchParams): ListQuery | string {
  const page = params.get("page") ? Number(params.get("page")) : 1;
  const limit = params.get("limit") ? Number(params.get("limit")) : 20;
  if (!Number.isInteger(page) || page < 1) return "`page` must be a positive integer";
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) return "`limit` must be an integer between 1 and 100";

  const sort = params.get("sort") || "id";
  if (!(SORTS as readonly string[]).includes(sort)) return `\`sort\` must be one of ${SORTS.join(", ")}`;
  const order = params.get("order") || "asc";
  if (!(ORDERS as readonly string[]).includes(order)) return `\`order\` must be one of ${ORDERS.join(", ")}`;

  let minScore: number | undefined;
  if (params.has("minScore")) {
    minScore = Number(params.get("minScore"));
    if (Number.isNaN(minScore) || minScore < 0 || minScore > 100) return "`minScore` must be a number between 0 and 100";
  }

  // Repeatable (?subject=a&subject=b) and comma-separated (?subject=a,b) are both accepted.
  const multi = (key: string) =>
    params
      .getAll(key)
      .flatMap((v) => v.split(","))
      .map((v) => v.trim())
      .filter(Boolean);

  return {
    q: params.get("q") || undefined,
    subject: multi("subject"),
    collection: multi("collection"),
    minScore,
    sort: sort as ListQuery["sort"],
    order: order as ListQuery["order"],
    page,
    limit,
  };
}

export function GET(request: NextRequest) {
  try {
    const query = parseQuery(request.nextUrl.searchParams);
    if (typeof query === "string") return badRequest(query);

    const matches = searchRdis(query);
    const { meta, data } = paginate(matches, query.page, query.limit);

    const pageLink = (page: number) => {
      const p = new URLSearchParams(request.nextUrl.searchParams);
      p.set("page", String(page));
      return `${API_BASE}/resource/repository?${p.toString()}`;
    };

    return json({
      meta,
      links: {
        self: pageLink(meta.page),
        first: pageLink(1),
        last: pageLink(meta.totalPages),
        prev: meta.page > 1 ? pageLink(meta.page - 1) : null,
        next: meta.page < meta.totalPages ? pageLink(meta.page + 1) : null,
      },
      data: data.map(serializeSummary),
    });
  } catch (error) {
    return serverError(error);
  }
}
