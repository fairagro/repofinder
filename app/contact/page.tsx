import type { Metadata } from "next";
import { Box, Button, Container, Link as MuiLink, Paper, Stack, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PlaceIcon from "@mui/icons-material/Place";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LaunchIcon from "@mui/icons-material/Launch";

export const metadata: Metadata = { title: "Contact" };

// IPK Gatersleben, Corrensstraße 3
const IPK = { lat: 51.8265, lon: 11.2865 };
const bbox = [IPK.lon - 0.012, IPK.lat - 0.006, IPK.lon + 0.012, IPK.lat + 0.006].join(",");
const MAP_EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${IPK.lat},${IPK.lon}`;
const MAP_LINK = `https://www.openstreetmap.org/?mlat=${IPK.lat}&mlon=${IPK.lon}#map=16/${IPK.lat}/${IPK.lon}`;

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="h6" component="h2" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Box component="span" sx={{ color: "primary.main", display: "inline-flex" }}>{icon}</Box>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default function ContactPage() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
        Contact us
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(300px, 420px) 1fr" }, gap: { xs: 4, md: 6 }, alignItems: "start" }}>
        <Stack spacing={4}>
          <Section icon={<EmailIcon />} title="Email &amp; inquiries">
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="body2" color="text.secondary">Primary correspondence</Typography>
                <Typography>
                  Matthias Lange · <MuiLink href="mailto:lange@ipk-gatersleben.de">lange@ipk-gatersleben.de</MuiLink>
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Contact developer</Typography>
                <Typography>
                  Ata Ul Haleem · <MuiLink href="mailto:a.haleem@fz-juelich.de">a.haleem@fz-juelich.de</MuiLink>
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Has your infrastructure&apos;s FAIRness changed since the interview, or is something in an assessment
                incorrect? Write to us and we will review and update the record.
              </Typography>
            </Stack>
          </Section>

          <Section icon={<SupportAgentIcon />} title="Help desk">
            <Typography sx={{ mb: 1.5 }}>
              Questions about FAIRagro services, data publication or the Search Hub go to the FAIRagro help desk.
            </Typography>
            <Button href="https://fairagro.net/en/helpdesk/" target="_blank" rel="noopener noreferrer" variant="outlined" endIcon={<LaunchIcon />}>
              FAIRagro help desk
            </Button>
          </Section>

          <Section icon={<PlaceIcon />} title="Physical address">
            <Typography component="address" sx={{ fontStyle: "normal", lineHeight: 1.7 }}>
              Leibniz Institute of Plant Genetics and Crop Plant Research (IPK)<br />
              Corrensstraße 3<br />
              06466 Seeland, OT Gatersleben, Germany
            </Typography>
          </Section>

          <Section icon={<MarkunreadMailboxIcon />} title="Postal address">
            <Typography component="address" sx={{ fontStyle: "normal", lineHeight: 1.7 }}>
              IPK Gatersleben<br />
              Bioinformatics and Information Technology<br />
              Corrensstraße 3<br />
              06466 Seeland, Germany
            </Typography>
          </Section>

          <Button href="https://www.ipk-gatersleben.de/en/contact/" target="_blank" rel="noopener noreferrer" variant="contained" size="large" endIcon={<LaunchIcon />} sx={{ alignSelf: "flex-start" }}>
            Contact &amp; visitor information
          </Button>
        </Stack>

        <Paper sx={{ overflow: "hidden", borderRadius: 3 }}>
          <Box
            component="iframe"
            title="Map of IPK Gatersleben"
            src={MAP_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sx={{ display: "block", width: "100%", height: { xs: 320, md: 560 }, border: 0 }}
          />
          <Box sx={{ px: 2, py: 1.25, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">IPK Gatersleben · Corrensstraße 3</Typography>
            <MuiLink href={MAP_LINK} target="_blank" rel="noopener noreferrer" variant="body2">Open in OpenStreetMap</MuiLink>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
