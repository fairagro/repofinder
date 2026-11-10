import { Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import RemoveIcon from "@mui/icons-material/Remove";
import { STATUS_COLORS, STATUS_LABELS } from "./utils/fairnessConstants";

export type Status = keyof typeof STATUS_COLORS;

/**
 * Small circle with a check / cross / dash / question mark — never color alone.
 * "not applicable" is drawn outlined (dash) so it cannot be confused with "unknown" (filled, question mark).
 */
export default function StatusGlyph({ status, size = 16 }: { status: Status; size?: number }) {
  const Icon = status === "yes" ? CheckIcon : status === "no" ? CloseIcon : status === "not applicable" ? RemoveIcon : QuestionMarkIcon;
  const outlined = status === "not applicable";
  return (
    <Box
      component="span"
      role="img"
      aria-label={STATUS_LABELS[status]}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        boxSizing: "border-box",
        bgcolor: outlined ? "transparent" : STATUS_COLORS[status],
        border: outlined ? `2px solid ${STATUS_COLORS[status]}` : "none",
        color: outlined ? STATUS_COLORS[status] : "#fff",
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: size * 0.72 }} />
    </Box>
  );
}
