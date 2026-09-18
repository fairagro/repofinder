// app/api/resource/repository/[rdiId]/fairness/route.ts
import { NextResponse } from 'next/server';
import { API_BASE, notFound, serverError, SITE_URL } from '@/app/api/_lib/http';
import { findRdi, links, rdiIds } from '@/app/api/_lib/rdi';
import { extractRdiDisplayData } from '@/app/components/utils/rdiDataExtraction';
import {
  conceptualizeFairnessData,
  getFairnessSchemaBlock,
} from '@/app/components/utils/fairnessSchema';

export const dynamic = "force-static";

export function generateStaticParams() {
  return rdiIds().map((rdiId) => ({ rdiId }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ rdiId: string }> }
) {
  try {
    const { rdiId } = await params;
    const rdi = findRdi(rdiId);
    if (!rdi) return notFound(`No repository with id "${rdiId}"`);

    const { title, FAIRness: fairnessRawData } = extractRdiDisplayData(rdi);

    // Resolve context using exclusively the FAIRness block definitions
    const fairnessSchema = getFairnessSchemaBlock();
    const cleanFairnessLd = conceptualizeFairnessData(fairnessRawData, fairnessSchema);

    const jsonLd = {
      "@context": [
        "https://schema.org",
        {
          "fairagro": `${SITE_URL}/schema/`,
          "fairnessAssessment": "fairagro:fairnessAssessment",
          "metadataStandard": "fairagro:metadataStandard"
        }
      ],
      "@type": "DataCatalog",
      "@id": `${API_BASE}/resource/repository/${rdiId}/fairness`,
      "url": `${SITE_URL}/resource/repository/${rdiId}`,
      "identifier": rdiId,
      "name": title,
      "metadataStandard": `${SITE_URL}/schema`,
      "fairnessAssessment": {
        "@type": "CreativeWork",
        "name": "FAIRness Assessment",
        "description": fairnessSchema?.description || "FAIR Principles implementation assessment",
        ...cleanFairnessLd
      },
      "links": links(rdiId)
    };

    return new NextResponse(JSON.stringify(jsonLd), {
      status: 200,
      headers: {
        'Content-Type': 'application/ld+json',
        'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return serverError(error);
  }
}