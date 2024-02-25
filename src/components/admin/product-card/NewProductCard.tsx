"use client";

import toast from "react-hot-toast";
import { useCallback } from "react";
import useAdmin from "@/hooks/useAdmin";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { RHFUpload } from "@/components/hook-form/rhf-upload";
import FormProvider from "@/components/hook-form/form-provider";
import { RHFSelect, RHFSwitch, RHFTextField } from "@/components/hook-form";
import { Paper, Stack, MenuItem, IconButton, Typography } from "@mui/material";

// ----------------------------------------------------------------------

export const TYPE_OPTIONS = [
  { value: "BAKERY", label: "เบเกอรี่" },
  { value: "BEVERAGE", label: "เครื่องดื่ม" },
];

export const CATEGORY_OPTIONS = [
  { value: "BREAD", label: "ขนมปัง" },
  { value: "PIE", label: "พาย" },
  { value: "COOKIE", label: "คุกกี้" },
  { value: "SNACK", label: "ขนม" },
  { value: "CAKE", label: "เค้ก" },
];

// ----------------------------------------------------------------------

type Props = {
  onClose: () => void;
};

export default function NewProductCard({ onClose }: Props) {
  const methods = useForm({
    defaultValues: {
      image: "",
      name: "",
      description: "",
      type: "",
      category: "",
      unitType: "",
      minQty: null,
      price: null,
      currQty: null,
      width: null,
      length: null,
      height: null,
      weight: null,
      quantity: null,
      isActive: true,
      maxQty: null,
    },
  });

  const { createProductTrigger, createProductIsLoading } = useAdmin();

  const { watch, setValue, handleSubmit } = methods;
  const values = watch();

  const { type, isActive } = values;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const {
        name,
        image,
        price,
        type,
        category,
        description,
        quantity,
        minQty,
        currQty,
        weight,
        height,
        length,
        width,
        isActive,
        maxQty,
      } = data;
      const bodyFormData = new FormData();
      bodyFormData.append("name", name);
      bodyFormData.append("image", image);
      bodyFormData.append("price", price ? Number(price).toString() : "0");
      bodyFormData.append("type", type);
      if (description) {
        bodyFormData.append("description", description);
      }
      bodyFormData.append("category", category);
      bodyFormData.append(
        "quantity",
        quantity ? Number(quantity).toString() : "0",
      );
      bodyFormData.append("minQty", minQty ? Number(minQty).toString() : "0");
      bodyFormData.append(
        "currQty",
        currQty ? Number(currQty).toString() : "0",
      );
      bodyFormData.append("maxQty", maxQty ? Number(maxQty).toString() : "0");
      bodyFormData.append("weight", weight ? Number(weight).toString() : "0");
      bodyFormData.append("height", height ? Number(height).toString() : "0");
      bodyFormData.append("length", length ? Number(length).toString() : "0");
      bodyFormData.append("width", width ? Number(width).toString() : "0");
      bodyFormData.append("isActive", isActive ? "true" : "false");
      bodyFormData.append("unitType", type === "BAKERY" ? "ชิ้น" : "กล่อง");
      bodyFormData.append(
        "status",
        quantity === 0
          ? "OUT_OF_STOCK"
          : Number(quantity) <= Number(minQty)
            ? "LOW"
            : "IN_STOCK",
      );

      await createProductTrigger(bodyFormData);
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
        setValue("image", newFile as any, { shouldValidate: true });
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
            name="image"
            thumbnail
            onDrop={onDropSingleFile}
            onDelete={() => setValue("image", "", { shouldValidate: true })}
          />

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>การมองเห็น:</Typography>
            <RHFSwitch name="isActive" label={isActive ? "โชว์" : "ซ่อน"} />
          </Stack>

          <Stack direction="row" spacing={1}>
            <RHFTextField name="name" label="ชื่อสินค้า" />
            <RHFTextField
              type="number"
              name="price"
              label="ราคา (บาท)"
              sx={{ width: "50%" }}
            />
          </Stack>

          <RHFTextField name="description" label="รายละเอียดสินค้า" />

          <Stack direction="row" spacing={1}>
            <RHFSelect name="type" label="หมวดหมู่">
              {TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>

            {type === "BAKERY" && (
              <RHFSelect name="category" label="หมวดหมู่ย่อย">
                {CATEGORY_OPTIONS.map((option) => (
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
              name="quantity"
              label="จำนวนสินค้าปัจจุบัน"
            />
          </Stack>

          <Typography>ขนาด</Typography>

          <Stack direction="row" spacing={1}>
            <RHFTextField type="number" name="width" label="กว้าง (ซม.)" />
            <RHFTextField type="number" name="length" label="ยาว (ซม.)" />
            <RHFTextField type="number" name="height" label="สูง (ซม.)" />
          </Stack>
          <RHFTextField type="number" name="weight" label="น้ำหนัก (กรัม)" />

          <LoadingButton
            type="submit"
            size="large"
            color="secondary"
            variant="contained"
            loading={createProductIsLoading}
          >
            เพิ่มสินค้า
          </LoadingButton>
        </Stack>
      </Paper>
    </FormProvider>
  );
}
