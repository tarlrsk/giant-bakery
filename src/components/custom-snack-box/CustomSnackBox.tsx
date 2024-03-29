"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import apiPaths from "@/utils/api-path";
import { useForm } from "react-hook-form";
import { useMemo, useState, useEffect } from "react";
import { addCustomSnackBoxToCartAction } from "@/actions/cartActions";

import {
  Tab,
  Tabs,
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";

import Iconify from "../icons/Iconify";
import { BoxIcon } from "../icons/BoxIcon";
import { RHFRadioGroup } from "../hook-form";
import CustomCakeItems from "./CustomCakeItems";
import CustomBakeryItems from "./CustomBakeryItems";
import FormProvider from "../hook-form/form-provider";
import CustomSnackBoxItems from "./CustomSnackBoxItems";
import CustomBeverageItems from "./CustomBeverageItems";

// ----------------------------------------------------------------------

type IPackaging = "PAPER_BAG" | "SNACK_BOX_S" | "SNACK_BOX_M";

type IDrinkOption = "INCLUDE" | "EXCLUDE" | "NONE";

type IPackagingForm = {
  selectedPackaging: IPackaging;
  selectedDrinkOption: IDrinkOption;
};

type ICustomSnackBoxItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  type: string;
  currQty: number;
};

const PACKAGING_OPTIONS = [
  {
    value: "PAPER_BAG",
    label: "ถุงกระดาษ",
    description: "4 ชิ้นต่อถุง",
    amount: 4,
  },
  {
    value: "SNACK_BOX_S",
    label: "กล่องขนม (S)",
    description: "2 ชิ้นต่อกล่อง",
    amount: 2,
  },
  {
    value: "SNACK_BOX_M",
    label: "กล่องขนม (M)",
    description: "4 ชิ้นต่อกล่อง",
    amount: 4,
  },
];

const DRINK_OPTIONS = [
  { value: "INCLUDE", label: "มีเครื่องดื่ม" },
  // { value: "excluded", label: "ใส่ถุงแยกต่างหาก" },
  { value: "NONE", label: "ไม่มีเครื่องดื่ม" },
];

// ----------------------------------------------------------------------

