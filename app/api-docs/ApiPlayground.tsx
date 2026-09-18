"use client";
import { useState } from "react";
import { Box, Button, Chip, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

/** Minimal "try it" console: edit a relative /api path, run it, see status + body. */
export default function ApiPlayground({ initialPath }: { initialPath: string }) {
  const [path, setPath] = useState(initialPath);
  const [status, setStatus] = useState<{ code: number; type: string; ms: number } | null>(null);
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    const started = performance.now();
    try {
      const res = await fetch(path, { headers: { Accept: "application/json, text/csv;q=0.9" } });
      const type = res.headers.get("content-type") || "";
      const text = await res.text();
      let pretty = text;
      if (type.includes("json")) {
        try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch { /* keep raw */ }
      }
      setStatus({ code: res.status, type: type.split(";")[0], ms: Math.round(performance.now() - started) });
      setBody(pretty.length > 60000 ? pretty.slice(0, 60000) + "\n… (truncated)" : pretty);
    } catch (err) {
      setStatus({ code: 0, type: "error", ms: Math.round(performance.now() - started) });
      setBody(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper sx={{ p: 2.5 }}>
      <Box component="form" onSubmit={(e) => { e.preventDefault(); run(); }} sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
        <Chip label="GET" color="primary" size="small" sx={{ fontFamily: "var(--font-geist-mono)" }} />
        <TextField
          value={path}
          onChange={(e) => setPath(e.target.value)}
          size="small"
          aria-label="Request path"
          sx={{ flex: 1, minWidth: 240, "& input": { fontFamily: "var(--font-geist-mono)", fontSize: 14 } }}
        />
        <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />} disabled={loading}>
          Send
        </Button>
      </Box>
      {status && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1, flexWrap: "wrap" }}>
            <Chip size="small" label={status.code === 0 ? "Network error" : `${status.code}`} color={status.code >= 200 && status.code < 300 ? "success" : "warning"} variant="outlined" />
            <Typography variant="caption" color="text.secondary">{status.type} · {status.ms} ms</Typography>
          </Box>
          <Box
            component="pre"
            tabIndex={0}
            sx={{ m: 0, p: 2, maxHeight: 420, overflow: "auto", fontSize: 12.5, lineHeight: 1.5, bgcolor: "#0f1716", color: "#dfe8e5", borderRadius: 2 }}
          >
            {body}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
