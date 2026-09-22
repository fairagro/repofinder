"use client";
import { useMemo, useState } from "react";
import { Box, Button, Container, Drawer, Paper, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { getAllRdis } from "rf-rdis";
import CardLegend from "./components/CardLegend";
import FilterSidebar, { type FacetOption } from "./components/FilterSidebar";
import SearchBar from "./components/SearchBar";
import PaginationControls from "./components/PaginationControls";
import RdiCard from "./components/RdiCard";
import { Rdi, extractCollections, extractFairness } from "./components/utils/rdiDataExtraction";
import { getUniqueSubjects, filterRdis } from "./components/utils/filterUtils";
import { criteriaResults } from "./components/utils/fairnessScore";

const ITEMS_PER_PAGE = 10;

const ALL_RDIS: Rdi[] = getAllRdis().filter((rdi: Rdi) => typeof rdi.id === "string" && rdi.id);

function countBy(values: string[]): FacetOption[] {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  return [...counts].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <Box>
      <Typography variant="h4" component="p" sx={{ lineHeight: 1 }}>{value}</Typography>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Box>
  );
}

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const subjects = useMemo(() => countBy(ALL_RDIS.flatMap((rdi) => getUniqueSubjects([rdi]))), []);
  const collections = useMemo(() => countBy(ALL_RDIS.flatMap((rdi) => extractCollections(rdi.raw))), []);
  const assessedCriteria = useMemo(
    () => ALL_RDIS.reduce((n, rdi) => n + criteriaResults(extractFairness(rdi.raw)).filter((c) => c.met !== null).length, 0),
    [],
  );

  const filteredRdis = useMemo(
    () => filterRdis(ALL_RDIS, [], selectedSubjects, selectedCollections, searchQuery),
    [selectedSubjects, selectedCollections, searchQuery],
  );

  const totalPages = Math.max(1, Math.ceil(filteredRdis.length / ITEMS_PER_PAGE));
  const paginatedRdis = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRdis.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRdis, currentPage]);

  // Any change to search or filters starts again from page 1.
  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (value: string) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedSubjects([]);
    setSelectedCollections([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const activeFilterCount = selectedSubjects.length + selectedCollections.length;
  const hasActiveFilters = activeFilterCount > 0 || searchQuery !== "";

  const sidebar = (
    <FilterSidebar
      subjects={subjects}
      collections={collections}
      selectedSubjects={selectedSubjects}
      selectedCollections={selectedCollections}
      onSubjectToggle={toggle(setSelectedSubjects)}
      onCollectionToggle={toggle(setSelectedCollections)}
      onClearFilters={() => {
        setSelectedSubjects([]);
        setSelectedCollections([]);
        setCurrentPage(1);
      }}
    />
  );

  return (
    <>
      {/* Hero */}
      <Box sx={{ bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 3, md: 6 }} sx={{ alignItems: { md: "flex-end" }, justifyContent: "space-between" }}>
            <Box sx={{ maxWidth: 720 }}>
              <Typography variant="h3" component="h1" sx={{ mb: 1.5 }}>
                RDI FAIRness Inventory
              </Typography>
              <Typography variant="body1" color="text.secondary">
                How FAIR are the research data infrastructures of agrosystem research? Results of structured interviews with
                repository managers, mapped to the RDA FAIR Data Maturity Model — browsable here and via the open{" "}
                <Box component="a" href="/api-docs" sx={{ color: "primary.main", fontWeight: 600 }}>JSON API</Box>.
              </Typography>
            </Box>
            <Stack direction="row" spacing={{ xs: 3, sm: 5 }} sx={{ flexShrink: 0 }}>
              <StatTile value={ALL_RDIS.length} label="repositories" />
              <StatTile value={assessedCriteria.toLocaleString("en")} label="criteria assessed" />
              <StatTile value={collections.length} label="collections" />
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 3 }}>
          <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} hasActiveFilters={hasActiveFilters} onClearFilters={clearAllFilters} />
          {isMobile && (
            <Button variant="outlined" startIcon={<TuneIcon />} onClick={() => setFiltersOpen(true)} sx={{ whiteSpace: "nowrap" }}>
              Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}
            </Button>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          {isMobile ? (
            <Drawer anchor="left" open={filtersOpen} onClose={() => setFiltersOpen(false)} slotProps={{ paper: { sx: { width: 320, p: 3 } } }}>
              {sidebar}
              <Button variant="contained" fullWidth onClick={() => setFiltersOpen(false)} sx={{ mt: 1 }}>
                Show {filteredRdis.length} result{filteredRdis.length === 1 ? "" : "s"}
              </Button>
            </Drawer>
          ) : (
            <Paper sx={{ width: 280, flexShrink: 0, p: 2.5, position: "sticky", top: 88, maxHeight: "calc(100dvh - 112px)", overflowY: "auto" }}>
              {sidebar}
            </Paper>
          )}

          <Box component="section" aria-label="Repositories" sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography variant="h6" component="h2">
                {filteredRdis.length} repositor{filteredRdis.length === 1 ? "y" : "ies"}
                {hasActiveFilters && <Typography component="span" color="text.secondary"> match your filters</Typography>}
              </Typography>
            </Box>
            <Paper sx={{ px: 2, py: 1.25, mb: 2, bgcolor: "background.paper" }}>
              <CardLegend />
            </Paper>

            {filteredRdis.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>No repositories found</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>Try a different search term or clear the filters.</Typography>
                <Button variant="outlined" onClick={clearAllFilters}>Clear all</Button>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {paginatedRdis.map((rdi: Rdi) => (
                  <RdiCard key={rdi.id} rdi={rdi} />
                ))}
              </Stack>
            )}

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredRdis.length}
              pageSize={ITEMS_PER_PAGE}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </Box>
        </Box>
      </Container>
    </>
  );
}
