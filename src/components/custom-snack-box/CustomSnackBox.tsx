"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { RHFRadioGroup } from "../hook-form";
import FormProvider from "../hook-form/form-provider";
import { Button } from "@nextui-org/react";

// ----------------------------------------------------------------------

type PackagingForm = {
  selectedPackaging: "paper-bag" | "snack-box";
  selectedSnackBoxSize: "none" | "small" | "medium";
  selectedDrinkOption: "included" | "excluded" | "none";
};

const PACKAGING_OPTIONS = [
  { value: "paper-bag", label: "ถุงกระดาษ", description: "4 ชิ้นต่อถุง" },
  { value: "snack-box", label: "กล่องขนม", description: "2-4 ชิ้นต่อถุง" },
];

const SNACK_BOX_SIZE_OPTIONS = [
  { value: "small", label: "เล็ก", description: "บรรจุได้ 2 ชิ้น" },
  { value: "medium", label: "กลาง", description: "บรรจุได้ 4 ชิ้น" },
];

const DRINK_OPTIONS = [
  { value: "included", label: "ใส่ในบรรจุภัณฑ์" },
  { value: "excluded", label: "ใส่ถุงแยกต่างหาก" },
  { value: "none", label: "ไม่เลือกเครื่องดื่ม" },
];

// ----------------------------------------------------------------------

export default function CustomSnackBox() {
  const methods = useForm<PackagingForm>({
    defaultValues: {
      selectedPackaging: "paper-bag",
      selectedSnackBoxSize: "none",
      selectedDrinkOption: "included",
    },
  });

  const { watch, setValue, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  const values = watch();

  const { selectedPackaging, selectedSnackBoxSize, selectedDrinkOption } =
    values;

  console.log("values", values);

  useEffect(() => {
    if (selectedPackaging === "paper-bag") {
      setValue("selectedSnackBoxSize", "none");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPackaging]);

  return (
    <div className="flex flex-col m-6 p-6 border border-black rounded-sm gap-4">
      <div className="flex ">เลือกบรรจุภัณฑ์</div>
      <div className="flex flex-col">
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <RHFRadioGroup
              name="selectedPackaging"
              options={PACKAGING_OPTIONS}
              label="บรรจุภัณฑ์"
              orientation="horizontal"
              color="primary"
            />

            {selectedPackaging === "snack-box" && (
              <RHFRadioGroup
                name="selectedSnackBoxSize"
                options={SNACK_BOX_SIZE_OPTIONS}
                label="ไซส์กล่อง"
                orientation="horizontal"
                color="primary"
              />
            )}

            <RHFRadioGroup
              name="selectedDrinkOption"
              options={DRINK_OPTIONS}
              label="ตัวเลือกเครื่องดื่ม"
              orientation="horizontal"
              color="secondary"
            />
          </div>
          <Button fullWidth size="lg" color="secondary" className="mt-5">
            เลือกขนมและเครื่องดื่ม
          </Button>
        </FormProvider>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
