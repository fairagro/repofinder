import { Box, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { FAIRNESS_CRITERIA, FAIR_PILLARS, STATUS_COLORS, STATUS_LABELS, pillarColor } from "./utils/fairnessConstants";
import { criteriaResults } from "./utils/fairnessScore";
import { getIconComponent } from "./utils/iconMap";
import { statusOf } from "./StatusGlyph";

/** 20 criteria grouped by pillar; each criterion icon is tinted with its status color (label + tooltip carry the text). */
export default function FairnessGrid({ fairnessData }: { fairnessData: any }) {
  const results = criteriaResults(fairnessData);

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.5, sm: 2.5 }, rowGap: 1.5 }}>
      {FAIR_PILLARS.map((pillar) => {
        const items = results.filter((r) => r.pillar.toLowerCase() === pillar);
        return (
          <Box key={pillar} sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{ display: "flex", alignItems: "center", gap: 0.75, fontWeight: 600, color: "text.secondary", mb: 0.5, textTransform: "capitalize" }}
            >
              <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: pillarColor(pillar) }} />
              {pillar}
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {items.map((r) => {
                const status = statusOf(r.met);
                const Icon = getIconComponent(FAIRNESS_CRITERIA.find((c) => c.key === r.key)?.icon || "HelpIcon");
                return (
                  <Tooltip key={r.key} title={`${r.key}. ${r.label} — ${STATUS_LABELS[status]}`}>
                    <Box
                      component={Link}
                      href={`/indicator/${r.key}`}
                      aria-label={`${r.label}: ${STATUS_LABELS[status]}`}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 34,
                        height: 34,
                        borderRadius: 2,
                        color: STATUS_COLORS[status],
                        bgcolor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                        transition: "transform .15s ease, border-color .15s ease",
                        "&:hover, &:focus-visible": { transform: "translateY(-2px)", borderColor: STATUS_COLORS[status] },
                      }}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
