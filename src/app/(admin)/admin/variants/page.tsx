"use client";
import useAdmin from "@/hooks/useAdmin";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { Upload } from "@/components/upload";
import DeleteIcon from "@mui/icons-material/Delete";
import { zodResolver } from "@hookform/resolvers/zod";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { RHFUpload } from "@/components/hook-form/rhf-upload";
import FormProvider from "@/components/hook-form/form-provider";
import DeleteDialog from "@/components/admin/dialog/DeleteDialog";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import VariantDataGrid from "@/components/admin/data-grid/VariantDataGird";
import { RHFSelect, RHFSwitch, RHFTextField } from "@/components/hook-form";
import { IVariant, createUpdateVariantSchema } from "@/components/admin/types";
import VariantFilterToolbar from "@/components/admin/toolbars/VariantFilterToolbar";
import {
  Box,
  Stack,
  Drawer,
  Button,
  MenuItem,
  Backdrop,
  Typography,
  CircularProgress,
} from "@mui/material";

// ----------------------------------------------------------------------

const VARIANT_TYPE = [
  { value: "CREAM", label: "ครีม" },
  { value: "TOP_EDGE", label: "ขอบบน" },
  { value: "BOTTOM_EDGE", label: "ขอบล่าง" },
  { value: "DECORATION", label: "ลายรอบเค้ก" },
  { value: "SURFACE", label: "หน้าเค้ก" },
];

// ----------------------------------------------------------------------

export default function AdminVariant() {
  const { enqueueSnackbar } = useSnackbar();
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState<IVariant>();
  const [openNewDrawer, setOpenNewDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const {
    variantsData: variants,
    variantsIsLoading: isLoading,
    updateVariantTrigger,
    updateVariantIsLoading,
    createVariantTrigger,
    createVariantIsLoading,
    variantsMutate,
    deleteVariantTrigger,
    deleteVariantIsLoading,
  } = useAdmin(
    filteredRows?.find((row: IVariant) => row.id === rowSelectionModel[0]),
  );

  const filterMethods = useForm({
    defaultValues: { search: "", variantType: "all", status: "all" },
  });

  const newVariantMethods = useForm<IVariant>({
    resolver: zodResolver(createUpdateVariantSchema),
    defaultValues: {
      name: "",
      image: null,
      isActive: true,
    },
  });

  const editVariantMethods = useForm<IVariant>({
    resolver: zodResolver(createUpdateVariantSchema),
    defaultValues: useMemo(() => {
      return selectedRow;
    }, [selectedRow]),
  });

  const toggleNewDrawer = (newOpen: boolean) => () => {
    setOpenNewDrawer(newOpen);
  };
  const toggleEditDrawer = (editOpen: boolean) => () => {
    setOpenEditDrawer(editOpen);
    if (!editOpen) {
      setRowSelectionModel([]);
      setSelectedRow(undefined);
    }
  };

  const { search, status, variantType } = filterMethods.watch();

  const {
    setValue: setValueNewVariant,
    watch: watchNewVariant,
    handleSubmit: handleSubmitNew,
    reset: resetNewVariant,
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

  const onDeleteVariant = async () => {
    try {
      await deleteVariantTrigger();
      variantsMutate();
      setOpenEditDrawer(false);
      setIsOpenDelete(false);
      enqueueSnackbar(`ตัวเลือกเค้ก ${selectedRow?.name || ""} ถูกลบแล้ว`, {
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar("เกิดข้อผิดพลาด กรุณาลองใหม่", { variant: "error" });
    }
  };

  const onSubmitNew = handleSubmitNew(async (data) => {
    try {
      const { image, name, isActive, type } = data;
      const bodyFormData = new FormData();
      bodyFormData.append("name", name);
      if (image) {
        bodyFormData.append("image", image);
      }
      bodyFormData.append("isActive", isActive ? "true" : "false");
      bodyFormData.append("type", type);

      await createVariantTrigger(bodyFormData);
      variantsMutate();
      enqueueSnackbar("เพิ่มตัวเลือกเค้กสำเร็จ", { variant: "success" });
      setOpenNewDrawer(false);
      resetNewVariant();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("เกิดข้อผิดพลาด กรุณาลองใหม่", { variant: "error" });
    }
  });

  const onSubmitEdit = handleSubmitEdit(async (data) => {
    try {
      const { image, name, isActive, type } = data;
      const bodyFormData = new FormData();
      bodyFormData.append("name", name);
      if (typeof image !== "string" && image) {
        bodyFormData.append("image", image);
      }
      bodyFormData.append("isActive", isActive ? "true" : "false");
      bodyFormData.append("type", type);

      await updateVariantTrigger(bodyFormData);
      variantsMutate();
      setOpenEditDrawer(false);
      enqueueSnackbar("อัพเดทตัวเลือกเค้กสำเร็จ", { variant: "success" });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("เกิดข้อผิดพลาด กรุณาลองใหม่", { variant: "error" });
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
              setValueNewVariant("image", null, {
                shouldValidate: true,
              })
            }
          />
          <Typography>พรีวิว</Typography>
          <Upload
            file="/cake-cream-base.svg"
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
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
          >
            <RHFSelect name="type" label="ประเภทตัวเลือกเค้ก" required>
              {VARIANT_TYPE.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField name="name" label="ชื่อตัวเลือกเค้ก" required />
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
              setValueEditVariant("image", null, {
                shouldValidate: true,
              })
            }
          />
          <Typography>พรีวิว</Typography>
          <Upload
            file="/cake-cream-base.svg"
            layerFile={
              typeof editVariantImage === "string"
                ? editVariantImage
                : editVariantImage?.preview
            }
            disabled
          />
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>การมองเห็น:</Typography>
              <RHFSwitch
                name="isActive"
                label={isActiveEditVariant ? "แสดง" : "ซ่อน"}
              />
            </Stack>
            <Button
              startIcon={<DeleteIcon />}
              color="error"
              variant="outlined"
              onClick={() => setIsOpenDelete(true)}
            >
              ลบสินค้า
            </Button>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <RHFTextField name="name" label="ชื่อตัวเลือกเค้ก" required />
            {/* <RHFSelect name="type" label="ประเภทตัวเลือกเค้ก" required>
              {VARIANT_TYPE.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect> */}
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
    let data = variants?.data || [];

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
    if (rowSelectionModel.length && selectedRow?.id !== rowSelectionModel[0]) {
      const selectedRowData = variants?.data?.find(
        (row: IVariant) => row.id === rowSelectionModel[0],
      );
      setSelectedRow(selectedRowData);
      setOpenEditDrawer(true);
    }
  }, [resetEditVariant, rowSelectionModel, selectedRow?.id, variants?.data]);

  useEffect(() => {
    resetEditVariant(selectedRow);
  }, [resetEditVariant, selectedRow]);

  useEffect(() => {
    setFilteredRows(variants?.data || []);
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
      {selectedRow && (
        <DeleteDialog
          name={selectedRow.name}
          open={isOpenDelete}
          onClose={() => setIsOpenDelete(false)}
          isLoading={deleteVariantIsLoading}
          onDelete={onDeleteVariant}
        />
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------
