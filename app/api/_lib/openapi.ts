// OpenAPI 3.1 description of the public API. Served at /api/openapi and rendered on /api-docs.
import { API_BASE, SITE_URL } from "./config";
import { FAIRNESS_CRITERIA, FAIR_PILLARS } from "@/app/components/utils/fairnessConstants";

const rdiIdParam = {
  name: "rdiId",
  in: "path",
  required: true,
  description: "Repository identifier, e.g. RFId001202604272",
  schema: { type: "string", pattern: "^RFId\\d+$" },
};

const errorResponse = (description: string) => ({
  description,
  content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
});

const okJson = (schemaRef: string, description = "OK") => ({
  description,
  content: { "application/json": { schema: { $ref: `#/components/schemas/${schemaRef}` } } },
});

export const spec = {
  openapi: "3.1.0",
  info: {
    title: "FAIRagro RDI Inventory API",
    version: "1.0.0",
    description:
      "Read-only API over FAIRness assessments of research data infrastructures (RDIs) collected in FAIRagro RDI manager interviews. " +
      "All endpoints are GET, return JSON (except /fairness/csv) and allow cross-origin requests.",
    contact: { name: "FAIRagro", url: "https://fairagro.net/" },
    license: { name: "CC0 1.0", url: "http://creativecommons.org/publicdomain/zero/1.0/" },
  },
  servers: [{ url: API_BASE }],
  tags: [
    { name: "Repositories", description: "Research data infrastructures and their assessments" },
    { name: "FAIRness", description: "Cross-repository FAIRness views" },
    { name: "Indicators", description: "The 20 assessed criteria" },
    { name: "Reference", description: "Facets, schema and API metadata" },
  ],
  paths: {
    "/": {
      get: { tags: ["Reference"], summary: "API index", operationId: "index", responses: { "200": { description: "Endpoint directory" } } },
    },
    "/openapi": {
      get: { tags: ["Reference"], summary: "This OpenAPI document", operationId: "openapi", responses: { "200": { description: "OpenAPI 3.1 document" } } },
    },
    "/resource/repository": {
      get: {
        tags: ["Repositories"],
        summary: "List and search repositories",
        operationId: "listRepositories",
        parameters: [
          { name: "q", in: "query", description: "Free-text search over id, title, description, subjects, collections and URL", schema: { type: "string" } },
          { name: "subject", in: "query", description: "Filter by subject (repeatable or comma-separated; any match)", schema: { type: "array", items: { type: "string" } }, style: "form", explode: true },
          { name: "collection", in: "query", description: "Filter by FAIRagro collection (repeatable or comma-separated; any match)", schema: { type: "array", items: { type: "string" } }, style: "form", explode: true },
          { name: "minScore", in: "query", description: "Only repositories with an overall FAIRness score ≥ this value", schema: { type: "number", minimum: 0, maximum: 100 } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["id", "title", "score"], default: "id" } },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "asc" } },
          { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 20 } },
        ],
        responses: { "200": okJson("RepositoryList"), "400": errorResponse("Invalid query parameter") },
      },
    },
    "/resource/repository/{rdiId}": {
      get: {
        tags: ["Repositories"],
        summary: "Repository detail",
        operationId: "getRepository",
        parameters: [rdiIdParam],
        responses: { "200": okJson("RepositoryDetail"), "404": errorResponse("Unknown repository") },
      },
    },
    "/resource/repository/{rdiId}/fairness": {
      get: {
        tags: ["Repositories"],
        summary: "FAIRness assessment as JSON-LD",
        description: "schema.org DataCatalog document whose `fairnessAssessment` carries each criterion's typed value together with its schema description.",
        operationId: "getRepositoryFairness",
        parameters: [rdiIdParam],
        responses: {
          "200": { description: "JSON-LD document", content: { "application/ld+json": { schema: { type: "object" } } } },
          "404": errorResponse("Unknown repository"),
        },
      },
    },
    "/resource/repository/{rdiId}/re3data": {
      get: {
        tags: ["Repositories"],
        summary: "Harvested re3data.org profile",
        operationId: "getRepositoryRe3data",
        parameters: [rdiIdParam],
        responses: { "200": { description: "Profile with metadata wrappers removed" }, "404": errorResponse("Unknown repository or no profile") },
      },
    },
    "/resource/repository/{rdiId}/raw": {
      get: {
        tags: ["Repositories"],
        summary: "Raw record",
        description: "The record exactly as stored in the rf-rdis package (Dataverse-style `{typeName, typeClass, multiple, value}` wrappers).",
        operationId: "getRepositoryRaw",
        parameters: [rdiIdParam],
        responses: { "200": { description: "Raw record" }, "404": errorResponse("Unknown repository") },
      },
    },
    "/fairness": {
      get: {
        tags: ["FAIRness"],
        summary: "FAIRness matrix",
        description: "One row per repository: overall and pillar scores plus a yes/no/unknown answer per criterion.",
        operationId: "fairnessMatrix",
        responses: { "200": okJson("FairnessMatrix") },
      },
    },
    "/fairness/csv": {
      get: {
        tags: ["FAIRness"],
        summary: "FAIRness matrix as CSV",
        operationId: "fairnessCsv",
        responses: { "200": { description: "CSV, one header row then one row per repository", content: { "text/csv": { schema: { type: "string" } } } } },
      },
    },
    "/fairness/stats": {
      get: {
        tags: ["FAIRness"],
        summary: "Aggregate statistics",
        description: "Average overall and pillar scores, per-criterion met rates, and a ranking of repositories by score.",
        operationId: "fairnessStats",
        responses: { "200": okJson("FairnessStats") },
      },
    },
    "/indicators": {
      get: { tags: ["Indicators"], summary: "All criteria", operationId: "listIndicators", responses: { "200": okJson("IndicatorList") } },
    },
    "/indicators/{key}": {
      get: {
        tags: ["Indicators"],
        summary: "One criterion",
        operationId: "getIndicator",
        parameters: [{ name: "key", in: "path", required: true, description: "Indicator number (1-20) or field name, e.g. `7` or `authenticationRequired`", schema: { type: "string" } }],
        responses: { "200": okJson("Indicator"), "404": errorResponse("Unknown indicator") },
      },
    },
    "/facets": {
      get: { tags: ["Reference"], summary: "Filter values with counts", operationId: "facets", responses: { "200": okJson("Facets") } },
    },
    "/schema": {
      get: { tags: ["Reference"], summary: "MDS FAIRagro RDI metadata schema", operationId: "schema", responses: { "200": { description: "JSON Schema document" } } },
    },
    "/schema/fairness": {
      get: { tags: ["Reference"], summary: "FAIRness block of the schema", operationId: "schemaFairness", responses: { "200": { description: "JSON Schema fragment" } } },
    },
  },
  components: {
    schemas: {
      Error: {
        type: "object",
        properties: { error: { type: "object", properties: { status: { type: "integer" }, title: { type: "string" }, detail: { type: "string" } } } },
      },
      Answer: { type: "string", enum: ["yes", "no", "unknown"] },
      Pillar: { type: "string", enum: [...FAIR_PILLARS] },
      Score: { type: ["integer", "null"], minimum: 0, maximum: 100, description: "Percentage of answered criteria met; null when nothing was answered" },
      Links: {
        type: "object",
        properties: { self: { type: "string" }, fairness: { type: "string" }, re3data: { type: "string" }, raw: { type: "string" }, html: { type: "string", description: `Human-readable page on ${SITE_URL}` } },
      },
      RepositorySummary: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: ["string", "null"] },
          repositoryUrl: { type: ["string", "null"] },
          subjects: { type: "array", items: { type: "string" } },
          collections: { type: "array", items: { type: "string" } },
          datasetsSearchCollectionId: { type: ["string", "null"], description: "Collection id in the FAIRagro datasets search hub" },
          fairness: {
            type: "object",
            properties: {
              score: { $ref: "#/components/schemas/Score" },
              pillars: { type: "object", additionalProperties: { $ref: "#/components/schemas/Score" } },
            },
          },
          links: { $ref: "#/components/schemas/Links" },
        },
      },
      CriterionResult: {
        type: "object",
        properties: {
          key: { type: "string" },
          field: { type: "string" },
          label: { type: "string" },
          rdaCode: { type: "string" },
          pillar: { type: "string" },
          answer: { $ref: "#/components/schemas/Answer" },
          rawValue: { description: "Answer exactly as recorded in the interview" },
        },
      },
      PillarScore: {
        type: "object",
        properties: { score: { $ref: "#/components/schemas/Score" }, met: { type: "integer" }, answered: { type: "integer" }, total: { type: "integer" } },
      },
      RepositoryDetail: {
        allOf: [
          { $ref: "#/components/schemas/RepositorySummary" },
          {
            type: "object",
            properties: {
              authors: { type: "array", items: { type: "object" } },
              contacts: { type: "array", items: { type: "object" } },
              termsOfUse: { type: ["string", "null"] },
              productionDate: { type: ["string", "null"] },
              distributionDate: { type: ["string", "null"] },
              license: { type: ["object", "null"] },
              metadataVersion: { type: ["string", "null"] },
              persistentId: { type: ["string", "null"] },
              lawAndEthics: { type: ["object", "null"] },
              technicalInfo: { type: ["object", "null"] },
              agriculturalContext: { type: ["object", "null"] },
              fairness: {
                type: "object",
                properties: {
                  score: { $ref: "#/components/schemas/Score" },
                  pillars: { type: "object", additionalProperties: { $ref: "#/components/schemas/PillarScore" } },
                  assessmentDate: { type: ["string", "null"] },
                  assessmentMethod: { type: ["string", "null"] },
                  overallFAIRScore: { type: ["string", "null"] },
                  criteria: { type: "array", items: { $ref: "#/components/schemas/CriterionResult" } },
                },
              },
              re3data: { type: ["object", "null"] },
            },
          },
        ],
      },
      RepositoryList: {
        type: "object",
        properties: {
          meta: { type: "object", properties: { total: { type: "integer" }, page: { type: "integer" }, limit: { type: "integer" }, totalPages: { type: "integer" } } },
          links: { type: "object", properties: { self: { type: "string" }, first: { type: "string" }, last: { type: "string" }, prev: { type: ["string", "null"] }, next: { type: ["string", "null"] } } },
          data: { type: "array", items: { $ref: "#/components/schemas/RepositorySummary" } },
        },
      },
      Indicator: {
        type: "object",
        properties: {
          key: { type: "string" },
          field: { type: "string" },
          label: { type: "string" },
          icon: { type: "string" },
          rdaCode: { type: "string" },
          pillar: { type: "string" },
          description: { type: "string" },
          definition: { type: "string" },
        },
        example: FAIRNESS_CRITERIA[0],
      },
      IndicatorList: {
        type: "object",
        properties: { meta: { type: "object", properties: { total: { type: "integer" } } }, data: { type: "array", items: { $ref: "#/components/schemas/Indicator" } } },
      },
      FairnessMatrix: {
        type: "object",
        properties: {
          meta: { type: "object", properties: { total: { type: "integer" }, columns: { type: "array", items: { type: "string" } } } },
          data: {
            type: "array",
            items: { type: "object", description: "id, title, score, one score per pillar, then one Answer per criterion field", additionalProperties: true },
          },
        },
      },
      FairnessStats: {
        type: "object",
        properties: {
          repositories: { type: "integer" },
          averageScore: { $ref: "#/components/schemas/Score" },
          pillars: { type: "object", additionalProperties: { type: "object", properties: { averageScore: { $ref: "#/components/schemas/Score" } } } },
          criteria: {
            type: "array",
            items: {
              type: "object",
              properties: { key: { type: "string" }, field: { type: "string" }, label: { type: "string" }, pillar: { type: "string" }, rdaCode: { type: "string" }, yes: { type: "integer" }, no: { type: "integer" }, unknown: { type: "integer" }, metRate: { $ref: "#/components/schemas/Score" } },
            },
          },
          ranking: { type: "array", items: { type: "object", properties: { id: { type: "string" }, title: { type: "string" }, score: { type: "integer" } } } },
        },
      },
      Facets: {
        type: "object",
        properties: {
          subjects: { type: "array", items: { $ref: "#/components/schemas/Facet" } },
          collections: { type: "array", items: { $ref: "#/components/schemas/Facet" } },
        },
      },
      Facet: { type: "object", properties: { value: { type: "string" }, count: { type: "integer" } } },
    },
  },
};
