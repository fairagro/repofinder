// Single source of truth for the 20 FAIRness criteria: public/indicators.json.
// The JSON also carries a `definition` field, used by the indicator detail page.
import indicators from "@/public/indicators.json";

export interface FairnessCriterion {
  key: string;
  /** Field name inside the FAIRness compound of the MDS_fairagro metadata block. */
  field: string;
  label: string;
  icon: string;
  rdaCode: string;
  pillar: string;
  description: string;
  definition?: string;
}

export const FAIRNESS_CRITERIA: FairnessCriterion[] = indicators;

export const FAIR_PILLARS = ["findability", "accessibility", "interoperability", "reusability"] as const;
export type FairPillar = (typeof FAIR_PILLARS)[number];

// Traffic-light semantics as described in the FAIRagro methodology paper (green = compliant,
// red = non-compliant, grey = unknown), using the Okabe-Ito green/vermillion pair, which stays
// distinguishable under deuteranopia/protanopia. Every status is also paired with a glyph
// (check / cross / question mark) so no information is carried by hue alone.
export const STATUS_COLORS = {
  yes: "#009E73", // bluish green
  no: "#D55E00", // vermillion
  unknown: "#8C8C8C", // neutral grey
} as const;

export const STATUS_LABELS = {
  yes: "Criterion met",
  no: "Criterion not met",
  unknown: "Not assessed",
} as const;

export const PILLAR_COLORS: Record<string, string> = {
  FINDABILITY: "#0072B2", // blue
  ACCESSIBILITY: "#E69F00", // orange
  INTEROPERABILITY: "#56B4E9", // sky blue
  REUSABILITY: "#CC79A7", // reddish purple
};

export const PILLAR_BG_COLORS: Record<string, string> = {
  FINDABILITY: "#E1EEF7",
  ACCESSIBILITY: "#FBF1DC",
  INTEROPERABILITY: "#E4F3FB",
  REUSABILITY: "#F7E7F0",
};

export const PILLAR_FALLBACK_COLOR = "#8C8C8C";
export const PILLAR_FALLBACK_BG_COLOR = "#F0F0F0";

export function pillarColor(pillar: string) {
  return PILLAR_COLORS[pillar.toUpperCase()] || PILLAR_FALLBACK_COLOR;
}

export function pillarBgColor(pillar: string) {
  return PILLAR_BG_COLORS[pillar.toUpperCase()] || PILLAR_FALLBACK_BG_COLOR;
}
