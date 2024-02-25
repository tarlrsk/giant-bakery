"use client";

import toast from "react-hot-toast";
import useAdmin from "@/hooks/useAdmin";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { RHFUpload } from "@/components/hook-form/rhf-upload";
import FormProvider from "@/components/hook-form/form-provider";
import { Paper, Stack, Button, IconButton, Typography } from "@mui/material";
import {
  RHFSwitch,
  RHFTextField,
  RHFAutocomplete,
} from "@/components/hook-form";

// ----------------------------------------------------------------------

type Props = {
  options: IProductOption[];
  onClose: () => void;
};

interface IProductOption {
  value: string | null;
  label: string;
}

// interface MyObject {
//   [key: string]: MyItem | string | boolean | null;
// }
// ----------------------------------------------------------------------

export default function NewSnackBoxCard({ options, onClose }: Props) {
  const { createSnackBoxTrigger, createSnackBoxIsLoading } = useAdmin();
  const [itemAmount, setItemAmount] = useState([0]);
  const [counter, setCounter] = useState(0);
  const methods = useForm({
    defaultValues: {
      image: "",
      isActive: true,
      name: "",
      price: null,
      width: null,
      length: null,
      height: null,
      weight: null,
    },
  });

  const { watch, setValue, handleSubmit } = methods;
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { name, image, price, weight, height, length, width, isActive } =
        data;

      const mappedRefreshments = Object.entries(data)
        .filter(([key, value]) => key.startsWith("item") && value !== undefined)
        .map(([_, item]) => item as unknown as IProductOption);
      console.log("data", data);

      console.log("mappedItems", mappedRefreshments);

      const bodyFormData = new FormData();
      bodyFormData.append("name", name);
      bodyFormData.append("image", image);
      bodyFormData.append("price", price ? Number(price).toString() : "0");
      bodyFormData.append("weight", weight ? Number(weight).toString() : "0");
      bodyFormData.append("height", height ? Number(height).toString() : "0");
      bodyFormData.append("length", length ? Number(length).toString() : "0");
      bodyFormData.append("width", width ? Number(width).toString() : "0");
      bodyFormData.append("isActive", isActive ? "true" : "false");

      for (const { value } of mappedRefreshments) {
        if (value !== null) {
          bodyFormData.append("refreshmentIds", value);
        }
      }

      console.log("bodyFormData:", bodyFormData);
      await createSnackBoxTrigger(bodyFormData);
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
            onDelete={() => setValue("image", "", { shouldValidate: true })}
          />

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>การมองเห็น:</Typography>
            <RHFSwitch name="isActive" label={isActive ? "โชว์" : "ซ่อน"} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <RHFTextField name="name" label="ชื่อชุดเบรก" />
            <RHFTextField
              type="number"
              name="price"
              label="ราคา (บาท)"
              sx={{ width: "50%" }}
            />
          </Stack>

          <RHFTextField name="description" label="รายละเอียดชุดเบรก" />

          <Typography>ขนาด</Typography>
          <Stack direction="row" spacing={1}>
            <RHFTextField type="number" name="width" label="กว้าง (ซม.)" />
            <RHFTextField type="number" name="length" label="ยาว (ซม.)" />
            <RHFTextField type="number" name="height" label="สูง (ซม.)" />
          </Stack>
          <RHFTextField type="number" name="weight" label="น้ำหนัก (กรัม)" />

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
            loading={createSnackBoxIsLoading}
          >
            เพิ่มชุดเบรก
          </LoadingButton>
        </Stack>
      </Paper>
    </FormProvider>
  );
}
