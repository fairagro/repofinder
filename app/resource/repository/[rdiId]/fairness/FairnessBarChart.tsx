"use client";
import { Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList } from "recharts";
import { FAIR_PILLARS, pillarColor } from "@/app/components/utils/fairnessConstants";

interface ChartProps {
  /** The flattened `fairnessAssessment` object: pillar → criterion → { value }. */
  fairnessData: any;
}

const RESERVED_KEYS = ["description", "display_name", "title", "type"];

function pillarPercentage(pillar: Record<string, any> | undefined) {
  if (!pillar || typeof pillar !== "object") return null;
  let answered = 0;
  let met = 0;
  for (const [field, node] of Object.entries(pillar)) {
    if (RESERVED_KEYS.includes(field)) continue;
    const val = node?.value;
    if (typeof val !== "boolean") continue; // null = not assessed, excluded from the denominator
    answered++;
    if (val === true) met++;
  }
  return answered > 0 ? Math.round((met / answered) * 100) : null;
}

export default function FairnessBarChart({ fairnessData }: ChartProps) {
  const data = FAIR_PILLARS.map((p) => ({
    key: p,
    name: p.charAt(0).toUpperCase() + p.slice(1),
    score: pillarPercentage(fairnessData?.[p]) ?? 0,
    color: pillarColor(p),
  }));

  return (
    <Box sx={{ width: "100%", height: 320 }} role="img" aria-label={data.map((d) => `${d.name} ${d.score}%`).join(", ")}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e8e6" />
          <XAxis dataKey="name" tick={{ fill: "#5b6462", fontWeight: 600, fontSize: 13 }} axisLine={{ stroke: "#e3e8e6" }} tickLine={false} />
          <YAxis domain={[0, 100]} unit="%" tick={{ fill: "#5b6462", fontSize: 12 }} axisLine={false} tickLine={false} width={44} />
          <Tooltip cursor={{ fill: "rgba(15,152,132,0.06)" }} formatter={(value) => [`${value}%`, "Criteria met"]} contentStyle={{ borderRadius: 8, border: "1px solid #e3e8e6" }} />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={72} isAnimationActive={false}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.color} />
            ))}
            <LabelList dataKey="score" position="top" formatter={(v) => `${v}%`} style={{ fill: "#1b1f1e", fontWeight: 700, fontSize: 13 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
