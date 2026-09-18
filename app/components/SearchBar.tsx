import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function SearchBar({ searchQuery, onSearchChange, hasActiveFilters, onClearFilters }: SearchBarProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
      <TextField
        placeholder="Search repositories, subjects, collections…"
        aria-label="Search repositories"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        fullWidth
        size="medium"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton aria-label="Clear search" size="small" onClick={() => onSearchChange("")}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: { borderRadius: 999, bgcolor: "background.paper" },
          },
        }}
      />
      {hasActiveFilters && (
        <Button onClick={onClearFilters} variant="outlined" sx={{ whiteSpace: "nowrap" }}>
          Clear all
        </Button>
      )}
    </Box>
  );
}
