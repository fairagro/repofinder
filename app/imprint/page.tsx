import type { Metadata } from "next";
import { Container, Link as MuiLink, Stack, Typography } from "@mui/material";

export const metadata: Metadata = { title: "Imprint" };

// Legal notice pursuant to § 5 DDG and § 18 MStV. Entries in [brackets] must be confirmed by the operator.
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <Typography variant="h6" component="h2" sx={{ mb: 1 }}>{title}</Typography>
      <Typography component="div" sx={{ lineHeight: 1.8, color: "text.primary" }}>{children}</Typography>
    </section>
  );
}

export default function ImprintPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" component="h1" sx={{ mb: 1 }}>Imprint</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>Legal notice (Impressum) according to § 5 DDG and § 18 MStV.</Typography>

      <Stack spacing={4}>
        <Block title="Service provider">
          Leibniz Institute of Plant Genetics and Crop Plant Research (IPK)<br />
          Corrensstraße 3<br />
          06466 Seeland, OT Gatersleben, Germany<br />
          Foundation under public law (Stiftung des öffentlichen Rechts)
        </Block>

        <Block title="Represented by">
          [Managing Director / authorised representative — to be confirmed]
        </Block>

        <Block title="Contact">
          Phone: [+49 39482 5-0]<br />
          Email: <MuiLink href="mailto:lange@ipk-gatersleben.de">lange@ipk-gatersleben.de</MuiLink><br />
          Web: <MuiLink href="https://www.ipk-gatersleben.de/" target="_blank" rel="noopener noreferrer">www.ipk-gatersleben.de</MuiLink>
        </Block>

        <Block title="Supervisory authority and identifiers">
          Supervisory authority: [Ministry of Science, Energy, Climate Protection and Environment of Saxony-Anhalt]<br />
          VAT identification number (§ 27a UStG): [DE …]
        </Block>

        <Block title="Responsible for content (§ 18 (2) MStV)">
          Matthias Lange<br />
          Bioinformatics and Information Technology, IPK Gatersleben<br />
          Corrensstraße 3, 06466 Seeland, Germany
        </Block>

        <Block title="Project context">
          RepoFinder is developed within{" "}
          <MuiLink href="https://fairagro.net/" target="_blank" rel="noopener noreferrer">FAIRagro</MuiLink>, a consortium of the
          National Research Data Infrastructure (NFDI), funded by the Deutsche Forschungsgemeinschaft (DFG).
          Technical development: Ata Ul Haleem, Forschungszentrum Jülich GmbH (IBG-4).
        </Block>

        <Block title="Liability for content">
          The contents of this site were created with great care. However, we cannot guarantee that the FAIRness
          assessments are complete, correct or current: they reflect information provided by repository operators in
          interviews and metadata harvested from re3data.org at a given point in time. Repository operators who find
          an assessment outdated or incorrect are invited to <MuiLink href="/contact">contact us</MuiLink>.
        </Block>

        <Block title="Liability for links">
          This site links to external websites over whose content we have no control. The respective provider is
          always responsible for the content of linked pages. Links were checked for possible legal violations at the
          time of linking; illegal content was not recognisable. Links found to be infringing will be removed promptly.
        </Block>

        <Block title="Copyright and licences">
          The assessment data exposed by this site and its API are released under{" "}
          <MuiLink href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">CC0 1.0</MuiLink>.
          The application source code is available under the MIT licence. Map tiles on the contact page are
          © <MuiLink href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</MuiLink> (ODbL).
        </Block>
      </Stack>
    </Container>
  );
}
