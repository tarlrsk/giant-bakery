"use client";

import toast from "react-hot-toast";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { RHFUpload } from "@/components/hook-form/rhf-upload";
import FormProvider from "@/components/hook-form/form-provider";
import { Paper, Stack, Button, IconButton, Typography } from "@mui/material";
import {
  RHFSwitch,
  RHFTextField,
  RHFMultiCheckbox,
  RHFRadioGroupMUI,
} from "@/components/hook-form";

// ----------------------------------------------------------------------

const CAKE_TYPE_OPTIONS = [
  { value: "preset", label: "สำเร็จรูป" },
  { value: "custom", label: "กำหนดเอง" },
];

const CREAM_OPTIONS = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
];

// ----------------------------------------------------------------------

type Props = {
  data: {
    cakeUpload:
      | {
          path: string;
          preview: string;
        }
      | string
      | null;
    isActive: boolean;
    cakeName: string;
    description: string;
    cakeType: string;
    price: number;
    width: number;
    length: number;
    height: number;
    weight: number;
    cream: string[];
    topEdge: string[];
    bottomEdge: string[];
    decoration: string[];
    surface: string[];
  };
  isLoading: boolean;
  onClose: () => void;
};

export default function EditCakeCard({ data, isLoading, onClose }: Props) {
  const methods = useForm({
    defaultValues: data,
  });

  const { watch, setValue, handleSubmit } = methods;
  const values = watch();

  const { cakeName, cakeType, isActive } = values;

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
        setValue("cakeUpload", newFile as any, { shouldValidate: true });
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
              {cakeName}
            </Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <RHFUpload
            name="cakeUpload"
            thumbnail
            onDrop={onDropSingleFile}
            onDelete={() =>
              setValue("cakeUpload", null, { shouldValidate: true })
            }
          />

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>การมองเห็น:</Typography>
            <RHFSwitch name="isActive" label={isActive ? "โชว์" : "ซ่อน"} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <RHFTextField name="cakeName" label="ชื่อเค้ก" />
            <RHFTextField
              type="number"
              name="price"
              label="ราคา"
              sx={{ width: "50%" }}
            />
          </Stack>

          <RHFTextField name="description" label="รายละเอียดสินค้า" />

          <Typography>ขนาด (ซม.)</Typography>
          <Stack direction="row" spacing={1}>
            <RHFTextField type="number" name="width" label="กว้าง" />
            <RHFTextField type="number" name="length" label="ยาว" />
            <RHFTextField type="number" name="height" label="สูง" />
          </Stack>
          <RHFTextField type="number" name="weight" label="น้ำหนัก (กรัม)" />

          <Stack direction="row" spacing={1}>
            <RHFRadioGroupMUI
              row
              name="cakeType"
              label="ชนิดเค้ก"
              options={CAKE_TYPE_OPTIONS}
            />
          </Stack>

          {cakeType === "custom" && (
            <Stack direction="column" spacing={1}>
              <RHFMultiCheckbox
                row
                name="cream"
                options={CREAM_OPTIONS}
                label="ครีม"
              />
              <RHFMultiCheckbox
                row
                name="topEdge"
                options={CREAM_OPTIONS}
                label="ขอบบน"
              />
              <RHFMultiCheckbox
                row
                name="bottomEdge"
                options={CREAM_OPTIONS}
                label="ขอบล่าง"
              />
              <RHFMultiCheckbox
                row
                name="decoration"
                options={CREAM_OPTIONS}
                label="ตกแต่ง"
              />
              <RHFMultiCheckbox
                row
                name="surface"
                options={CREAM_OPTIONS}
                label="หน้าเค้ก"
              />
            </Stack>
          )}

          <Button
            type="submit"
            size="large"
            color="secondary"
            variant="contained"
          >
            เพิ่มเค้ก
          </Button>
        </Stack>
      </Paper>
    </FormProvider>
  );
}
