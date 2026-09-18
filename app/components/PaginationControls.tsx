import { Box, Pagination, Typography } from "@mui/material";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({ currentPage, totalPages, totalItems, pageSize, onPageChange }: PaginationControlsProps) {
  if (totalItems === 0) return null;
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2, mt: 3 }}>
      <Typography variant="body2" color="text.secondary">
        Showing {from}–{to} of {totalItems}
      </Typography>
      <Pagination
        page={currentPage}
        count={totalPages}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
      />
    </Box>
  );
}
