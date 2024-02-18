"use client";

import toast from "react-hot-toast";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { RHFUpload } from "@/components/hook-form/rhf-upload";
import FormProvider from "@/components/hook-form/form-provider";
import { RHFSelect, RHFTextField } from "@/components/hook-form";
import {
  Paper,
  Stack,
  Button,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";

// ----------------------------------------------------------------------

const CATEGORY_OPTIONS = [
  { value: "bakery", label: "Bakery" },
  { value: "beverage", label: "Beverage" },
];

const SUB_CATEGORY_OPTIONS = [
  { value: "bread", label: "ขนมปัง" },
  { value: "pie", label: "พาย" },
  { value: "cookie", label: "คุกกี้" },
  { value: "snack", label: "ขนม" },
  { value: "cake", label: "เค้ก" },
];

// ----------------------------------------------------------------------

type Props = {
  onClose: () => void;
};

export default function NewProductCard({ onClose }: Props) {
  const methods = useForm({
    defaultValues: {
      productUpload: null,
      productName: "",
      description: "",
      category: "",
      subCategory: "",
      unitType: "",
      minQty: null,
      price: null,
      currentQty: null,
      width: null,
      length: null,
      height: null,
    },
  });

  const { watch, setValue, handleSubmit } = methods;
  const values = watch();

  const { category } = values;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("data", data);
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  });

  const onDropSingleFile = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setValue("productUpload", newFile as any, { shouldValidate: true });
      }
    },
    [setValue],
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Paper variant="outlined" sx={{ boxShadow: 0, p: 3 }}>
        <Stack direction="column" spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1" fontWeight={500}>
              สินค้าใหม่
            </Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <RHFUpload
            name="productUpload"
            thumbnail
            onDrop={onDropSingleFile}
            onDelete={() =>
              setValue("productUpload", null, { shouldValidate: true })
            }
          />
          <Stack direction="row" spacing={1}>
            <RHFTextField name="productName" label="ชื่อสินค้า" />
            <RHFTextField
              type="number"
              name="price"
              label="ราคา"
              sx={{ width: "50%" }}
            />
          </Stack>

          <RHFTextField name="description" label="รายละเอียดสินค้า" />

          <Stack direction="row" spacing={1}>
            <RHFSelect name="category" label="หมวดหมู่">
              {CATEGORY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>

            {category === "bakery" && (
              <RHFSelect name="subCategory" label="หมวดหมู่ย่อย">
                {SUB_CATEGORY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}
          </Stack>

          <Stack direction="row" spacing={1}>
            <RHFTextField
              type="number"
              name="minQty"
              label="จำนวนสินค้าขั้นต่ำ"
            />
            <RHFTextField
              type="number"
              name="currentQty"
              label="จำนวนสินค้าปัจจุบัน"
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <RHFTextField type="number" name="width" label="กว้าง (ซม.)" />
            <RHFTextField type="number" name="length" label="ยาว (ซม.)" />
            <RHFTextField type="number" name="height" label="สูง (ซม.)" />
          </Stack>

          <Button
            type="submit"
            size="large"
            color="secondary"
            variant="contained"
          >
            เพิ่มสินค้า
          </Button>
        </Stack>
      </Paper>
    </FormProvider>
  );
}
