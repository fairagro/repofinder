import { Box } from "@mui/material";

/** Four tiles for the four FAIR pillars. Same shapes as app/icon.svg (the favicon). */
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
      sx={{ display: "block", flexShrink: 0 }}
    >
      <rect width="64" height="64" rx="14" fill="#0f9884" />
      <rect x="12" y="12" width="18" height="18" rx="5" fill="#fff" />
      <rect x="34" y="12" width="18" height="18" rx="5" fill="#fff" fillOpacity="0.85" />
      <rect x="12" y="34" width="18" height="18" rx="5" fill="#fff" fillOpacity="0.85" />
      <rect x="34" y="34" width="18" height="18" rx="5" fill="#fff" fillOpacity="0.6" />
    </Box>
  );
}

/** Two-tone wordmark that pairs with the mark; used in the header and footer. */
export function Wordmark({ size = 20 }: { size?: number }) {
  return (
    <Box
      component="span"
      sx={{ fontFamily: "var(--font-wordmark), var(--font-geist-sans), sans-serif", fontSize: size, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1, color: "text.primary", whiteSpace: "nowrap" }}
    >
      Repo
      <Box component="span" sx={{ color: "primary.main" }}>Finder</Box>
    </Box>
  );
}
