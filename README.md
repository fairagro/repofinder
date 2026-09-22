# FAIRagro RDI FAIRness Inventory

A web application and JSON API that publish **FAIRness assessments of research data infrastructures (RDIs)** in
agrosystem research. Each repository is assessed against **20 criteria** derived from the
[RDA FAIR Data Maturity Model](https://doi.org/10.15497/rda00050), five per FAIR pillar
(Findability, Accessibility, Interoperability, Reusability). Results come from structured interviews with repository
managers, complemented by metadata harvested from [re3data.org](https://www.re3data.org/).

Scores are reported **per pillar** (e.g. "Accessibility 4/5"), never as a single composite FAIR index — see the
methodology paper below.

## Publication

> Haleem A., Arend D., Etukala J.R., Rey Mazón E., Schmidt M., Jung J., Martini D., Usadel B., Neidiger C., Ulrich R.,
> Lange M. (2026). *A Standardized Methodology for FAIRness Assessment and Multi-Dimensional Scoring in Agrosystem
> Research Data Infrastructures.* bioRxiv. https://doi.org/10.64898/2026.07.17.738915

If you use the data or the API, please cite the paper.

## What you get

| Route | Purpose |
|---|---|
| `/` | Searchable, filterable inventory; every card shows the 20-criterion diagnostic grid (green = met, red = not met, grey = not assessed) |
| `/resource/repository/{RFId}` | Repository profile: metadata, re3data record, per-pillar ratings, full criteria table |
| `/resource/repository/{RFId}/fairness` | Pillar bar chart + detailed assessment |
| `/interview`, `/indicator/{1–20}` | The questionnaire and the definition of each criterion |
| `/downloads` | Interview form, RDA specification, the raw interview spreadsheets |
| `/schema` | The MDS FAIRagro RDI metadata schema, browsable |
| `/api-docs` | API documentation with a live "try it" console |

### API

Read-only, no key, CORS enabled, described by OpenAPI 3.1 at `/api/openapi`. Highlights:

```
GET /api/resource/repository?q=soil&collection=Agricultural%20Sciences&sort=title&page=1&limit=20
GET /api/resource/repository/RFId001202604272            # profile, criteria, pillar scores, re3data
GET /api/resource/repository/RFId001202604272/fairness   # JSON-LD (schema.org DataCatalog)
GET /api/fairness            # matrix: every repository × 20 criteria
GET /api/fairness/csv        # same as CSV
GET /api/fairness/stats      # per-criterion compliance rates across the landscape
GET /api/indicators          # the 20 criteria with RDA codes
GET /api/facets              # subjects / collections with counts
```

Full reference: open `/api-docs` in the running app.

## Data

Repository records are **not stored in this repository**. They ship in the npm package
[`rf-rdis`](https://www.npmjs.com/package/rf-rdis) (one JSON file per RDI, Dataverse-style metadata blocks) and are
bundled at build time. To publish updated assessments, release a new `rf-rdis` version, then rebuild and redeploy this
app. The only data files kept here are in [`public/`](public/): the metadata schema, the indicator definitions and the
downloadable interview documents.

## Tech stack

Next.js 16 (App Router, route handlers for the API) · React 19 · MUI 9 · Recharts · TypeScript.
Almost everything is pre-rendered at build time; only the search endpoint (`/api/resource/repository?…`) runs on the
server because it reads query parameters.

## Running it

Requires **Node.js ≥ 20.9** (Node 22 LTS recommended) and npm.

### Local development

```bash
npm ci
npm run dev          # http://localhost:3000
```

### Production on a VM

```bash
git clone <this repository> repofinder && cd repofinder
npm ci
npm run build
PORT=3000 npm run start
```

Put a reverse proxy (nginx, Caddy, Traefik) in front of port 3000 for TLS, and keep the process alive with systemd or
pm2, e.g. `pm2 start npm --name rdi-inventory -- run start`.

By default the API emits **root-relative** links (`/api/...`), which are correct on any host. If you want absolute
URLs in the payloads and JSON-LD `@id`s, set `NEXT_PUBLIC_SITE_URL` **at build time**:

```bash
NEXT_PUBLIC_SITE_URL=https://inventory.example.org npm run build
```

### Docker

```bash
docker build -t rdi-inventory --build-arg NEXT_PUBLIC_SITE_URL=https://inventory.example.org .
docker run -d --name rdi-inventory -p 3000:3000 rdi-inventory
```

The image builds the app in one stage and copies only the production output into a small `node:22-alpine` runtime
that runs as an unprivileged user. Or with Compose:

```yaml
services:
  rdi-inventory:
    build:
      context: .
      args:
        NEXT_PUBLIC_SITE_URL: https://inventory.example.org
    ports:
      - "3000:3000"
    restart: unless-stopped
```

### Updating the data

```bash
npm install rf-rdis@latest
npm run build && npm run start      # or rebuild the Docker image
```

## Project layout

```
app/
  page.tsx                  inventory (client component: search, filters, cards)
  resource/repository/      per-repository pages (SSG via generateStaticParams)
  indicator/, interview/    criteria definitions
  api/                      JSON API route handlers
    _lib/                   serializers, scoring, OpenAPI spec, response helpers
  api-docs/                 API documentation page + playground
  components/               UI components
    utils/                  data extraction, FAIRness scoring, colour/indicator constants
  theme.ts                  MUI theme (brand colours, typography)
public/
  indicators.json           the 20 criteria (single source of truth for the UI and API)
  MDS_FAIRagro_RDI_schema.json
  interviews/               completed interview spreadsheets
```

## Accessibility note

Status colours use the Okabe–Ito green/vermillion pair, which remains distinguishable for the common forms of
colour-vision deficiency, and every coloured icon also carries its status as text (tooltip and `aria-label`).

## License

Application code: MIT. Assessment data: CC0 1.0 (see the `license` field of each record).
