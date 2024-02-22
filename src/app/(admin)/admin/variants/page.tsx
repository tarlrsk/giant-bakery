"use client";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { IVariantRow } from "@/components/admin/types";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { RHFUpload } from "@/components/hook-form/rhf-upload";
import React, { useState, useEffect, useCallback } from "react";
import FormProvider from "@/components/hook-form/form-provider";
import VariantDataGrid from "@/components/admin/data-grid/VariantDataGird";
import { RHFSelect, RHFSwitch, RHFTextField } from "@/components/hook-form";
import VariantFilterToolbar from "@/components/admin/toolbars/VariantFilterToolbar";
import {
  Box,
  Stack,
  Drawer,
  Button,
  MenuItem,
  Skeleton,
  Typography,
} from "@mui/material";

// ----------------------------------------------------------------------

const VARIANT_TYPE = [
  { value: "cream", label: "ครีม" },
  { value: "topBorder", label: "ขอบบน" },
  { value: "bottomBorder", label: "ขอบล่าง" },
  { value: "decoration", label: "ลายรอบเค้ก" },
  { value: "surface", label: "หน้าเค้ก" },
];

const rows = [
  {
    id: 1,
    variantType: "cream",
    variantName: "ปาดเรียบ",
    isActive: true,
    lastUpdated: "30/08/2023 ",
  },
  {
    id: 2,
    variantType: "cream",
    variantName: "ปาดไม่เรียบ",
    isActive: true,
    lastUpdated: "30/08/2023 ",
  },
  {
    id: 3,
    variantType: "topBorder",
    variantName: "ลายย้อย",
    isActive: false,
    lastUpdated: "30/08/2023 ",
  },
];

// ----------------------------------------------------------------------

