import { Box, Button, Checkbox, Chip, Divider, FormControlLabel, FormGroup, Typography } from "@mui/material";

export interface FacetOption {
  value: string;
  count: number;
}

interface FilterSidebarProps {
  subjects: FacetOption[];
  collections: FacetOption[];
  selectedSubjects: string[];
  selectedCollections: string[];
  onSubjectToggle: (subject: string) => void;
  onCollectionToggle: (collection: string) => void;
  onClearFilters: () => void;
}

function FacetGroup({ title, options, selected, onToggle }: { title: string; options: FacetOption[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <Box component="fieldset" sx={{ border: 0, p: 0, m: 0, mb: 3 }}>
      <Typography component="legend" variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <FormGroup>
        {options.map(({ value, count }) => (
          <FormControlLabel
            key={value}
            sx={{ mr: 0, ".MuiFormControlLabel-label": { flex: 1, minWidth: 0 } }}
            control={<Checkbox checked={selected.includes(value)} onChange={() => onToggle(value)} size="small" />}
            label={
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                <Typography variant="body2" noWrap title={value}>{value}</Typography>
                <Chip label={count} size="small" variant="outlined" sx={{ height: 20, fontSize: "0.7rem" }} />
              </Box>
            }
          />
        ))}
      </FormGroup>
    </Box>
  );
}

export default function FilterSidebar({ subjects, collections, selectedSubjects, selectedCollections, onSubjectToggle, onCollectionToggle, onClearFilters }: FilterSidebarProps) {
  const active = selectedSubjects.length + selectedCollections.length;
  return (
    <Box component="aside" aria-label="Filters">
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Typography variant="h6">Filters</Typography>
        {active > 0 && (
          <Button size="small" onClick={onClearFilters}>
            Clear ({active})
          </Button>
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />
      <FacetGroup title="Collection" options={collections} selected={selectedCollections} onToggle={onCollectionToggle} />
      <FacetGroup title="Subject" options={subjects} selected={selectedSubjects} onToggle={onSubjectToggle} />
    </Box>
  );
}
