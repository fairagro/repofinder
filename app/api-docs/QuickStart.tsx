"use client";
import { useEffect, useState } from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { API_BASE } from "@/app/api/_lib/config";

function CodeBlock({ children }: { children: string }) {
  return (
    <Box component="pre" sx={{ m: 0, p: 2, overflow: "auto", fontSize: 13, lineHeight: 1.6, bgcolor: "#0f1716", color: "#dfe8e5", borderRadius: 2 }}>
      {children}
    </Box>
  );
}

/** Base URL chip + copy-pasteable examples, using the origin the page is actually served from. */
export default function QuickStart() {
  // Server render (and any configured NEXT_PUBLIC_SITE_URL) first; swap in the live origin once mounted.
  const [base, setBase] = useState(API_BASE);
  useEffect(() => {
    if (!API_BASE.startsWith("http")) setBase(`${window.location.origin}${API_BASE}`);
  }, []);

  return (
    <>
      <Chip label={`Base URL ${base}`} sx={{ fontFamily: "var(--font-geist-mono)", mb: 3 }} />
      <Stack spacing={2}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>Search repositories and sort by title</Typography>
          <CodeBlock>{`curl "${base}/resource/repository?q=soil&sort=title&limit=5"`}</CodeBlock>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>One repository with its 20 criteria, pillar scores and re3data profile</Typography>
          <CodeBlock>{`curl "${base}/resource/repository/RFId001202604272"`}</CodeBlock>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>The whole FAIRness matrix as CSV (Python)</Typography>
          <CodeBlock>{`import pandas as pd\ndf = pd.read_csv("${base}/fairness/csv")\ndf.groupby("findability")["id"].count()`}</CodeBlock>
        </Box>
      </Stack>
    </>
  );
}
