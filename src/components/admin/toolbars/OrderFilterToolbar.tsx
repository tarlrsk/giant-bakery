"use client";

import { RHFSelect } from "@/components/hook-form";
import SearchIcon from "@mui/icons-material/Search";
import FormProvider from "@/components/hook-form/form-provider";
import RHFTextField from "@/components/hook-form/rhf-textfield";
import { Stack, MenuItem, Typography, InputAdornment } from "@mui/material";

// ----------------------------------------------------------------------

type Props = {
  label: string;
  methods: any;
};

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "complete", label: "เสร็จสิ้น" },
  { value: "cancelled", label: "ยกเลิก" },
  { value: "pendingPayment", label: "รอชำระเงิน" },
  { value: "pendingOrder", label: "รอชำยืนยันออเดอร์" },
];

// ----------------------------------------------------------------------

export default function OrderFilterToolbar({ label, methods }: Props) {
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
          <Typography variant="h5" fontWeight={400} minWidth={90}>
            {label}
          </Typography>
          <RHFTextField
            size="small"
            name="search"
            label="ค้นหาชื่อลูกค้า"
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
            label="สถานะออเดอร์"
            sx={{ backgroundColor: "white" }}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
