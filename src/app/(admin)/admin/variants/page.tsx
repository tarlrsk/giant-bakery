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
  useTheme,
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

const COLOR_CUSTOMIZABLE_VARIANT_TYPES = ["CREAM", "TOP_EDGE", "BOTTOM_EDGE"];

export const AVAILABLE_COLORS = [
  { value: "WHITE", label: "ขาว", code: "#FFFFFF" },
  { value: "PURPLE", label: "ม่วง", code: "#7758a9" },
  { value: "RED", label: "แดง", code: "#aa2639" },
  { value: "DARK_RED", label: "แดงคริสมาสต์", code: "#aa2639" },
  { value: "ORANGE", label: "ส้ม", code: "#F48c08" },
  { value: "YELLO_LEMON", label: "เหลืองมะนาว", code: "#e6e007" },
  { value: "DARK_GREEN", label: "เขียวแก่", code: "#2f5e1e" },
  { value: "GREEN_APPLE", label: "เขียวแอปเปิ้ล", code: "#80c06d" },
  { value: "BLUE", label: "ฟ้า", code: "#5997bc" },
];

// ----------------------------------------------------------------------

export default function AdminVariant() {
  const theme = useTheme();
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
  } = useAdmin().useVariantAdmin(
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
      color: "WHITE",
    },
  });

  const editVariantMethods = useForm<IVariant>({
    resolver: zodResolver(createUpdateVariantSchema),
    defaultValues: useMemo(() => {
      return { ...selectedRow, editedColorId: "" };
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
      setValueEditVariant("editedColorId", "");
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

  const {
    isActive: isActiveNewVariant,
    image: newVariantImage,
    type: newVariantType,
  } = watchNewVariant();

  const {
    name: editVariantName,
    isActive: isActiveEditVariant,
    image: editVariantImage,
    type: editVariantType,
    color: editVariantColor,
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
      const { image, name, isActive, type, color } = data;
      const bodyFormData = new FormData();
      bodyFormData.append("name", name);
      if (image) {
        bodyFormData.append("image", image);
      }
      bodyFormData.append("isActive", isActive ? "true" : "false");
      bodyFormData.append("type", type);
      bodyFormData.append("color", color);

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
      const { image, name, isActive, type, editedColorId } = data;
      const bodyFormData = new FormData();
      bodyFormData.append("name", name);
      if (typeof image !== "string" && image) {
        bodyFormData.append("image", image);
      }
      bodyFormData.append("isActive", isActive ? "true" : "false");
      bodyFormData.append("type", type);

      // If edited variant has color
      if (editedColorId) {
        bodyFormData.append("id", editedColorId ?? "");
      } else {
        bodyFormData.append("id", selectedRow?.id ?? "");
      }

      await updateVariantTrigger(bodyFormData);
      variantsMutate();
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
          {newVariantType && hasColor(newVariantType) && (
            <RHFSelect
              name="color"
              defaultValue="WHITE"
              label="สีของตัวเลือกเค้ก"
              helperText="กรณีสร้างตัวเลือกใหม่ สีพื้นฐานจะต้องเป็นสีขาว"
              disabled
              required
            >
              {AVAILABLE_COLORS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        minWidth: 20,
                        minHeight: 20,
                        bgcolor: `${option.code}`,
                        borderRadius: "100%",
                        border: "1px solid",
                        borderColor: theme.palette.divider,
                      }}
                    />
                    <Typography>{option.label}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </RHFSelect>
          )}
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
            {editVariantType && hasColor(editVariantType) && (
              <RHFSelect
                name="color"
                defaultValue="WHITE"
                label="สีของตัวเลือกเค้ก"
                required
              >
                {AVAILABLE_COLORS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          minWidth: 20,
                          minHeight: 20,
                          bgcolor: `${option.code}`,
                          borderRadius: "100%",
                          border: "1px solid",
                          borderColor: theme.palette.divider,
                        }}
                      />
                      <Typography>{option.label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </RHFSelect>
            )}
            <RHFTextField name="name" label="ชื่อตัวเลือกเค้ก" required />
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

  // On selected row, then open Edit Drawer
  useEffect(() => {
    if (rowSelectionModel.length && selectedRow?.id !== rowSelectionModel[0]) {
      const selectedRowData: IVariant = variants?.data?.find(
        (row: IVariant) => row.id === rowSelectionModel[0],
      );

      setSelectedRow(selectedRowData);

      // If selected row has colors, then set editedId to white as default
      if (selectedRowData?.colors?.length > 0) {
        const whiteColor = selectedRowData?.colors.find(
          (el) => el.color === "WHITE",
        )?.image;
        setValueEditVariant("editedColorId", whiteColor || "");
      }

      setOpenEditDrawer(true);
    }
  }, [
    resetEditVariant,
    rowSelectionModel,
    selectedRow?.id,
    setValueEditVariant,
    variants?.data,
  ]);

  useEffect(() => {
    resetEditVariant(selectedRow);
  }, [resetEditVariant, selectedRow]);

  useEffect(() => {
    setFilteredRows(variants?.data || []);
  }, [variants]);

  // On color option of existing row is changed, then update editId to the id of that color
  useEffect(() => {
    const itemAvailableColors = selectedRow?.colors || [];
    const foundColor = itemAvailableColors.find(
      (el) => el.color === editVariantColor,
    );

    if (!foundColor) return;

    setValueEditVariant("editedColorId", foundColor.id);
    setValueEditVariant("image", foundColor.image);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editVariantColor]);

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

export function hasColor(variantType: string) {
  return COLOR_CUSTOMIZABLE_VARIANT_TYPES.includes(variantType);
}
