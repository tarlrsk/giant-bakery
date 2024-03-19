"use client";

import useAdmin from "@/hooks/useAdmin";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState, useCallback } from "react";
import { RHFUpload } from "@/components/hook-form/rhf-upload";
import FormProvider from "@/components/hook-form/form-provider";
import { Paper, Stack, Button, IconButton, Typography } from "@mui/material";
import {
  RHFSwitch,
  RHFTextField,
  RHFAutocomplete,
} from "@/components/hook-form";

import { createUpdateSnackBoxSchema } from "../types";

// ----------------------------------------------------------------------

type Props = {
  options: IProductOption[];
  onClose: () => void;
};

interface IProductOption {
  value: string | null;
  label: string;
}

// ----------------------------------------------------------------------

export default function NewSnackBoxCard({ options, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { createSnackBoxTrigger, createSnackBoxIsLoading } =
    useAdmin().useSnackBoxAdmin();
  const [itemAmount, setItemAmount] = useState([0]);
  const [counter, setCounter] = useState(0);
  const methods = useForm({
    resolver: zodResolver(createUpdateSnackBoxSchema),
    defaultValues: {
      image: null,
      isActive: true,
      name: "",
      description: "",
      price: null,
      width: null,
      length: null,
      height: null,
      weight: null,
    },
  });

  const { watch, setValue, handleSubmit, reset } = methods;
  const values = watch();

  const { isActive } = values;

  const handleDeleteRow = (indexToDelete: number) => {
    const deletedIndex = itemAmount.findIndex((num) => num === indexToDelete);
    const firstHalf = itemAmount.slice(0, deletedIndex);
    const secondHalf = itemAmount.slice(deletedIndex + 1, itemAmount.length);
    const combined = firstHalf.concat(secondHalf);
    setValue(`item${indexToDelete}` as any, undefined);
    setItemAmount(combined);
  };

  const memoizedItems = useMemo(() => {
    return Object.entries(values)
      .filter(([key, value]) => key.startsWith("item") && value !== undefined)
      .map(([_, item]) => item as unknown as IProductOption);
  }, [values]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const {
        name,
        image,
        price,
        weight,
        description,
        height,
        length,
        width,
        isActive,
      } = data;

      const bodyFormData = new FormData();
      bodyFormData.append("name", name);
      if (image) {
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

      for (const { value } of memoizedItems) {
        if (value !== null) {
          bodyFormData.append("refreshmentIds", value);
        }
      }

      // console.log("bodyFormData:", bodyFormData);
      await createSnackBoxTrigger(bodyFormData);
      enqueueSnackbar("สร้างชุดเบรกสำเร็จ", { variant: "success" });
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
      <Paper
        variant="outlined"
        sx={{ boxShadow: 0, p: 3, maxHeight: 730, overflow: "auto" }}
      >
        <Stack direction="column" spacing={2.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1" fontWeight={500}>
              ชุดเบรกใหม่
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

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>การมองเห็น:</Typography>
            <RHFSwitch name="isActive" label={isActive ? "แสดง" : "ซ่อน"} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <RHFTextField
              name="name"
              label="ชื่อชุดเบรก"
              size="small"
              required
            />
            <RHFTextField
              type="number"
              name="price"
              label="ราคา (บาท)"
              sx={{ width: "50%" }}
              size="small"
              required
            />
          </Stack>

          <RHFTextField name="description" label="รายละเอียดชุดเบรก" />

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

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>สินค้าในชุดเบรก</Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                setItemAmount((prev) => [...prev, counter + 1]);
                setCounter((prev) => prev + 1);
              }}
            >
              เพิ่มสินค้า
            </Button>
          </Stack>

          {itemAmount.map((el: number, index) => (
            <Stack
              key={el}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ width: 1 }}
            >
              <RHFAutocomplete
                fullWidth
                size="small"
                label={`สินค้า ${index + 1}`}
                options={options}
                name={`item${el}`}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
              />
              <IconButton
                color="primary"
                sx={{ width: 0.1 }}
                onClick={() => {
                  handleDeleteRow(el);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}

          <LoadingButton
            type="submit"
            size="large"
            color="secondary"
            variant="contained"
            disabled={memoizedItems.length === 0}
            loading={createSnackBoxIsLoading}
          >
            เพิ่มชุดเบรก
          </LoadingButton>
        </Stack>
      </Paper>
    </FormProvider>
  );
}
