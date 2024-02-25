"use client";
import toast from "react-hot-toast";
import useAdmin from "@/hooks/useAdmin";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { Upload } from "@/components/upload";
import { IVariant } from "@/components/admin/types";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { RHFUpload } from "@/components/hook-form/rhf-upload";
import FormProvider from "@/components/hook-form/form-provider";
import React, { useState, useEffect, useCallback } from "react";
import VariantDataGrid from "@/components/admin/data-grid/VariantDataGird";
import { RHFSelect, RHFSwitch, RHFTextField } from "@/components/hook-form";
import VariantFilterToolbar from "@/components/admin/toolbars/VariantFilterToolbar";
import {
  Box,
  Stack,
  Drawer,
  MenuItem,
  Backdrop,
  Typography,
  CircularProgress,
} from "@mui/material";

// ----------------------------------------------------------------------

const VARIANT_TYPE = [
  { value: "TOP_EDGE", label: "ขอบบน" },
  { value: "BOTTOM_EDGE", label: "ขอบล่าง" },
  { value: "DECORATION", label: "ลายรอบเค้ก" },
  { value: "SURFACE", label: "หน้าเค้ก" },
];

// ----------------------------------------------------------------------

export default function AdminVariant() {
  const [filteredRows, setFilteredRows] = useState([]);
  const [openNewDrawer, setOpenNewDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const {
    variantsData: variants,
    creamBaseData,
    variantsIsLoading: isLoading,
    updateVariantTrigger,
    updateVariantIsLoading,
    createVariantTrigger,
    createVariantIsLoading,
  } = useAdmin(
    filteredRows?.find((row: IVariant) => row.id === rowSelectionModel[0]),
  );

  const creamBaseImage = creamBaseData?.data?.image || "";

  const filterMethods = useForm({
    defaultValues: { search: "", variantType: "all", status: "all" },
  });

  const newVariantMethods = useForm<IVariant>({
    defaultValues: {
      name: "",
      image: "",
      isActive: true,
    },
  });

  const editVariantMethods = useForm<IVariant>({
    defaultValues: {
      id: "",
      name: "",
      imageFileName: "",
      imagePath: "",
      image: "",
      isActive: true,
      createdAt: "",
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
    },
  });

  const toggleNewDrawer = (newOpen: boolean) => () => {
    setOpenNewDrawer(newOpen);
  };
  const toggleEditDrawer = (editOpen: boolean) => () => {
    setOpenEditDrawer(editOpen);
    setRowSelectionModel([]);
  };

  const { search, status, variantType } = filterMethods.watch();

  const {
    setValue: setValueNewVariant,
    watch: watchNewVariant,
    handleSubmit: handleSubmitNew,
  } = newVariantMethods;

  const {
    setValue: setValueEditVariant,
    watch: watchEditVariant,
    reset: resetEditVariant,
    handleSubmit: handleSubmitEdit,
  } = editVariantMethods;

  const { isActive: isActiveNewVariant, image: newVariantImage } =
    watchNewVariant();

  const {
    name: editVariantName,
    isActive: isActiveEditVariant,
    image: editVariantImage,
  } = watchEditVariant();

  const onDropSingleFileNewVariant = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setValueNewVariant("image", newFile as any, {
          shouldValidate: true,
        });
      }
    },
    [setValueNewVariant],
  );

  const onDropSingleFileEditVariant = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setValueEditVariant("image", newFile as any, {
          shouldValidate: true,
        });
      }
    },
    [setValueEditVariant],
  );

  const onSubmitNew = handleSubmitNew(async (data) => {
    try {
      const { image, name, isActive, type } = data;
      const bodyFormData = new FormData();
      bodyFormData.append("name", name);
      bodyFormData.append("image", image);
      bodyFormData.append("isActive", isActive ? "true" : "false");
      bodyFormData.append("type", type);
      await createVariantTrigger(bodyFormData);
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  });

  const onSubmitEdit = handleSubmitEdit(async (data) => {
    try {
      const { image, name, isActive, type } = data;
      const bodyFormData = new FormData();
      bodyFormData.append("name", name);
      bodyFormData.append("image", image);
      bodyFormData.append("isActive", isActive ? "true" : "false");
      bodyFormData.append("type", type);

      console.log("data", data);
      await updateVariantTrigger(bodyFormData);
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  });

  const DrawerAddVariant = (
    <Box
      sx={{ minWidth: 420, p: 4 }}
      role="presentation"
      onClick={() => toggleNewDrawer(false)}
    >
      <FormProvider methods={newVariantMethods} onSubmit={onSubmitNew}>
        <Stack direction="column" spacing={2.5}>
          <Typography>ตัวเลือกเค้กใหม่</Typography>
          <RHFUpload
            name="image"
            thumbnail
            onDrop={onDropSingleFileNewVariant}
            onDelete={() =>
              setValueNewVariant("image", "", {
                shouldValidate: true,
              })
            }
          />
          <Typography>พรีวิว</Typography>
          <Upload
            file={creamBaseImage}
            layerFile={
              typeof newVariantImage === "string"
                ? newVariantImage
                : newVariantImage?.preview
            }
            disabled
          />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>การมองเห็น:</Typography>
            <RHFSwitch
              name="isActive"
              label={isActiveNewVariant ? "แสดง" : "ซ่อน"}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <RHFTextField name="name" label="ชื่อตัวเลือกเค้ก" />
            <RHFSelect name="type" label="ประเภทตัวเลือกเค้ก">
              {VARIANT_TYPE.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
          <LoadingButton
            size="large"
            variant="contained"
            type="submit"
            loading={createVariantIsLoading}
          >
            เพิ่มตัวเลือกเค้กใหม่
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Box>
  );

  const DrawerEditVariant = (
    <Box
      sx={{ minWidth: 420, p: 4 }}
      role="presentation"
      onClick={() => toggleEditDrawer(false)}
    >
      <FormProvider methods={editVariantMethods} onSubmit={onSubmitEdit}>
        <Stack direction="column" spacing={2.5}>
          <Typography>{editVariantName}</Typography>
          <RHFUpload
            name="image"
            thumbnail
            onDrop={onDropSingleFileEditVariant}
            onDelete={() =>
              setValueEditVariant("image", "", {
                shouldValidate: true,
              })
            }
          />
          <Typography>พรีวิว</Typography>
          <Upload
            file={creamBaseImage}
            layerFile={
              typeof editVariantImage === "string"
                ? editVariantImage
                : editVariantImage?.preview
            }
            disabled
          />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>การมองเห็น:</Typography>
            <RHFSwitch
              name="isActive"
              label={isActiveEditVariant ? "แสดง" : "ซ่อน"}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <RHFTextField name="name" label="ชื่อตัวเลือกเค้ก" />
            <RHFSelect name="type" label="ประเภทตัวเลือกเค้ก">
              {VARIANT_TYPE.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
          <LoadingButton
            size="large"
            variant="contained"
            type="submit"
            loading={updateVariantIsLoading}
          >
            อัพเดทตัวเลือกเค้ก
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Box>
  );

  useEffect(() => {
    let data =
      variants?.data.filter((row: IVariant) => row.type !== "CREAM") || [];

    if (search) {
      data = data.filter(
        (row: IVariant) =>
          row.name.toLowerCase().indexOf(search?.toLowerCase()) > -1,
      );
    }

    if (variantType !== "all") {
      data = data.filter((row: IVariant) => row.type === variantType);
    }

    if (status !== "all") {
      if (status === "active") {
        data = data.filter((row: { isActive: any }) => row.isActive);
      } else {
        data = data.filter((row: { isActive: any }) => !row.isActive);
      }
    }
    setFilteredRows(data);
  }, [search, variantType, status, variants?.data]);

  useEffect(() => {
    if (rowSelectionModel.length) {
      const selectedRowData = variants?.data?.find(
        (row: IVariant) => row.id === rowSelectionModel[0],
      );
      resetEditVariant(selectedRowData);
      setOpenEditDrawer(true);
    }
  }, [resetEditVariant, rowSelectionModel, variants?.data]);

  useEffect(() => {
    setFilteredRows(
      variants?.data?.filter((row: IVariant) => row.type !== "CREAM") || [],
    );
  }, [variants]);

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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
    </Box>
  );
}

// ----------------------------------------------------------------------
