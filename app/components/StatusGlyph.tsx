import { Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { STATUS_COLORS, STATUS_LABELS } from "./utils/fairnessConstants";

export type Status = keyof typeof STATUS_COLORS;

export function statusOf(met: boolean | null): Status {
  return met === null ? "unknown" : met ? "yes" : "no";
}

/** Small filled circle with a check / cross / question mark — never color alone. */
export default function StatusGlyph({ status, size = 16 }: { status: Status; size?: number }) {
  const Icon = status === "yes" ? CheckIcon : status === "no" ? CloseIcon : QuestionMarkIcon;
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
        bgcolor: STATUS_COLORS[status],
        color: "#fff",
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: size * 0.72 }} />
    </Box>
  );
}
