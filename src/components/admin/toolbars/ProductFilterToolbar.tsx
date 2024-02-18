"use client";

import AddIcon from "@mui/icons-material/Add";
import { RHFSelect } from "@/components/hook-form";
import SearchIcon from "@mui/icons-material/Search";
import FormProvider from "@/components/hook-form/form-provider";
import RHFTextField from "@/components/hook-form/rhf-textfield";
import {
  Stack,
  Button,
  MenuItem,
  Typography,
  InputAdornment,
} from "@mui/material";

// ----------------------------------------------------------------------

type Props = {
  methods: any;
  onClickNewProduct: () => void;
};

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "inStock", label: "In Stock" },
  { value: "low", label: "Low" },
  { value: "outStock", label: "Out of Stock" },
];

// ----------------------------------------------------------------------

export default function ProductFilterToolbar({
  methods,
  onClickNewProduct,
}: Props) {
  return (
    <FormProvider methods={methods}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={4}
          sx={{ minWidth: 600 }}
        >
          <Typography variant="h5" fontWeight={400}>
            สินค้า
          </Typography>
          <RHFTextField
            size="small"
            name="search"
            label="ค้นหาชื่อสินค้า"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "white",
            }}
          />

          <RHFSelect
            size="small"
            name="status"
            label="สถานะ"
            sx={{ backgroundColor: "white" }}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={onClickNewProduct}
        >
          เพิ่มสินค้าใหม่
        </Button>
      </Stack>
    </FormProvider>
  );
}
