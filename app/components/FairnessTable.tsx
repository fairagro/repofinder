"use client";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import StatusGlyph, { type Status } from "./StatusGlyph";
import { FAIR_PILLARS, STATUS_LABELS, pillarColor } from "./utils/fairnessConstants";

interface FairnessTableProps {
  /** The flattened `fairnessAssessment` object: pillar → criterion → { value, title, ... }. */
  fairness: any;
}

const RESERVED_KEYS = ["description", "display_name", "title", "type"];

function statusFor(val: unknown): Status {
  if (val === null || val === undefined || val === "na" || val === "") return "unknown";
  return val === true || val === "yes" ? "yes" : "no";
}

export default function FairnessTable({ fairness }: FairnessTableProps) {
  if (!fairness) return <Typography sx={{ p: 2 }}>No FAIRness data available.</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="FAIRness criteria by pillar">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "22%" }}>Pillar</TableCell>
            <TableCell>Criterion</TableCell>
            <TableCell sx={{ width: "28%" }}>Result</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {FAIR_PILLARS.map((pillar) => {
            const pillarObj = fairness[pillar];
            if (!pillarObj) return null;
            const entries = Object.entries(pillarObj).filter(([key]) => !RESERVED_KEYS.includes(key)) as [string, any][];

            return entries.map(([field, crit], idx) => {
              const val = crit?.value;
              const status = statusFor(val);
              const label = crit?.title || field.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
              return (
                <TableRow key={`${pillar}-${field}`} hover>
                  {idx === 0 && (
                    <TableCell rowSpan={entries.length} sx={{ verticalAlign: "top", pt: 1.5, borderLeft: "4px solid", borderLeftColor: pillarColor(pillar), fontWeight: 700, textTransform: "capitalize" }}>
                      {pillar}
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography variant="body2">{label}</Typography>
                    {crit?.description && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        {crit.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <StatusGlyph status={status} size={18} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{STATUS_LABELS[status]}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            });
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
