"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Tab,
  Tabs,
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";

import CakeItems from "../CakeItems";
import BakeryItems from "../BakeryItems";
import { BoxIcon } from "../icons/BoxIcon";
import { RHFRadioGroup } from "../hook-form";
import BeverageItems from "../BeverageItems";
import FormProvider from "../hook-form/form-provider";
import CustomSnackBoxItems from "./CustomSnackBoxItems";

// ----------------------------------------------------------------------

type PackagingForm = {
  selectedPackaging: "paper-bag" | "snack-box";
  selectedSnackBoxSize: "none" | "small" | "medium";
  selectedDrinkOption: "included" | "excluded" | "none";
};

type ICustomSnackBoxItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
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
  const [selectedTab, setSelectedTab] = useState<
    "bakeries" | "cakes" | "drinks"
  >("bakeries");
  const [title, setTitle] = useState("");

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

  const [selectedItems, setSelectedItems] = useState<
    {
      id: string;
      name: string;
      image: string;
      price: number;
      quantity: number;
    }[]
  >([]);

  const itemAmount = useMemo(() => {
    return selectedItems.reduce((prev, curr) => prev + curr.quantity, 0);
  }, [selectedItems]);

  const onAddItem = (item: {
    id: string;
    name: string;
    image: string;
    price: number;
  }) => {
    const foundItemIndex = selectedItems.findIndex(
      (currentItem: { id: string }) => currentItem.id === item.id,
    );
    if (foundItemIndex !== -1) {
      const foundItem: {
        id: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
      } = selectedItems[foundItemIndex];

      const { id, name, image, quantity } = foundItem;

      const newItem = {
        id,
        name,
        image,
        quantity: quantity + 1,
        price: item.price * (quantity + 1),
      };

      const newSelectedItems = selectedItems.map((item, index: number) => {
        if (index === foundItemIndex) {
          return newItem;
        }
        return item;
      });

      setSelectedItems(newSelectedItems);
    } else {
      const { id, name, image, price } = item;
      setSelectedItems((prev) => [
        ...prev,
        {
          id,
          name,
          image,
          price,
          quantity: 1,
        },
      ]);
    }
  };

  const onRemoveItem = (item: ICustomSnackBoxItem) => {
    setSelectedItems((prev) => prev.filter((el) => el.id !== item.id));
  };

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
            onClick={() => {
              let tempTitle;
              if (selectedDrinkOption === "included") {
                tempTitle = `เลือกขนม ${
                  PACKAGING_OPTIONS.find(
                    (option) => option.value === selectedPackaging,
                  )?.amount! - 1
                } ชิ้น และเครื่องดื่ม 1 กล่อง`;
              } else if (selectedDrinkOption === "excluded") {
                tempTitle = `เลือกขนม ${PACKAGING_OPTIONS.find(
                  (option) => option.value === selectedPackaging,
                )?.amount} ชิ้น และเครื่องดื่ม 1 กล่อง`;
              } else {
                tempTitle = `เลือกขนม ${PACKAGING_OPTIONS.find(
                  (option) => option.value === selectedPackaging,
                )?.amount} ชิ้น`;
              }

              setTitle(tempTitle);
              setCurrentPage(2);
            }}
          >
            เลือกขนมและเครื่องดื่ม
          </Button>
        </FormProvider>
      </div>
    </div>
  );

  const renderSnackHeader = (
    <>
      <h2 className=" text-xl">{title}</h2>

      <Popover placement="bottom" radius="md">
        <Badge
          content={itemAmount}
          color="secondary"
          variant="solid"
          placement="bottom-right"
          isInvisible={itemAmount === 0}
          showOutline={false}
          className="mb-1 mr-1"
        >
          <PopoverTrigger>
            <Button isIconOnly disableAnimation className="bg-transparent">
              <BoxIcon width={30} height={30} />
            </Button>
          </PopoverTrigger>
        </Badge>

        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-small font-medium text-center text-white bg-primaryT-darker rounded-sm py-2 px-4 min-w-72 mb-2">
              ชุดเบรกของฉัน
            </div>

            <CustomSnackBoxItems
              items={selectedItems}
              onRemoveItem={onRemoveItem}
            />

            {selectedItems.length > 0 && (
              <div className="text-sm py-2 px-4 font-medium">{`ราคารวมกล่องละ ${selectedItems.reduce(
                (prev, curr) => prev + curr.price,
                0,
              )} บาท`}</div>
            )}
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
        onSelectionChange={(selected) =>
          setSelectedTab(selected as "bakeries" | "cakes" | "drinks")
        }
      >
        <Tab key="bakeries" title="เบเกอรี่" />
        <Tab key="cakes" title="เค้ก" />
        {selectedDrinkOption !== "none" && (
          <Tab key="drinks" title="เครื่องดื่ม" />
        )}
      </Tabs>
      <div className="overflow-y-auto max-h-unit-96 mb-4">
        {selectedTab === "bakeries" && (
          <BakeryItems
            cols={5}
            size="sm"
            onClick={(selected) => onAddItem(selected)}
          />
        )}

        {selectedTab === "cakes" && (
          <CakeItems
            cols={5}
            size="sm"
            onClick={(selected) => onAddItem(selected)}
          />
        )}

        {selectedTab === "drinks" && (
          <BeverageItems
            cols={5}
            size="sm"
            onClick={(selected) => onAddItem(selected)}
          />
        )}
      </div>
      <div className=" flex flex-row gap-4">
        <Button
          fullWidth
          size="lg"
          variant="bordered"
          color="secondary"
          className="rounded-sm"
          onClick={() => {
            setSelectedItems([]);
            setCurrentPage(1);
          }}
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
      <div className="flex justify-center md:justify-between items-center relative">
        {currentPage === 1 && renderPackageHeader}
        {currentPage === 2 && renderSnackHeader}
      </div>
      {currentPage === 1 && renderPackageSection}
      {currentPage === 2 && renderSnackSection}
    </div>
  );
}

// ----------------------------------------------------------------------
