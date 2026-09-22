import type { Metadata } from "next";
import { Container, Link as MuiLink, Stack, Typography } from "@mui/material";

export const metadata: Metadata = { title: "Privacy" };

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <Typography variant="h6" component="h2" sx={{ mb: 1 }}>{title}</Typography>
      <Typography component="div" sx={{ lineHeight: 1.8 }}>{children}</Typography>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" component="h1" sx={{ mb: 1 }}>Privacy policy</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Information on the processing of personal data pursuant to Art. 13 GDPR. Last updated: September 2026.
      </Typography>

      <Stack spacing={4}>
        <Block title="1. Controller">
          Leibniz Institute of Plant Genetics and Crop Plant Research (IPK), Corrensstraße 3, 06466 Seeland, OT
          Gatersleben, Germany. Contact for this service:{" "}
          <MuiLink href="mailto:lange@ipk-gatersleben.de">lange@ipk-gatersleben.de</MuiLink>. Data protection officer:
          [datenschutz@ipk-gatersleben.de — to be confirmed].
        </Block>

        <Block title="2. What this site does — and does not — collect">
          RepoFinder is a read-only information service. It has no user accounts, no login, no contact forms, no
          newsletter, no tracking or analytics, and sets <strong>no cookies</strong>. Fonts are served from this site,
          not from Google. The only browser storage used is none; all filtering and searching happens in your browser
          without sending your input to us (the JSON API can be queried directly, see section 4).
        </Block>

        <Block title="3. Server log files">
          When you open a page, the hosting provider automatically records technical data needed to deliver it: IP
          address, date and time, requested URL, HTTP status, transferred bytes, referrer and user-agent string. These
          logs serve the secure and stable operation of the site (Art. 6 (1) (f) GDPR) and are deleted or anonymised
          by the provider after a short retention period. Hosting provider: [name and address of the institution
          operating the server — to be confirmed].
        </Block>

        <Block title="4. Public API">
          Requests to <code>/api/…</code> are processed like page requests (section 3). Query parameters you send to the
          search endpoint are part of the request URL and therefore appear in the server log. The API returns only
          information about research data infrastructures; it contains contact details of repositories (institutional
          addresses and role emails) that the operators provided for publication.
        </Block>

        <Block title="5. Embedded map (OpenStreetMap)">
          The contact page embeds a map from the OpenStreetMap Foundation (St John&apos;s Innovation Centre, Cowley Road,
          Cambridge CB4 0WS, United Kingdom). Loading it transmits your IP address and browser data to OpenStreetMap
          servers. Legal basis is our legitimate interest in showing our location (Art. 6 (1) (f) GDPR); the UK is
          covered by an EU adequacy decision. See the{" "}
          <MuiLink href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer">OSMF privacy policy</MuiLink>.
          If you do not wish this, do not open the contact page or block third-party frames in your browser.
        </Block>

        <Block title="6. Email contact">
          If you write to us, the email and the data it contains are processed to handle your request (Art. 6 (1) (e)
          and (f) GDPR) and retained as long as required for that purpose or by statutory retention periods.
        </Block>

        <Block title="7. Personal data in published assessments">
          Published records may name interview partners or repository contacts in their professional role. The legal
          basis is Art. 6 (1) (e) GDPR (public interest in research infrastructure transparency) together with the
          consent given during the interview. Persons named can request correction or removal at any time via the
          controller.
        </Block>

        <Block title="8. Your rights">
          You have the right to access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction of processing
          (Art. 18), data portability (Art. 20) and to object to processing based on Art. 6 (1) (e) or (f) (Art. 21
          GDPR). You may lodge a complaint with a supervisory authority, e.g. the Landesbeauftragte für den Datenschutz
          Sachsen-Anhalt.
        </Block>

        <Block title="9. Changes">
          This policy is updated when the service changes. The date at the top indicates the current version.
        </Block>
      </Stack>
    </Container>
  );
}
