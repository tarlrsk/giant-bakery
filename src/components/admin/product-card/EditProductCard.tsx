"use client";

import toast from "react-hot-toast";
import { useCallback } from "react";
import { styled } from "@mui/system";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { RHFUpload } from "@/components/hook-form/rhf-upload";
import FormProvider from "@/components/hook-form/form-provider";
import { RHFSelect, RHFTextField } from "@/components/hook-form";
import {
  Paper,
  Stack,
  Button,
  Divider,
  MenuItem,
  Skeleton,
  Accordion,
  IconButton,
  Typography,
  AccordionProps,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

// ----------------------------------------------------------------------

const CATEGORY_OPTIONS = [
  { value: "bakery", label: "Bakery" },
  { value: "beverage", label: "Beverage" },
];

const SUB_CATEGORY_OPTIONS = [
  { value: "bread", label: "ขนมปัง" },
  { value: "pie", label: "พาย" },
  { value: "cookie", label: "คุกกี้" },
  { value: "snack", label: "ขนม" },
  { value: "cake", label: "เค้ก" },
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
  data?: {
    productUpload:
      | string
      | {
          path: string;
          preview: string;
        }
      | null;
    productName: string;
    description: string;
    category: string;
    subCategory: string;
    unitType: string;
    minQty: number | null;
    price: number | null;
    currentQty: number | null;
    width: number | null;
    length: number | null;
    height: number | null;
  };
  isLoading: boolean;
  onClose: () => void;
};

export default function EditProductCard({ data, isLoading, onClose }: Props) {
  const methods = useForm({ defaultValues: data });

  const { watch, setValue, handleSubmit } = methods;
  const values = watch();

  const { productName, category } = values;

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
        setValue("productUpload", newFile as any, { shouldValidate: true });
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
              {isLoading ? (
                <Skeleton
                  variant="text"
                  sx={{ minWidth: 160, fontSize: "1rem" }}
                />
              ) : (
                productName
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
              name="productUpload"
              thumbnail
              onDrop={onDropSingleFile}
              onDelete={() =>
                setValue("productUpload", null, { shouldValidate: true })
              }
            />
          )}

          {isLoading ? (
            <Skeleton height={100} />
          ) : (
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
                      <RHFTextField name="productName" label="ชื่อสินค้า" />
                      <RHFTextField
                        type="number"
                        name="price"
                        label="ราคา"
                        sx={{ width: "50%" }}
                      />
                    </Stack>
                    <RHFTextField name="description" label="รายละเอียดสินค้า" />

                    <Stack direction="row" spacing={1}>
                      <RHFSelect name="category" label="หมวดหมู่">
                        {CATEGORY_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </RHFSelect>

                      {category === "bakery" && (
                        <RHFSelect name="subCategory" label="หมวดหมู่ย่อย">
                          {SUB_CATEGORY_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </RHFSelect>
                      )}
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <RHFTextField
                        type="number"
                        name="width"
                        label="กว้าง (ซม.)"
                      />
                      <RHFTextField
                        type="number"
                        name="length"
                        label="ยาว (ซม.)"
                      />
                      <RHFTextField
                        type="number"
                        name="height"
                        label="สูง (ซม.)"
                      />
                    </Stack>
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
                    />
                    <RHFTextField
                      type="number"
                      name="currentQty"
                      label="จำนวนสินค้าปัจจุบัน"
                    />
                  </Stack>
                </AccordionDetails>
              </CustomAccordion>
            </Stack>
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
              อัพเดทสินค้า
            </Button>
          )}
        </Stack>
      </Paper>
    </FormProvider>
  );
}
