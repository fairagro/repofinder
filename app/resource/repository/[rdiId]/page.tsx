import { notFound } from "next/navigation";
import { getRdiById, getAllRdis } from "rf-rdis";
import {
  Box,
  Container,
  Typography,
  Chip,
  Divider,
  Paper,
  Button,
} from "@mui/material";
import { Link as MuiLink } from "@mui/material";
import LinkButton from "@/app/components/LinkButton";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DataObjectIcon from "@mui/icons-material/DataObject";
import LaunchIcon from "@mui/icons-material/Launch";
import FairnessTable from "@/app/components/FairnessTable";
import { FAIR_PILLARS, pillarBgColor, pillarColor } from "@/app/components/utils/fairnessConstants";
import { fairnessSummary } from "@/app/components/utils/fairnessScore";
import { extractRdiDisplayData } from "@/app/components/utils/rdiDataExtraction";
import {
  conceptualizeFairnessData,
  getFairnessSchemaBlock,
} from "@/app/components/utils/fairnessSchema";

export function generateStaticParams() {
  return getAllRdis().map((rdi) => ({ rdiId: rdi.id }));
}

interface PageProps {
  params: Promise<{ rdiId: string }>;
}

export default async function RdiDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rdiId = Array.isArray(resolvedParams.rdiId)
    ? resolvedParams.rdiId[0]
    : resolvedParams.rdiId;
  const rdi = getRdiById(rdiId);

  if (!rdi) notFound();

  const { title, description, subject, FAIRness: rawFairness } = extractRdiDisplayData(rdi);

  const fairnessSchema = getFairnessSchemaBlock();
  const cleanFairness = conceptualizeFairnessData(rawFairness, fairnessSchema);

  const fairagroBlock = rdi.raw?.datasetVersion?.metadataBlocks?.MDS_fairagro;
  const re3DataField = fairagroBlock?.fields?.find((f: any) => f.typeName === "MDS_fairagro.re3Data");
  const re3Data =
    re3DataField && typeof re3DataField.value === "object" && re3DataField.value !== null && !Array.isArray(re3DataField.value)
      ? (re3DataField.value as any)
      : undefined;

  const orgIdentifier = re3Data?.orgIdentifier?.value;
  const isRe3Data = typeof orgIdentifier === "string" && orgIdentifier.startsWith("r3d");

  const summary = fairnessSummary(rawFairness);
  const repositoryUrl = re3Data?.repositoryURL?.value as string | undefined;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <LinkButton href="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        All repositories
      </LinkButton>
      <Paper sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start", flexWrap: "wrap" }}>
          <Box sx={{ flex: 1, minWidth: 260 }}>
            <Chip label={rdiId} size="small" variant="outlined" sx={{ fontFamily: "var(--font-geist-mono)", mb: 1.5 }} />
            <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
              {title}
            </Typography>
            {repositoryUrl && (
              <MuiLink href={repositoryUrl} target="_blank" rel="noopener noreferrer" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, wordBreak: "break-all" }}>
                {repositoryUrl.replace(/^https?:\/\//, "")}
                <LaunchIcon sx={{ fontSize: 16 }} />
              </MuiLink>
            )}
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.75 }}>Criteria met per FAIR pillar</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, maxWidth: 300 }}>
              {FAIR_PILLARS.map((p) => {
                const { met, total } = summary.pillars[p];
                return (
                  <Chip
                    key={p}
                    size="small"
                    label={`${p.charAt(0).toUpperCase() + p.slice(1)} ${met}/${total}`}
                    sx={{ bgcolor: pillarBgColor(p), color: "text.primary", borderLeft: "4px solid", borderLeftColor: pillarColor(p), borderRadius: 1 }}
                  />
                );
              })}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 3 }}>
          <LinkButton href={`/resource/repository/${rdiId}/fairness`} variant="contained" startIcon={<AssessmentIcon />}>
            Analyze FAIRness
          </LinkButton>
          <Button href={`/api/resource/repository/${rdiId}`} variant="outlined" startIcon={<DataObjectIcon />}>
            JSON
          </Button>
          <Button href={`/api/resource/repository/${rdiId}/fairness`} variant="outlined" startIcon={<DataObjectIcon />}>
            JSON-LD
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />
        <Typography
          variant="body1"
          sx={{ mb: 2, color: "text.primary", lineHeight: 1.7 }}
        >
          {description}
        </Typography>

        {subject && subject.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary" sx={{ fontWeight: 600 }}
            >
              Subject:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
              {subject.map((s: string) => (
                <Chip
                  key={s}
                  label={s}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {isRe3Data &&
          re3Data && (
            <Box sx={{ mb: 3 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 1.5, fontWeight: "bold" }}>
                re3data.org Profile
              </Typography>
              <Box
                component="table"
                sx={{
                  width: "100%",
                  mb: 2,
                  borderCollapse: "collapse",
                  background: "background.default",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  overflow: "hidden",
                }}
              >
                <tbody>
                  {(() => {
                    const renderRow = (label: string, value: any) => (
                      <tr key={label}>
                        <td
                          style={{
                            fontWeight: 500,
                            padding: "8px 12px",
                            borderBottom: "1px solid #eee",
                            width: 220,
                            color: "#555",
                          }}
                        >
                          {label}
                        </td>
                        <td
                          style={{
                            padding: "8px 12px",
                            borderBottom: "1px solid #eee",
                            color: "#222",
                          }}
                        >
                          {value}
                        </td>
                      </tr>
                    );
                    const rows: any[] = [];
                    const addRow = (label: string, val: any) => {
                      if (val === undefined || val === null || val === "")
                        return;
                      if (Array.isArray(val)) {
                        if (val.length === 0) return;
                        rows.push(renderRow(label, val.join(", ")));
                      } else {
                        rows.push(renderRow(label, val));
                      }
                    };

                    addRow("Repository Name", re3Data?.repositoryName?.value);
                    addRow(
                      "Repository URL",
                      re3Data?.repositoryURL?.value ? (
                        <a
                          href={re3Data?.repositoryURL?.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--fairagro-teal)" }}
                        >
                          {re3Data?.repositoryURL?.value}
                        </a>
                      ) : undefined,
                    );
                    addRow("re3data.org ID", orgIdentifier);
                    addRow("Description", re3Data?.description?.value);
                    addRow("Contact", re3Data?.repositoryContact?.value);
                    addRow("Start Date", re3Data?.startDate?.value);
                    addRow("Size", re3Data?.size?.value);
                    addRow("Content Types", re3Data?.contentType?.value);
                    addRow("Languages", re3Data?.repositoryLanguage?.value);
                    addRow("Keywords", re3Data?.keyword?.value);
                    addRow(
                      "Mission Statement URL",
                      re3Data?.missionStatementURL?.value ? (
                        <a
                          href={re3Data?.missionStatementURL?.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--fairagro-teal)" }}
                        >
                          {re3Data?.missionStatementURL?.value}
                        </a>
                      ) : undefined,
                    );
                    addRow("Provider Type", re3Data?.providerType?.value);
                    addRow("Type", re3Data?.type?.value);
                    addRow("Versioning", re3Data?.versioning?.value);
                    addRow("PID System", re3Data?.pidSystem?.value);
                    addRow(
                      "Citation Guideline URL",
                      re3Data?.citationGuidelineURL?.value ? (
                        <a
                          href={re3Data?.citationGuidelineURL?.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--fairagro-teal)" }}
                        >
                          {re3Data?.citationGuidelineURL?.value}
                        </a>
                      ) : undefined,
                    );
                    addRow("Enhanced Publication", re3Data?.enhancedPublication?.value);
                    addRow("Quality Management", re3Data?.qualityManagement?.value);
                    addRow("Certificate", re3Data?.certificate?.value);
                    addRow("Remarks", re3Data?.remarks?.value);
                    addRow("Entry Date", re3Data?.entryDate?.value);
                    addRow("Last Update", re3Data?.lastUpdate?.value);

                    if (
                      Array.isArray(re3Data?.institution?.value) &&
                      re3Data?.institution?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Institution(s)",
                          re3Data?.institution?.value.map(
                            (inst: any, idx: number) => (
                              <div key={idx} style={{ marginBottom: 4 }}>
                                <b>{inst.institutionName?.value}</b>
                                {inst.institutionType?.value
                                  ? ` (${inst.institutionType.value})`
                                  : ""}
                                <br />
                                {inst.institutionCountry?.value && (
                                  <>
                                    Country: {inst.institutionCountry.value}
                                    <br />
                                  </>
                                )}
                                {Array.isArray(inst.institutionAdditionalName?.value) &&
                                  inst.institutionAdditionalName.value.length > 0 && (
                                    <>
                                      Additional:{" "}
                                      {inst.institutionAdditionalName.value.join(", ")}
                                      <br />
                                    </>
                                  )}
                                {Array.isArray(inst.responsibilityType?.value) &&
                                  inst.responsibilityType.value.length > 0 && (
                                    <>
                                      Responsibility:{" "}
                                      {inst.responsibilityType.value.join(", ")}
                                      <br />
                                    </>
                                  )}
                                {inst.institutionURL?.value && (
                                  <>
                                    URL:{" "}
                                    <a
                                      href={inst.institutionURL.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "var(--fairagro-teal)" }}
                                    >
                                      {inst.institutionURL.value}
                                    </a>
                                    <br />
                                  </>
                                )}
                                {Array.isArray(inst.institutionIdentifier?.value) &&
                                  inst.institutionIdentifier.value.length > 0 && (
                                    <>
                                      Identifier:{" "}
                                      {inst.institutionIdentifier.value.join(", ")}
                                    </>
                                  )}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.policy?.value) &&
                      re3Data?.policy?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Policy(s)",
                          re3Data?.policy?.value.map(
                            (pol: any, idx: number) => (
                              <div key={idx} style={{ marginBottom: 4 }}>
                                <b>{pol.policyName?.value}</b>
                                {pol.policyURL?.value && (
                                  <>
                                    {" "}
                                    (
                                    <a
                                      href={pol.policyURL.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "var(--fairagro-teal)" }}
                                    >
                                      {pol.policyURL.value}
                                    </a>
                                    )
                                  </>
                                )}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.databaseAccess?.value) &&
                      re3Data?.databaseAccess?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Database Access",
                          re3Data?.databaseAccess?.value.map(
                            (da: any, idx: number) => (
                              <div key={idx}>
                                {da.databaseAccessType?.value}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.databaseLicense?.value) &&
                      re3Data?.databaseLicense?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Database License",
                          re3Data?.databaseLicense?.value.map(
                            (dl: any, idx: number) => (
                              <div key={idx}>
                                <b>{dl.databaseLicenseName?.value}</b>
                                {dl.databaseLicenseURL?.value && (
                                  <>
                                    {" "}
                                    (
                                    <a
                                      href={dl.databaseLicenseURL.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "var(--fairagro-teal)" }}
                                    >
                                      {dl.databaseLicenseURL.value}
                                    </a>
                                    )
                                  </>
                                )}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.dataAccess?.value) &&
                      re3Data?.dataAccess?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Data Access",
                          re3Data?.dataAccess?.value.map(
                            (da: any, idx: number) => (
                              <div key={idx}>{da.dataAccessType?.value}</div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.dataLicense?.value) &&
                      re3Data?.dataLicense?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Data License",
                          re3Data?.dataLicense?.value.map(
                            (dl: any, idx: number) => (
                              <div key={idx}>
                                <b>{dl.dataLicenseName?.value}</b>
                                {dl.dataLicenseURL?.value && (
                                  <>
                                    {" "}
                                    (
                                    <a
                                      href={dl.dataLicenseURL.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "var(--fairagro-teal)" }}
                                    >
                                      {dl.dataLicenseURL.value}
                                    </a>
                                    )
                                  </>
                                )}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.dataUpload?.value) &&
                      re3Data?.dataUpload?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Data Upload",
                          re3Data?.dataUpload?.value.map(
                            (du: any, idx: number) => (
                              <div key={idx}>
                                <b>{du.dataUploadType?.value}</b>
                                {Array.isArray(du.dataUploadRestriction?.value) &&
                                  du.dataUploadRestriction.value.length > 0 && (
                                    <>
                                      {" "}
                                      (Restriction:{" "}
                                      {du.dataUploadRestriction.value.join(", ")}
                                      )
                                    </>
                                  )}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.dataUploadLicense?.value) &&
                      re3Data?.dataUploadLicense?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Data Upload License",
                          re3Data?.dataUploadLicense?.value.map(
                            (dul: any, idx: number) => (
                              <div key={idx}>
                                <b>{dul.dataUploadLicenseName?.value}</b>
                                {dul.dataUploadLicenseURL?.value && (
                                  <>
                                    {" "}
                                    (
                                    <a
                                      href={dul.dataUploadLicenseURL.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "var(--fairagro-teal)" }}
                                    >
                                      {dul.dataUploadLicenseURL.value}
                                    </a>
                                    )
                                  </>
                                )}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    
                    if (
                      Array.isArray(re3Data?.metadataStandard?.value) &&
                      re3Data?.metadataStandard?.value.length > 0
                    ) {
                      rows.push(
                        renderRow(
                          "Metadata Standard(s)",
                          re3Data?.metadataStandard?.value.map(
                            (ms: any, idx: number) => (
                              <div key={idx}>
                                <b>{ms.metadataStandardName?.value}</b>
                                {ms.metadataStandardURL?.value && (
                                  <>
                                    {" "}
                                    (
                                    <a
                                      href={ms.metadataStandardURL.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "var(--fairagro-teal)" }}
                                    >
                                      {ms.metadataStandardURL.value}
                                    </a>
                                    )
                                  </>
                                )}
                              </div>
                            ),
                          ),
                        ),
                      );
                    }
                    return rows;
                  })()}
                </tbody>
              </Box>
            </Box>
          )}

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          FAIRness assessment
        </Typography>
        <FairnessTable fairness={cleanFairness} />
      </Paper>
    </Container>
  );
}