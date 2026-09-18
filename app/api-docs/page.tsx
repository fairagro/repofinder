import type { Metadata } from "next";
import { Box, Chip, Container, Divider, Link as MuiLink, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { spec } from "@/app/api/_lib/openapi";
import { API_BASE } from "@/app/api/_lib/config";
import ApiPlayground from "./ApiPlayground";

export const metadata: Metadata = { title: "API", description: "Documentation for the FAIRagro RDI Inventory JSON API." };

type Operation = { tags?: string[]; summary?: string; description?: string; operationId?: string; parameters?: any[] };

function Code({ children }: { children: React.ReactNode }) {
  return (
    <Box component="code" sx={{ px: 0.75, py: 0.25, borderRadius: 1, bgcolor: "background.default", border: "1px solid", borderColor: "divider", fontSize: "0.85em" }}>
      {children}
    </Box>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <Box component="pre" sx={{ m: 0, p: 2, overflow: "auto", fontSize: 13, lineHeight: 1.6, bgcolor: "#0f1716", color: "#dfe8e5", borderRadius: 2 }}>
      {children}
    </Box>
  );
}

export default function ApiDocsPage() {
  const paths = Object.entries(spec.paths) as [string, { get: Operation }][];
  const tags = spec.tags;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ mb: 4, maxWidth: 760 }}>
        <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 700, letterSpacing: "0.12em" }}>Developers</Typography>
        <Typography variant="h3" component="h1" sx={{ mb: 1.5 }}>API</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Everything on this site is available as JSON. The API is read-only, needs no key, allows cross-origin requests, and is
          described by an <MuiLink href={`${API_BASE}/openapi`}>OpenAPI 3.1 document</MuiLink> you can load into Swagger UI, Redoc,
          Postman or any code generator.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
          <Chip label={`Base URL ${API_BASE}`} sx={{ fontFamily: "var(--font-geist-mono)" }} />
          <Chip label="GET only" variant="outlined" />
          <Chip label="CORS enabled" variant="outlined" />
          <Chip label="CC0 data" variant="outlined" />
        </Stack>
      </Box>

      <Paper sx={{ p: { xs: 2.5, md: 3 }, mb: 4 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>Quick start</Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>Search repositories and sort by FAIR score</Typography>
            <CodeBlock>{`curl "${API_BASE}/resource/repository?q=soil&sort=score&order=desc&limit=5"`}</CodeBlock>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>One repository with its 20 criteria, pillar scores and re3data profile</Typography>
            <CodeBlock>{`curl "${API_BASE}/resource/repository/RFId001202604272"`}</CodeBlock>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>The whole FAIRness matrix as CSV (Python)</Typography>
            <CodeBlock>{`import pandas as pd\ndf = pd.read_csv("${API_BASE}/fairness/csv")\ndf.groupby("findability")["id"].count()`}</CodeBlock>
          </Box>
        </Stack>
      </Paper>

      <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>Try it</Typography>
      <Box sx={{ mb: 4 }}>
        <ApiPlayground initialPath="/api/resource/repository?limit=3&sort=score&order=desc" />
      </Box>

      <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>Endpoints</Typography>
      {tags.map((tag) => {
        const ops = paths.filter(([, methods]) => methods.get?.tags?.includes(tag.name));
        if (!ops.length) return null;
        return (
          <Box key={tag.name} sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{tag.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{tag.description}</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "42%" }}>Path</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ops.map(([path, { get }]) => {
                    const live = path.replace("{rdiId}", "RFId001202604272").replace("{key}", "7");
                    const query = get.parameters?.filter((p) => p.in === "query") || [];
                    return (
                      <TableRow key={path} hover>
                        <TableCell sx={{ verticalAlign: "top" }}>
                          <MuiLink href={`${API_BASE}${live === "/" ? "" : live}`} sx={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, wordBreak: "break-all" }}>
                            GET {path === "/" ? "/api" : `/api${path}`}
                          </MuiLink>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top" }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{get.summary}</Typography>
                          {get.description && <Typography variant="body2" color="text.secondary">{get.description}</Typography>}
                          {query.length > 0 && (
                            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                              {query.map((p) => (
                                <Chip key={p.name} size="small" variant="outlined" title={p.description} label={<span><Code>{p.name}</Code>{p.schema?.enum ? ` ${p.schema.enum.join(" | ")}` : ""}</span>} sx={{ height: 24 }} />
                              ))}
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      })}

      <Divider sx={{ my: 4 }} />
      <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>Conventions</Typography>
      <Stack spacing={1.5} sx={{ maxWidth: 800 }}>
        <Typography variant="body2"><strong>Scores.</strong> Following the FAIRagro methodology, each criterion is a binary attribute (1 = compliance, 0 = non-compliance). A pillar score is the percentage of <em>answered</em> criteria in that pillar that are met (0–100, i.e. 4 of 5 = 80); <Code>null</Code> means nothing was answered. The API also returns an overall percentage for convenience, but the methodology deliberately avoids a single composite FAIR index — prefer the four pillar scores. Each criterion carries the recorded <Code>answer</Code> (yes / no / unknown) and the derived <Code>met</Code> flag.</Typography>
        <Typography variant="body2"><strong>Pagination.</strong> List responses have <Code>meta</Code> (<Code>total</Code>, <Code>page</Code>, <Code>limit</Code>, <Code>totalPages</Code>) and <Code>links</Code> (<Code>self</Code>, <Code>first</Code>, <Code>prev</Code>, <Code>next</Code>, <Code>last</Code>). <Code>limit</Code> is capped at 100.</Typography>
        <Typography variant="body2"><strong>Errors.</strong> Non-2xx responses return <Code>{`{ "error": { "status", "title", "detail" } }`}</Code>. Invalid query parameters give 400, unknown identifiers 404.</Typography>
        <Typography variant="body2"><strong>Caching.</strong> Everything except the search endpoint is pre-rendered at deploy time; responses carry <Code>Cache-Control</Code> headers and are safe to cache. Data changes only when the underlying <Code>rf-rdis</Code> package is updated and the site is redeployed.</Typography>
        <Typography variant="body2"><strong>Raw records.</strong> <Code>/raw</Code> returns the original Dataverse-style export where every value is wrapped as <Code>{`{ typeName, typeClass, multiple, value }`}</Code>. All other endpoints return unwrapped, plain JSON.</Typography>
      </Stack>
    </Container>
  );
}
