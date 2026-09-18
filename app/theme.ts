"use client";
import { createTheme } from "@mui/material/styles";

// Brand colors come from FAIRagro; data-status colors live in fairnessConstants (colorblind-safe).
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: "#0f9884", dark: "#0b7466", light: "#3fac9c", contrastText: "#ffffff" },
    secondary: { main: "#6abf5c", dark: "#4f9a44", light: "#87cb7c", contrastText: "#0b2a12" },
    background: { default: "#f5f7f6", paper: "#ffffff" },
    text: { primary: "#1b1f1e", secondary: "#5b6462" },
    divider: "#e3e8e6",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.015em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 650 },
    h6: { fontWeight: 650 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { WebkitFontSmoothing: "antialiased" },
        "code, pre, kbd": { fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace" },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { border: "1px solid #e3e8e6", backgroundImage: "none" } },
    },
    MuiCard: { styleOverrides: { root: { border: "1px solid #e3e8e6" } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 999, paddingInline: 18 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiTableHead: { styleOverrides: { root: { "& th": { fontWeight: 700, backgroundColor: "#f5f7f6" } } } },
    MuiTooltip: { defaultProps: { arrow: true } },
    MuiLink: { defaultProps: { underline: "hover" } },
  },
});

export default theme;
