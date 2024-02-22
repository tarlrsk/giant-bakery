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
  label: string;
  methods: any;
  onClickNewVariant: () => void;
};

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "active", label: "Active" },
  { value: "inActive", label: "Inactive" },
];

const VARIANT_TYPES = [
  { value: "all", label: "ทั้งหมด" },
  { value: "cream", label: "ครีม" },
  { value: "topBorder", label: "ขอบบน" },
  { value: "bottomBorder", label: "ขอบล่าง" },
  { value: "decoration", label: "ลายรอบเค้ก" },
  { value: "surface", label: "หน้าเค้ก" },
];

// ----------------------------------------------------------------------

export default function VariantFilterToolbar({
  label,
  methods,
  onClickNewVariant,
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
          sx={{ minWidth: 900 }}
        >
          <Typography variant="h5" fontWeight={400} sx={{ minWidth: 120 }}>
            {label}
          </Typography>
          <RHFTextField
            fullWidth
            size="small"
            name="search"
            label={`ค้นหาชื่อ${label}`}
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
            name="variantType"
            label="ประเภทตัวเลือก"
            sx={{ backgroundColor: "white" }}
          >
            {VARIANT_TYPES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </RHFSelect>

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
          onClick={onClickNewVariant}
        >
          {`เพิ่ม${label}ใหม่`}
        </Button>
      </Stack>
    </FormProvider>
  );
}
