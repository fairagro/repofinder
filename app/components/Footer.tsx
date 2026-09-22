"use client";
import { Box, Container, Link as MuiLink, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import Logo, { Wordmark } from "./Logo";

const LINKS = [
  { href: "/contact", label: "Contact" },
  { href: "https://fairagro.net/en/helpdesk/", label: "Help desk", external: true },
  { href: "/api-docs", label: "API" },
  { href: "/schema", label: "Metadata schema" },
  { href: "/api/fairness/csv", label: "Download CSV", plain: true },
  { href: "/imprint", label: "Imprint" },
  { href: "/privacy", label: "Privacy (GDPR)" },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 6, borderTop: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
      <Container maxWidth="xl" sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, textAlign: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Logo size={26} />
          <Wordmark size={17} />
        </Box>
        <Stack component="nav" aria-label="Footer" direction="row" spacing={{ xs: 2, sm: 3 }} sx={{ flexWrap: "wrap", justifyContent: "center", rowGap: 1 }}>
          {LINKS.map((l) =>
            l.external ? (
              <MuiLink key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" variant="body2" color="text.secondary">{l.label}</MuiLink>
            ) : l.plain ? (
              <MuiLink key={l.href} href={l.href} variant="body2" color="text.secondary">{l.label}</MuiLink>
            ) : (
              <MuiLink key={l.href} component={NextLink} href={l.href} variant="body2" color="text.secondary">{l.label}</MuiLink>
            ),
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Assessment data is published under CC0 1.0 · Map tiles © OpenStreetMap contributors
        </Typography>
      </Container>
    </Box>
  );
}
