"use client";

import { useCallback } from "react";
import useAdmin from "@/hooks/useAdmin";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { RHFUpload } from "@/components/hook-form/rhf-upload";
import FormProvider from "@/components/hook-form/form-provider";
import { RHFSwitch, RHFTextField } from "@/components/hook-form";
import { Paper, Stack, IconButton, Typography } from "@mui/material";

import { ICakeRow } from "../types";

// ----------------------------------------------------------------------

type Props = {
  onClose: () => void;
};

export default function NewCakeCard({ onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm<ICakeRow>({
    defaultValues: {
      image: "",
      isActive: true,
      name: "",
      type: "preset",
      creams: [],
      topEdges: [],
      bottomEdges: [],
      decorations: [],
      surfaces: [],
    },
  });

  const { createCakeTrigger, createCakeIsLoading } = useAdmin();

  const { watch, setValue, handleSubmit, reset } = methods;
  const values = watch();

  const { isActive } = values;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const {
        name,
        image,
        price,
        description,
        weight,
        height,
        length,
        width,
        isActive,
      } = data;

      const bodyFormData = new FormData();
      bodyFormData.append("name", name);
      bodyFormData.append("image", image);
      bodyFormData.append("description", description || "");
      bodyFormData.append("price", price ? Number(price).toString() : "0");
      bodyFormData.append("weight", weight ? Number(weight).toString() : "0");
      bodyFormData.append("height", height ? Number(height).toString() : "0");
      bodyFormData.append("length", length ? Number(length).toString() : "0");
      bodyFormData.append("width", width ? Number(width).toString() : "0");
      bodyFormData.append("isActive", isActive ? "true" : "false");
      bodyFormData.append("type", "PRESET");

      await createCakeTrigger(bodyFormData);
      enqueueSnackbar("สร้างเค้กสำเร็จ", { variant: "success" });
      onClose();
      reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("เกิดข้อผิดพลาด กรุณาลองใหม่", { variant: "error" });
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
              เค้กใหม่
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
            <RHFTextField name="name" label="ชื่อเค้ก" size="small" required />
            <RHFTextField
              type="number"
              name="price"
              label="ราคา (บาท)"
              sx={{ width: "50%" }}
              size="small"
              required
            />
          </Stack>

          <RHFTextField name="description" label="รายละเอียดสินค้า" />

          <Typography>ขนาด</Typography>
          <Stack direction="row" spacing={1}>
            <RHFTextField
              type="number"
              name="width"
              label="กว้าง (ซม.)"
              size="small"
              required
            />
            <RHFTextField
              type="number"
              name="length"
              label="ยาว (ซม.)"
              size="small"
              required
            />
            <RHFTextField
              type="number"
              name="height"
              label="สูง (ซม.)"
              size="small"
              required
            />
          </Stack>
          <RHFTextField
            type="number"
            name="weight"
            label="น้ำหนัก (กรัม)"
            size="small"
            required
          />

          <LoadingButton
            type="submit"
            size="large"
            color="secondary"
            variant="contained"
            loading={createCakeIsLoading}
          >
            เพิ่มเค้กใหม่
          </LoadingButton>
        </Stack>
      </Paper>
    </FormProvider>
  );
}
