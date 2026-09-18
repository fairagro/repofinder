"use client";
import { Box, Container, Link as MuiLink, Stack, Typography } from "@mui/material";
import NextLink from "next/link";

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 6, borderTop: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} FAIRagro — Powered by Open Science
          </Typography>
          <Stack direction="row" spacing={2.5} sx={{ flexWrap: "wrap" }}>
            <MuiLink component={NextLink} href="/api-docs" variant="body2">API</MuiLink>
            <MuiLink component={NextLink} href="/schema" variant="body2">Metadata schema</MuiLink>
            <MuiLink href="/api/fairness/csv" variant="body2">Download CSV</MuiLink>
            <MuiLink href="https://fairagro.net/" target="_blank" rel="noopener noreferrer" variant="body2">fairagro.net</MuiLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
