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
  onClickNewSnackBox: () => void;
};

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "active", label: "แสดง" },
  { value: "inActive", label: "ซ่อน" },
];

// ----------------------------------------------------------------------

export default function SnackBoxFilterToolbar({
  label,
  methods,
  onClickNewSnackBox,
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
          <Typography variant="h5" fontWeight={400} sx={{ minWidth: 80 }}>
            {label}
          </Typography>
          <RHFTextField
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
            name="status"
            label="การมองเห็น"
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
          onClick={onClickNewSnackBox}
        >
          {`เพิ่ม${label}ใหม่`}
        </Button>
      </Stack>
    </FormProvider>
  );
}
