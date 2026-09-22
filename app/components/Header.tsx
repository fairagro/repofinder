"use client";
import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Box, Button, Container, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Logo, { Wordmark } from "./Logo";

const NAV = [
  { href: "/", label: "Repositories" },
  { href: "/interview", label: "Interview" },
  { href: "/downloads", label: "Downloads" },
  { href: "/api-docs", label: "API" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderBottom: "1px solid", borderColor: "divider", borderTop: "4px solid", borderTopColor: "secondary.main" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 2, minHeight: 64 }}>
          <Box component={NextLink} href="/" aria-label="RepoFinder home" sx={{ display: "flex", alignItems: "center", gap: 1.25, mr: "auto", textDecoration: "none", "&:hover svg": { transform: "rotate(-6deg)" }, "& svg": { transition: "transform .2s ease" } }}>
            <Logo size={34} />
            <Wordmark size={21} />
          </Box>

          <Box component="nav" aria-label="Main" sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}>
            {NAV.map((item) => (
              <Button
                key={item.href}
                component={NextLink}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                sx={{
                  color: isActive(item.href) ? "primary.main" : "text.secondary",
                  fontWeight: 600,
                  bgcolor: isActive(item.href) ? "var(--fairagro-teal-5)" : "transparent",
                  "&:hover": { color: "primary.main", bgcolor: "var(--fairagro-teal-5)" },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <IconButton aria-label="Open menu" onClick={() => setOpen(true)} sx={{ display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} slotProps={{ paper: { sx: { width: 280 } } }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton aria-label="Close menu" onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List component="nav" aria-label="Main">
          {NAV.map((item) => (
            <ListItemButton key={item.href} component={NextLink} href={item.href} selected={isActive(item.href)} onClick={() => setOpen(false)}>
              <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: 600 } } }} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
