"use client";

import { z } from "zod";
import { useCallback } from "react";
import { styled } from "@mui/system";
import useAdmin from "@/hooks/useAdmin";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { RHFUpload } from "@/components/hook-form/rhf-upload";
import FormProvider from "@/components/hook-form/form-provider";
import { refreshmentValidationSchema } from "@/lib/validationSchema";
import { RHFSelect, RHFSwitch, RHFTextField } from "@/components/hook-form";
import {
  Paper,
  Stack,
  Divider,
  MenuItem,
  Accordion,
  IconButton,
  Typography,
  AccordionProps,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import { IProductRow } from "../types";

// ----------------------------------------------------------------------

export const TYPE_OPTIONS = [
  { value: "BAKERY", label: "เบเกอรี่" },
  { value: "BEVERAGE", label: "เครื่องดื่ม" },
];

export const CATEGORY_OPTIONS = [
  { value: "BREAD", label: "ขนมปัง" },
  { value: "PIE", label: "พาย" },
  { value: "COOKIE", label: "คุกกี้" },
  { value: "SNACK", label: "ขนม" },
  { value: "CAKE", label: "เค้ก" },
];

const CustomAccordion = styled(({ children, ...props }: AccordionProps) => (
  <Accordion {...props}>{children}</Accordion>
))(({ theme }) => ({
  boxShadow: "none",
  "&.MuiPaper-root": {
    "&.MuiPaper-elevation:before": {
      visibility: "hidden",
    },
  },
}));

const CustomAccordionSummary = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <AccordionSummary
    expandIcon={<ExpandMoreIcon />}
    sx={{
      px: 0,
      flexDirection: "row",
      justifyContent: "flex-start",
      "& .MuiAccordionSummary-content": {
        display: "block",
        flexGrow: 0,
      },
    }}
  >
    {children}
  </AccordionSummary>
);

// ----------------------------------------------------------------------

type Props = {
  data: IProductRow;
  isLoading: boolean;
  onClose: () => void;
};

type RefreshmentProps = z.infer<typeof refreshmentValidationSchema>;

// ----------------------------------------------------------------------

export default function EditProductCard({ data, isLoading, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm<RefreshmentProps>({
    resolver: zodResolver(refreshmentValidationSchema),
  });
  const { updateProductTrigger, updateProductIsLoading, productsMutate } =
    useAdmin(data);

  const { watch, setValue, handleSubmit } = methods;
  const values = watch();

  const { type, isActive } = values;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const {
        name,
        image,
        price,
        type,
        category,
        description,
        remark,
        quantity,
        minQty,
        currQty,
        maxQty,
        weight,
        height,
        length,
        width,
        isActive,
        unitType,
      } = data;

      const bodyFormData = new FormData();
      bodyFormData.append("name", name);
      if (typeof image !== "string") {
        bodyFormData.append("image", image);
      }
      bodyFormData.append("price", price.toString());
      bodyFormData.append("type", type);
      if (description) {
        bodyFormData.append("description", description);
      }
      bodyFormData.append("remark", remark || "");
      if (type === "BAKERY") {
        bodyFormData.append("category", category);
      }
      bodyFormData.append("quantity", quantity?.toString() || "0");
      bodyFormData.append("minQty", minQty.toString());
      bodyFormData.append("currQty", currQty.toString());
      bodyFormData.append("maxQty", maxQty.toString());
      bodyFormData.append("weight", weight.toString());
      bodyFormData.append("height", height.toString());
      bodyFormData.append("length", length.toString());
      bodyFormData.append("width", width.toString());
      bodyFormData.append("isActive", isActive ? "true" : "false");
      bodyFormData.append("unitType", unitType);

      await updateProductTrigger(bodyFormData);
      enqueueSnackbar("อัพเดทสินค้าสำเร็จ", { variant: "success" });
      productsMutate();
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
        <Stack direction="column" spacing={isLoading ? 0 : 2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1" fontWeight={500}>
              <Typography>{data.name}</Typography>
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

          <Stack spacing={1}>
            <CustomAccordion disableGutters>
              <CustomAccordionSummary>
                <Typography variant="button" sx={{ mr: 0.5 }}>
                  ข้อมูลสินค้า
                </Typography>
              </CustomAccordionSummary>
              <AccordionDetails sx={{ px: 1 }}>
                <Stack direction="column" spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <RHFTextField
                      name="name"
                      label="ชื่อสินค้า"
                      size="small"
                      required
                    />
                    <RHFTextField
                      type="number"
                      name="price"
                      label="ราคา"
                      sx={{ width: "50%" }}
                      size="small"
                      required
                    />
                  </Stack>
                  <RHFTextField
                    name="description"
                    label="รายละเอียดสินค้า"
                    size="small"
                  />

                  <Stack direction="row" spacing={1}>
                    <RHFSelect
                      name="type"
                      label="หมวดหมู่"
                      size="small"
                      required
                    >
                      {TYPE_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>

                    {type === "BAKERY" && (
                      <RHFSelect
                        name="category"
                        label="หมวดหมู่ย่อย"
                        size="small"
                        required={type === "BAKERY"}
                      >
                        {CATEGORY_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    )}
                  </Stack>

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
                </Stack>
              </AccordionDetails>
            </CustomAccordion>

            <Divider />

            <CustomAccordion defaultExpanded disableGutters>
              <CustomAccordionSummary>
                <Typography variant="button" sx={{ mr: 0.5 }}>
                  จำนวนสินค้า
                </Typography>
              </CustomAccordionSummary>
              <AccordionDetails sx={{ px: 1 }}>
                <Stack direction="row" spacing={1}>
                  <RHFTextField
                    type="number"
                    name="minQty"
                    label="จำนวนสินค้าขั้นต่ำ"
                    size="small"
                    required
                  />
                  <RHFTextField
                    type="number"
                    name="quantity"
                    label="จำนวนสินค้าปัจจุบัน"
                    size="small"
                    required
                    autoFocus
                  />
                </Stack>
              </AccordionDetails>
            </CustomAccordion>
          </Stack>

          <LoadingButton
            type="submit"
            size="large"
            color="secondary"
            variant="contained"
            loading={updateProductIsLoading}
          >
            อัพเดทสินค้า
          </LoadingButton>
        </Stack>
      </Paper>
    </FormProvider>
  );
}
