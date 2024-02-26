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

import DeleteDialog from "../dialog/DeleteDialog";
import { ISnackBoxRow, createUpdateSnackBoxSchema } from "../types";

// ----------------------------------------------------------------------

interface IProductOption {
  value: string | null;
  label: string;
}

type Props = {
  data: ISnackBoxRow;
  option: IProductOption[];
  selectedItems: { [key: string]: { value: string; label: string } };
  onClose: () => void;
};

// ----------------------------------------------------------------------

export default function EditSnackBoxCard({
  data,
  option,
  selectedItems,
  onClose,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    updateSnackBoxTrigger,
    updateSnackBoxIsLoading,
    snackBoxMutate,
    deleteSnackBoxTrigger,
    deleteSnackBoxIsLoading,
  } = useAdmin(data);
  const initDataArray = Array.from(
    { length: data.refreshments.length },
    (_, index) => index,
  );

  const [itemAmount, setItemAmount] = useState(initDataArray);
  const [counter, setCounter] = useState(data.refreshments.length);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const methods = useForm({
    resolver: zodResolver(createUpdateSnackBoxSchema),
    defaultValues: { ...data, ...selectedItems },
  });

  const { watch, setValue, handleSubmit } = methods;
  const values = watch();

  const { name, isActive } = values;

  const memoizedItems = useMemo(() => {
    return Object.entries(values)
      .filter(([key, value]) => key.startsWith("item") && value !== undefined)
      .map(([_, item]) => item as unknown as IProductOption);
  }, [values]);

  const handleDeleteRow = (indexToDelete: number) => {
    const deletedIndex = itemAmount.findIndex((num) => num === indexToDelete);
    const firstHalf = itemAmount.slice(0, deletedIndex);
    const secondHalf = itemAmount.slice(deletedIndex + 1, itemAmount.length);
    const combined = firstHalf.concat(secondHalf);
    setValue(`item${indexToDelete}` as any, undefined);
    setItemAmount(combined);
  };

  const onDeleteSnackBox = async () => {
    try {
      await deleteSnackBoxTrigger();
      onClose();
      snackBoxMutate();
      enqueueSnackbar(`ชุดเบรก ${data.name} ถูกลบแล้ว`, { variant: "success" });
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
        weight,
        height,
        length,
        width,
        isActive,
        description,
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

      for (const { value } of memoizedItems) {
        if (value !== null) {
          bodyFormData.append("refreshmentIds", value);
        }
      }

      // console.log("bodyFormData:", bodyFormData);
      await updateSnackBoxTrigger(bodyFormData);
      enqueueSnackbar("อัพเดทชุดเบรกสำเร็จ", { variant: "success" });
      snackBoxMutate();
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
              <Typography>{name}</Typography>
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
              ลบชุดเบรก
            </Button>
          </Stack>

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
                options={option}
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
            loading={updateSnackBoxIsLoading}
          >
            อัพเดทชุดเบรก
          </LoadingButton>
        </Stack>
      </Paper>
      <DeleteDialog
        name={data.name}
        open={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
        isLoading={deleteSnackBoxIsLoading}
        onDelete={onDeleteSnackBox}
      />
    </FormProvider>
  );
}