export default function CustomSnackBox() {
  const methods = useForm<IPackagingForm>({
    defaultValues: {
      selectedPackaging: "PAPER_BAG",
      selectedDrinkOption: "INCLUDE",
    },
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<
    "bakeries" | "cakes" | "drinks"
  >("drinks");
  const [snackBoxQty, setSnackBoxQty] = useState(1);
  const [selectedItems, setSelectedItems] = useState<ICustomSnackBoxItem[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addCustomSnackBoxToCart } = apiPaths();

  const { watch, handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  const values = watch();

  const { selectedPackaging, selectedDrinkOption } = values;

  const totalPrice = useMemo(() => {
    return selectedItems.reduce((prev, curr) => prev + curr.price, 0);
  }, [selectedItems]);

  const itemAmount = useMemo(() => {
    return selectedItems.reduce((prev, curr) => prev + curr.quantity, 0);
  }, [selectedItems]);

  const onAddItem = (item: {
    id: string;
    name: string;
    image: string;
    price: number;
    type: string;
    currQty: number;
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
        type: string;
        currQty: number;
      } = selectedItems[foundItemIndex];

      const { id, name, image, quantity, type, currQty } = foundItem;

      const newItem = {
        id,
        type,
        name,
        image,
        quantity: quantity + 1,
        price: item.price * (quantity + 1),
        currQty,
      };

      const newSelectedItems = selectedItems.map((item, index: number) => {
        if (index === foundItemIndex) {
          return newItem;
        }
        return item;
      });

      setSelectedItems(newSelectedItems);
    } else {
      const { id, name, image, price, type, currQty } = item;
      setSelectedItems((prev) => [
        ...prev,
        {
          id,
          name,
          image,
          price,
          type,
          quantity: 1,
          currQty,
        },
      ]);
    }
  };

  const onRemoveItem = (item: ICustomSnackBoxItem) => {
    setSelectedItems((prev) => prev.filter((el) => el.id !== item.id));
  };

  const handleDecrement = () => {
    if (snackBoxQty > 1) setSnackBoxQty(snackBoxQty - 1);
  };

  const handleIncrement = () => {
    if (snackBoxQty < 999) setSnackBoxQty(snackBoxQty + 1);
  };

  const limitQty =
    PACKAGING_OPTIONS.find((option) => option.value === selectedPackaging)
      ?.amount || 0;

  const limitSnackQty =
    selectedDrinkOption !== "NONE" ? limitQty - 1 : limitQty;

  const limitDrinkQty = selectedDrinkOption !== "NONE" ? 1 : 0;

  const isMatchLimitDrinkQty = useMemo(() => {
    const drinkItems = selectedItems.filter((item) => item.type === "BEVERAGE");
    const drinkItemsQty = drinkItems.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );

    return drinkItemsQty === limitDrinkQty;
  }, [limitDrinkQty, selectedItems]);

  const isMatchLimitSnackQty = useMemo(() => {
    const snackItems = selectedItems.filter((item) => item.type !== "BEVERAGE");
    const snackItemsQty = snackItems.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );

    return snackItemsQty === limitSnackQty;
  }, [limitSnackQty, selectedItems]);

  const handleInputChange = (e: any) => {
    let inputValue = e.target.value;

    inputValue =
      isNaN(inputValue) || inputValue === "" ? 1 : parseInt(inputValue, 10);

    if (isNaN(inputValue) || inputValue < 1) {
      inputValue = 1;
    }
    inputValue = Math.min(Math.max(inputValue, 1), 999);
    setSnackBoxQty(inputValue);
  };

  async function handleAddToCart() {
    setIsAddingToCart(true);
    const body = {
      packageType: selectedPackaging as IPackaging,
      beverage: selectedDrinkOption as IDrinkOption,
      refreshmentIds: selectedItems.flatMap((item) => {
        let tempArr = new Array(item.quantity).fill(0);
        return tempArr.map((el) => item.id);
      }),
      quantity: snackBoxQty,
    };

    try {
      const res = await addCustomSnackBoxToCartAction(
        addCustomSnackBoxToCart(),
        body,
      );
      toast.success("จัดชุดเบรกสำเร็จ");
      setCurrentPage(1);
      reset();
      setSelectedItems([]);
      setSnackBoxQty(1);
      setSelectedTab("drinks");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setIsAddingToCart(false);
  }

  useEffect(() => {
    if (selectedDrinkOption === "INCLUDE") {
      setSelectedTab("drinks");
    } else {
      setSelectedTab("bakeries");
    }
  }, [selectedDrinkOption]);

  const renderPackageHeader = (
    <h2 className=" text-xl font-medium">เลือกบรรจุภัณฑ์</h2>
  );

  const renderPackageSection = (
    <div className="my-auto grid items-center justify-center gap-1 overflow-y-auto md:grid-cols-3 md:gap-4">
      <div className="md:col-span-1">
        <Image
          src={
            selectedPackaging === "PAPER_BAG"
              ? "/paper-bag.jpeg"
              : selectedPackaging === "SNACK_BOX_S"
                ? "/snack-box-s.png"
                : "/snack-box-m.png"
          }
          width={230}
          height={230}
          className=" mx-auto"
          alt="paper bag image"
        />
      </div>
      <div className="md:col-span-2">
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="flex flex-col gap-2 md:gap-3">
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
              setCurrentPage(2);
            }}
          >
            {selectedDrinkOption === "INCLUDE"
              ? "เลือกขนมและเครื่องดื่ม"
              : "เลือกขนม"}
          </Button>
        </FormProvider>
      </div>
    </div>
  );

  const renderSnackHeader = (
    <>
      <h2 className=" text-xl font-medium">
        {selectedDrinkOption === "INCLUDE"
          ? "เลือกขนมและเครื่องดื่ม"
          : "เลือกขนม"}
      </h2>

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
            <div className="min-w-72 mb-2 rounded-sm bg-primaryT-darker px-4 py-2 text-center text-small font-medium text-white">
              ชุดเบรกของฉัน
            </div>

            <CustomSnackBoxItems
              items={selectedItems}
              onRemoveItem={onRemoveItem}
            />

            {selectedItems.length > 0 && (
              <div className="px-4 py-2 text-sm font-medium">{`ราคารวมกล่องละ ${totalPrice} บาท`}</div>
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
        {selectedDrinkOption !== "NONE" && (
          <Tab key="drinks" title="เครื่องดื่ม" />
        )}
        <Tab key="bakeries" title="เบเกอรี่" />
        <Tab key="cakes" title="เค้ก" />
      </Tabs>
      <div
        className={`overflow-y-auto pb-4 ${
          currentPage === 2 && "md:min-h-[284px] md:min-w-[824px]"
        }`}
      >
        {selectedTab === "bakeries" && (
          <CustomBakeryItems
            cols={4}
            category=""
            onClick={(selected) => onAddItem(selected)}
          />
        )}

        {selectedTab === "cakes" && (
          <CustomCakeItems
            type="CAKE"
            onClick={(selected) => onAddItem(selected)}
          />
        )}

        {selectedTab === "drinks" && (
          <CustomBeverageItems
            cols={4}
            onClick={(selected) => onAddItem(selected)}
          />
        )}
      </div>
      <div className=" flex flex-row gap-4">
        {!!limitDrinkQty && (
          <div
            className={` flex flex-row items-center gap-2 ${
              isMatchLimitDrinkQty ? "text-green-600" : ""
            }`}
          >
            <Iconify icon="charm:circle-tick" size={24} />
            <div className=" mt-1">{`โปรดเลือกเครื่องดื่ม ${limitDrinkQty} กล่อง`}</div>
          </div>
        )}
        <div
          className={` flex flex-row items-center gap-2 ${
            isMatchLimitSnackQty ? "text-green-600" : ""
          }`}
        >
          <Iconify icon="charm:circle-tick" size={24} />
          <div className=" mt-1">{`โปรดเลือกขนมทั้งหมด ${limitSnackQty} ชิ้น`}</div>
        </div>
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
          isDisabled={!isMatchLimitDrinkQty || !isMatchLimitSnackQty}
          className="rounded-sm"
          onClick={() => {
            setCurrentPage(3);
          }}
        >
          {`เลือกจำนวน${selectedPackaging === "PAPER_BAG" ? "ถุง" : "กล่อง"}`}
        </Button>
      </div>
    </>
  );

  const renderSnackBoxAmountHeader = (
    <h2 className=" text-xl font-medium">{`เลือกจำนวน${
      selectedPackaging === "PAPER_BAG" ? "ถุง" : "กล่อง"
    }`}</h2>
  );

  const renderSelectAmountSection = (
    <div className="relative flex flex-col items-center justify-center gap-6 overflow-y-auto md:mx-24 md:flex-row md:gap-20">
      <div className=" flex flex-col items-center justify-center gap-0">
        <Image
          src={
            selectedPackaging === "PAPER_BAG"
              ? "/paper-bag.jpeg"
              : selectedPackaging === "SNACK_BOX_S"
                ? "/snack-box-s.png"
                : "/snack-box-m.png"
          }
          alt="packaging"
          width={250}
          height={250}
        />
        <div className=" flex flex-row gap-2">
          {selectedItems.map((item, index) => (
            <div key={index} className=" relative h-14 w-14">
              <Image
                src={(item?.image as string) ?? "/placeholder.svg"}
                alt={item?.name}
                fill
                className=" rounded-sm border-1 border-primaryT-darker object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="relative flex h-full grow flex-col gap-4 text-center md:gap-5 md:text-left">
        <div className=" flex flex-col gap-3">
          <h1 className="text-xl font-semibold leading-normal">
            {`บรรจุภัณฑ์: ${
              selectedPackaging === "PAPER_BAG" ? "ถุงกระดาษ" : "กล่องขนม"
            }`}
          </h1>
          <div className=" flex flex-col gap-1">
            <p>
              {`ตัวเลือกเครื่องดื่ม: ${
                selectedDrinkOption === "EXCLUDE"
                  ? "มีเครื่องดื่ม"
                  : "ไม่มีเครื่องดื่ม"
              }`}
            </p>
            {/* <p className=" text-base">ประกอบด้วย: </p> */}
            <p className=" text-base">
              ประกอบด้วย:
              {selectedItems
                .map((item) => `${item.name} x${item.quantity}`)
                .join(", ")}
            </p>
          </div>
          <h1 className="text-2xl font-semibold leading-normal text-secondaryT-main">
            {`${totalPrice} บาท`}
          </h1>
        </div>

        <div className=" flex grow flex-row gap-6">
          <div className=" flex h-12 rounded-sm border-1  border-black">
            <Button
              size="sm"
              onClick={handleDecrement}
              className=" h-full w-full items-center rounded-l-sm bg-transparent py-1 text-xl font-medium text-black"
            >
              -
            </Button>
            <input
              type="text"
              value={snackBoxQty}
              onChange={handleInputChange}
              className=" h-full w-16 items-center border-x-1 border-x-black py-1 text-center text-xl font-medium text-black"
            />
            <Button
              size="sm"
              onClick={handleIncrement}
              className="  h-full w-full items-center rounded-r-sm bg-transparent py-1 text-xl font-medium text-black"
            >
              +
            </Button>
          </div>
          <Button
            size="lg"
            color="secondary"
            className="w-full items-center rounded-sm"
            isLoading={isAddingToCart}
            onPress={() => {
              handleAddToCart();
            }}
          >
            ใส่ตะกร้า
          </Button>
        </div>

        <Button
          fullWidth
          size="lg"
          variant="bordered"
          color="secondary"
          className="rounded-sm"
          onClick={() => {
            setCurrentPage(2);
          }}
        >
          ย้อนกลับ
        </Button>
      </div>
    </div>
  );

  return (
    <div className="relative flex w-full flex-col items-center gap-6 pb-8 ">
      <p className=" text-3xl md:text-5xl">ออกแบบชุดเบรกเอง</p>
      <div className=" max-w-3xl text-center text-medium font-normal leading-normal md:text-xl md:leading-9">
        ยังไม่เจอชุดเบรกที่ถูกใจ? ลองจัดสรรชุดเบรกที่เป็นเอกลักษณ์ด้วยตัวคุณเอง
      </div>
      <div
        className={`flex max-h-unit-9xl  max-w-screen-lg flex-col gap-4 rounded-sm border-1.5 border-primaryT-darker p-6 md:h-auto`}
      >
        <div className="relative flex items-center justify-between">
          {currentPage === 1 && renderPackageHeader}
          {currentPage === 2 && renderSnackHeader}
          {currentPage === 3 && renderSnackBoxAmountHeader}
        </div>
        {currentPage === 1 && renderPackageSection}
        {currentPage === 2 && renderSnackSection}
        {currentPage === 3 && renderSelectAmountSection}
      </div>
    </div>
  );
}