export default function AdminVariant() {
  const filterMethods = useForm({
    defaultValues: { search: "", variantType: "all", status: "all" },
  });

  const newVariantMethods = useForm({
    defaultValues: {
      variantUpload: null,
      isActive: true,
      variantName: "",
    },
  });

  const editVariantMethods = useForm({
    defaultValues: {
      variantUpload: null,
      isActive: true,
      variantName: "",
    },
  });

  const [openNewDrawer, setOpenNewDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);

  const [filteredRows, setFilteredRows] = useState(rows);

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const toggleNewDrawer = (newOpen: boolean) => () => {
    setOpenNewDrawer(newOpen);
  };
  const toggleEditDrawer = (editOpen: boolean) => () => {
    setOpenEditDrawer(editOpen);
    setRowSelectionModel([]);
  };

  const { watch } = filterMethods;

  const filterValues = watch();

  const { search, status, variantType } = filterValues;

  const {
    setValue: setValueNewVariant,
    watch: watchNewVariant,
    handleSubmit: handleSubmitNew,
  } = newVariantMethods;

  const { isActive: isActiveNewVariant } = watchNewVariant();

  const onSubmitNew = handleSubmitNew(async (data) => {
    try {
      console.log("data", data);
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  });

  const {
    setValue: setValueEditVariant,
    watch: watchEditVariant,
    handleSubmit: handleSubmitEdit,
  } = editVariantMethods;

  const { isActive: isActiveEditVariant } = watchEditVariant();

  const onDropSingleFile = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setValueNewVariant("variantUpload", newFile as any, {
          shouldValidate: true,
        });
      }
    },
    [setValueNewVariant],
  );

  const DrawerAddVariant = (
    <Box
      sx={{ minWidth: 420, p: 4 }}
      role="presentation"
      onClick={() => toggleNewDrawer(false)}
    >
      <FormProvider methods={newVariantMethods}>
        <Stack direction="column" spacing={2.5}>
          <Typography>ตัวเลือกเค้กใหม่</Typography>
          <RHFUpload
            name="variantUpload"
            thumbnail
            onDrop={onDropSingleFile}
            onDelete={() =>
              setValueNewVariant("variantUpload", null, {
                shouldValidate: true,
              })
            }
          />
          <Typography>พรีวิว</Typography>
          <RHFUpload name="preview" thumbnail disabled />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>การมองเห็น:</Typography>
            <RHFSwitch
              name="isActive"
              label={isActiveNewVariant ? "โชว์" : "ซ่อน"}
            />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <RHFTextField name="variantName" label="ชื่อตัวเลือกเค้ก" />
            <RHFSelect name="variantType" label="ประเภทตัวเลือกเค้ก">
              {VARIANT_TYPE.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
          <Button size="large" variant="contained">
            เพิ่มตัวเลือกเค้กใหม่
          </Button>
        </Stack>
      </FormProvider>
    </Box>
  );

  const isLoading = true;

  const DrawerEditVariant = (
    <Box
      sx={{ minWidth: 420, p: 4 }}
      role="presentation"
      onClick={() => toggleNewDrawer(false)}
    >
      {isLoading ? (
        <Stack spacing={2}>
          <Typography>แก้ไขตัวเลือกเค้ก</Typography>

          <Skeleton variant="rounded" width="100%" height={120} />
          <Skeleton variant="rounded" width="100%" height={120} />

          <Skeleton variant="text" sx={{ fontSize: "4rem" }} />
        </Stack>
      ) : (
        <FormProvider methods={editVariantMethods}>
          <Stack direction="column" spacing={2.5}>
            <Typography>ตัวเลือกเค้ก</Typography>
            <RHFUpload
              name="variantUpload"
              thumbnail
              onDrop={onDropSingleFile}
              onDelete={() =>
                setValueNewVariant("variantUpload", null, {
                  shouldValidate: true,
                })
              }
            />
            <Typography>พรีวิว</Typography>
            <RHFUpload name="preview" thumbnail disabled />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>การมองเห็น:</Typography>
              <RHFSwitch
                name="isActive"
                label={isActiveEditVariant ? "โชว์" : "ซ่อน"}
              />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <RHFTextField name="variantName" label="ชื่อตัวเลือกเค้ก" />
              <RHFSelect name="variantType" label="ประเภทตัวเลือกเค้ก">
                {VARIANT_TYPE.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>
            <Button size="large" variant="contained">
              เพิ่มตัวเลือกเค้กใหม่
            </Button>
          </Stack>
        </FormProvider>
      )}
    </Box>
  );

  useEffect(() => {
    let data = rows;

    if (search) {
      data = data.filter(
        (row: IVariantRow) =>
          row.variantName.toLowerCase().indexOf(search?.toLowerCase()) > -1,
      );
    }

    if (variantType !== "all") {
      console.log("variantType", variantType);
      data = data.filter((row: IVariantRow) => row.variantType === variantType);
    }

    if (status !== "all") {
      if (status === "active") {
        data = data.filter((row: IVariantRow) => row.isActive);
      } else {
        data = data.filter((row: IVariantRow) => !row.isActive);
      }
    }
    setFilteredRows(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, variantType, status]);

  useEffect(() => {
    if (rowSelectionModel.length) {
      setOpenEditDrawer(true);
    }
  }, [rowSelectionModel]);

  return (
    <Box>
      <VariantFilterToolbar
        label="ตัวเลือกเค้ก"
        methods={filterMethods}
        onClickNewVariant={() => {
          setRowSelectionModel([]);
          setOpenNewDrawer(true);
        }}
      />

      <VariantDataGrid
        rows={filteredRows}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
      />

      <Drawer
        anchor="right"
        open={openNewDrawer}
        onClose={toggleNewDrawer(false)}
      >
        {DrawerAddVariant}
      </Drawer>

      <Drawer
        anchor="right"
        open={openEditDrawer}
        onClose={toggleEditDrawer(false)}
      >
        {DrawerEditVariant}
      </Drawer>
    </Box>
  );
}

// ----------------------------------------------------------------------
