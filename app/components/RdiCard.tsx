import { Box, Card, CardContent, Chip, Divider, Typography, Button, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import LaunchIcon from "@mui/icons-material/Launch";
import FairnessGrid from "./FairnessGrid";
import { extractRdiDisplayData, extractCollections, extractRepositoryUrl, Rdi, extractDatasetSearchId } from "./utils/rdiDataExtraction";

export default function RdiCard({ rdi }: { rdi: Rdi }) {
  const { title, description, FAIRness } = extractRdiDisplayData(rdi);
  const collections = extractCollections(rdi.raw);
  const identifier = rdi.id || "unknown";
  const url = extractRepositoryUrl(rdi.raw);
  const collectionId = extractDatasetSearchId(rdi.raw);

  return (
    <Card
      component="article"
      sx={{
        borderRadius: 3,
        transition: "box-shadow .2s ease, border-color .2s ease",
        "&:hover": { boxShadow: "0 8px 24px rgba(15, 152, 132, 0.10)", borderColor: "primary.light" },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 }, "&:last-child": { pb: { xs: 2, sm: 3 } } }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mb: 0.5 }}>
              <MuiLink
                component={Link}
                href={`/resource/repository/${identifier}`}
                variant="h6"
                sx={{ color: "text.primary", fontWeight: 700, lineHeight: 1.3, "&:hover": { color: "primary.main" } }}
              >
                {title}
              </MuiLink>
              <Chip label={identifier} size="small" variant="outlined" sx={{ fontFamily: "var(--font-geist-mono)", fontWeight: 500, height: 22 }} />
            </Box>
            {url && (
              <MuiLink href={url} target="_blank" rel="noopener noreferrer" variant="body2" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, wordBreak: "break-all" }}>
                {url.replace(/^https?:\/\//, "")}
                <LaunchIcon sx={{ fontSize: 14 }} />
              </MuiLink>
            )}
            {description && (
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "text.secondary", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                {description}
              </Typography>
            )}
          </Box>
        </Box>

        {(collections.length > 0 || collectionId) && (
          <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            {collections.map((c: string) => (
              <Chip key={c} label={c} size="small" sx={{ bgcolor: "var(--fairagro-green-5)", color: "text.primary" }} />
            ))}
            {collectionId && (
              <Button
                size="small"
                variant="text"
                href={`https://datasets.search-hub.fairagro.net/collection/${collectionId}`}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<LaunchIcon />}
                sx={{ ml: "auto" }}
              >
                View datasets
              </Button>
            )}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />
        <FairnessGrid fairnessData={FAIRness} />
      </CardContent>
    </Card>
  );
}
