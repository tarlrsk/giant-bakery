"use client";

import useAdmin from "@/hooks/useAdmin";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFUpload } from "@/components/hook-form/rhf-upload";
import FormProvider from "@/components/hook-form/form-provider";
import { RHFSwitch, RHFTextField } from "@/components/hook-form";
import { Paper, Stack, Button, IconButton, Typography } from "@mui/material";

import DeleteDialog from "../dialog/DeleteDialog";
import { ICakeRow, createUpdateCakeSchema } from "../types";

// ----------------------------------------------------------------------

type Props = {
  data: ICakeRow;
  onClose: () => void;
};

// ----------------------------------------------------------------------

export default function EditCakeCard({ data, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm<ICakeRow>({
    resolver: zodResolver(createUpdateCakeSchema),
    defaultValues: data,
  });

  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const {
    updateCakeTrigger,
    updateCakeIsLoading,
    cakesMutate,
    deleteCakeTrigger,
    deleteCakeIsLoading,
  } = useAdmin(data).useCakeAdmin();

  const { watch, setValue, handleSubmit } = methods;
  const values = watch();

  const { isActive } = values;

  const onDeleteCake = async () => {
    try {
      await deleteCakeTrigger();
      onClose();
      cakesMutate();
      enqueueSnackbar(`เค้ก ${data.name} ถูกลบแล้ว`, { variant: "success" });
    } catch (err) {
      console.error(err);
      enqueueSnackbar("เกิดข้อผิดพลาด กรุณาลองใหม่", { variant: "error" });
    }
  };

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
      if (typeof image !== "string" && image) {
        bodyFormData.append("image", image);
      }
      if (description) {
        bodyFormData.append("description", description);
      }
      bodyFormData.append("price", price ? Number(price).toString() : "0");
      bodyFormData.append("weight", weight ? Number(weight).toString() : "0");
      bodyFormData.append("height", height ? Number(height).toString() : "0");
      bodyFormData.append("length", length ? Number(length).toString() : "0");
      bodyFormData.append("width", width ? Number(width).toString() : "0");
      bodyFormData.append("isActive", isActive ? "true" : "false");
      bodyFormData.append("type", "PRESET");

      await updateCakeTrigger(bodyFormData);
      cakesMutate();
      enqueueSnackbar("อัพเดทเค้กสำเร็จ", { variant: "success" });
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
              {data.name}
            </Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <RHFUpload
            name="image"
            thumbnail
            onDrop={onDropSingleFile}
            onDelete={() => setValue("image", null, { shouldValidate: true })}
          />

          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>การมองเห็น:</Typography>
              <RHFSwitch name="isActive" label={isActive ? "แสดง" : "ซ่อน"} />
            </Stack>
            <Button
              startIcon={<DeleteIcon />}
              color="error"
              variant="outlined"
              onClick={() => setIsOpenDelete(true)}
            >
              ลบเค้ก
            </Button>
          </Stack>

          <Stack direction="row" spacing={1}>
            <RHFTextField name="name" label="ชื่อเค้ก" size="small" required />
            <RHFTextField
              type="number"
              name="price"
              label="ราคา"
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
            loading={updateCakeIsLoading}
          >
            อัพเดทเค้ก
          </LoadingButton>
        </Stack>
      </Paper>
      <DeleteDialog
        name={data.name}
        open={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
        isLoading={deleteCakeIsLoading}
        onDelete={onDeleteCake}
      />
    </FormProvider>
  );
}
