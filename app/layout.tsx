import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Display face used only for the RepoFinder wordmark.
const spaceGrotesk = Space_Grotesk({ variable: "--font-wordmark", weight: ["700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "RepoFinder — RDI FAIRness Inventory", template: "%s · RepoFinder" },
  description:
    "Browse FAIRness assessments of research data infrastructures in the FAIRagro Search Hub.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Providers>
          <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
            <Header />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
