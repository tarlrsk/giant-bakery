"use client";

import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { RHFUpload } from "@/components/hook-form/rhf-upload";
import FormProvider from "@/components/hook-form/form-provider";
import {
  RHFSwitch,
  RHFTextField,
  RHFAutocomplete,
} from "@/components/hook-form";
import {
  Paper,
  Stack,
  Button,
  Skeleton,
  IconButton,
  Typography,
} from "@mui/material";

import { ISnackBoxRow } from "../types";

// ----------------------------------------------------------------------

const ITEM_OPTIONS = [
  { value: "item1", label: "คุกกี้ช็อก" },
  { value: "item2", label: "ไก่อบ" },
  { value: "item3", label: "ไก่อบ" },
  { value: "item4", label: "ไก่อบ" },
  { value: "item5", label: "ไก่อบ" },
  { value: "item6", label: "ไก่อบ" },
];

// ----------------------------------------------------------------------

type Props = {
  data: ISnackBoxRow;
  isLoading: boolean;
  onClose: () => void;
};

export default function NewSnackBoxCard({ data, isLoading, onClose }: Props) {
  const [itemAmount, setItemAmount] = useState([0]);
  const [counter, setCounter] = useState(0);
  const methods = useForm({ defaultValues: data });

  const { watch, setValue, handleSubmit } = methods;
  const values = watch();

  const { name, isActive } = values;

  const handleDeleteRow = (indexToDelete: number) => {
    const deletedIndex = itemAmount.findIndex((num) => num === indexToDelete);
    const firstHalf = itemAmount.slice(0, deletedIndex);
    const secondHalf = itemAmount.slice(deletedIndex + 1, itemAmount.length);
    const combined = firstHalf.concat(secondHalf);
    setItemAmount(combined);
  };

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
        setValue("image", newFile as any, { shouldValidate: true });
      }
    },
    [setValue],
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Paper
        variant="outlined"
        sx={{ boxShadow: 0, p: 3, maxHeight: "76vh", overflow: "auto" }}
      >
        <Stack direction="column" spacing={2.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1" fontWeight={500}>
              {isLoading ? (
                <Skeleton
                  variant="text"
                  sx={{ minWidth: 160, fontSize: "1rem" }}
                />
              ) : (
                <Typography>{name}</Typography>
              )}
            </Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          {isLoading ? (
            <Skeleton animation="wave" sx={{ height: 200 }} />
          ) : (
            <RHFUpload
              name="image"
              thumbnail
              onDrop={onDropSingleFile}
              onDelete={() => setValue("image", null, { shouldValidate: true })}
            />
          )}

          {!isLoading && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>การมองเห็น:</Typography>
              <RHFSwitch name="isActive" label={isActive ? "โชว์" : "ซ่อน"} />
            </Stack>
          )}

          {isLoading ? (
            <Skeleton height={100} />
          ) : (
            <>
              <Stack direction="row" spacing={1}>
                <RHFTextField name="name" label="ชื่อชุดเบรก" />
                <RHFTextField
                  type="number"
                  name="price"
                  label="ราคา"
                  sx={{ width: "50%" }}
                />
              </Stack>

              <RHFTextField name="description" label="รายละเอียดชุดเบรก" />

              <Typography>ขนาด (ซม.)</Typography>
              <Stack direction="row" spacing={1}>
                <RHFTextField type="number" name="width" label="กว้าง" />
                <RHFTextField type="number" name="length" label="ยาว" />
                <RHFTextField type="number" name="height" label="สูง" />
              </Stack>
              <RHFTextField
                type="number"
                name="weight"
                label="น้ำหนัก (กรัม)"
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
                    options={ITEM_OPTIONS}
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
            </>
          )}

          {isLoading ? (
            <Skeleton height={100} />
          ) : (
            <Button
              type="submit"
              size="large"
              color="secondary"
              variant="contained"
            >
              อัพเดทชุดเบรก
            </Button>
          )}
        </Stack>
      </Paper>
    </FormProvider>
  );
}
