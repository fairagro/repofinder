import { Box, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { STATUS_COLORS, STATUS_LABELS } from "./utils/fairnessConstants";

export default function CardLegend() {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, color: "text.secondary" }}>
      <Typography variant="caption" sx={{ fontWeight: 600 }}>Legend</Typography>
      {(["yes", "no", "unknown"] as const).map((s) => (
        <Box key={s} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <CircleIcon sx={{ fontSize: 14, color: STATUS_COLORS[s] }} aria-hidden />
          <Typography variant="caption">{STATUS_LABELS[s]}</Typography>
        </Box>
      ))}
      <Typography variant="caption" sx={{ ml: { sm: "auto" } }}>Click a criterion icon for its definition</Typography>
    </Box>
  );
}
