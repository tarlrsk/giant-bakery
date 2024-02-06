"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Tab,
  Tabs,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";

import { BoxIcon } from "../icons/BoxIcon";
import { RHFRadioGroup } from "../hook-form";
import BeverageItems from "../BeverageItems";
import FormProvider from "../hook-form/form-provider";

// ----------------------------------------------------------------------

type PackagingForm = {
  selectedPackaging: "paper-bag" | "snack-box";
  selectedSnackBoxSize: "none" | "small" | "medium";
  selectedDrinkOption: "included" | "excluded" | "none";
};

const PACKAGING_OPTIONS = [
  {
    value: "paper-bag",
    label: "ถุงกระดาษ",
    description: "4 ชิ้นต่อถุง",
    amount: 4,
  },
  {
    value: "snack-box-s",
    label: "กล่องขนม (S)",
    description: "2 ชิ้นต่อถุง",
    amount: 2,
  },
  {
    value: "snack-box-m",
    label: "กล่องขนม (M)",
    description: "4 ชิ้นต่อถุง",
    amount: 4,
  },
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
      selectedDrinkOption: "included",
    },
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState("bakery");

  const { watch, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  const values = watch();

  const { selectedPackaging, selectedDrinkOption } = values;

  const renderPackageHeader = <h2 className=" text-xl">เลือกบรรจุภัณฑ์</h2>;

  const renderPackageSection = (
    <div className="grid gap-2 md:grid-cols-3 md:gap-4">
      <div className="md:col-span-1">
        <Image
          src={
            selectedPackaging === "paper-bag"
              ? "/paper-bag.jpeg"
              : "/snack-box.png"
          }
          width={250}
          height={250}
          className=" mx-auto"
          alt="paper bag image"
        />
      </div>
      <div className="md:col-span-2">
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <RHFRadioGroup
              name="selectedPackaging"
              options={PACKAGING_OPTIONS}
              label="บรรจุภัณฑ์"
              orientation="horizontal"
              color="primary"
            />

            <RHFRadioGroup
              name="selectedDrinkOption"
              options={DRINK_OPTIONS}
              label="ตัวเลือกเครื่องดื่ม"
              orientation="horizontal"
              color="secondary"
            />
          </div>
          <Button
            fullWidth
            size="lg"
            color="secondary"
            className="mt-6 rounded-sm"
            onClick={() => setCurrentPage(2)}
          >
            เลือกขนมและเครื่องดื่ม
          </Button>
        </FormProvider>
      </div>
    </div>
  );

  const renderSnackHeader = (
    <>
      <h2 className=" text-xl">{`เลือกขนมและเครื่องดื่ม ${PACKAGING_OPTIONS.find(
        (option) => option.value === selectedPackaging,
      )?.amount} ชิ้น`}</h2>

      <Popover placement="bottom" radius="md">
        <PopoverTrigger>
          <Button isIconOnly disableAnimation className="bg-transparent">
            <BoxIcon width={30} height={30} />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-small font-medium text-center text-white bg-primaryT-darker rounded-sm py-2 px-4">
              ชุดเบรกของฉัน
            </div>
            <div className="text-tiny py-2">ราคารวมกล่องละ</div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );

  const renderSnackSection = (
    <>
      <Tabs
        variant="underlined"
        aria-label="Product Tabs"
        size="lg"
        color="secondary"
        classNames={{ tabList: "px-0" }}
        selectedKey={selectedTab}
        onSelectionChange={(selected) => setSelectedTab(selected as string)}
      >
        <Tab key="bakery" title="เบเกอรี่" />
        <Tab key="cake" title="เค้ก" />
        {selectedDrinkOption !== "none" && (
          <Tab key="drinks" title="เครื่องดื่ม" />
        )}
      </Tabs>

      <BeverageItems
        cols={4}
        size="sm"
        onClick={(selected) => console.log("itemId:", selected)}
      />

      <div className=" flex flex-row gap-4">
        <Button
          fullWidth
          size="lg"
          variant="bordered"
          color="secondary"
          className="rounded-sm"
          onClick={() => setCurrentPage(1)}
        >
          ย้อนกลับ
        </Button>
        <Button
          fullWidth
          size="lg"
          color="secondary"
          className="rounded-sm"
          onClick={() => setCurrentPage(3)}
        >
          เลือกจำนวนกล่อง
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col m-6 p-6 border border-black rounded-sm gap-4 max-w-screen-lg">
      <div className="flex justify-center md:justify-between items-center">
        {currentPage === 1 && renderPackageHeader}
        {currentPage === 2 && renderSnackHeader}
      </div>
      {currentPage === 1 && renderPackageSection}
      {currentPage === 2 && renderSnackSection}
    </div>
  );
}

// ----------------------------------------------------------------------
