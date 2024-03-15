import Image from "next/image";
import toast from "react-hot-toast";
import React, { useState } from "react";
import apiPaths from "@/utils/api-path";
import { Cake, Refreshment } from "@prisma/client";
import { addItemToCart } from "@/actions/cartActions";

import { Card, Button } from "@nextui-org/react";

// ----------------------------------------------------------------------
type Props = {
  item: Refreshment | Cake;
  size?: "sm" | "md";
  onClick?: () => void;
};

// ----------------------------------------------------------------------

export default function CustomItemCard({ item, onClick, size = "md" }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { addRefreshmentToCart } = apiPaths();

  async function handleAddToCart(itemId: string) {
    setIsLoading(true);
    try {
      await addItemToCart(addRefreshmentToCart(), itemId, 1);
      toast.success("ใส่ตะกร้าสำเร็จ");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setIsLoading(false);
  }

  let imgSize: { width: number; height: number } = { width: 800, height: 128 };
  let padding = 12;
  let fontSize = "xl";

  if (size === "sm") {
    imgSize.width = 180;
    imgSize.height = 50;

    padding = 2;
    fontSize = "md";
  }

  return (
    <Card
      className={` bg-white ${
        size === "sm" ? "pb-1 md:pb-4 w-15" : "pb-1 md:pb-2 w-44 md:w-unit-80"
      } rounded-md shadow-md hover:cursor-pointer h-full items-center`}
      isPressable
      onPress={onClick}
    >
      <div className=" relative w-full h-36 md:h-64">
        <Image
          src={(item?.image as string) ?? "/placeholder-image.jpeg"}
          alt={item?.name}
          fill
          className=" object-cover"
        />
      </div>
      <div
        className={`flex flex-col flex-wrap text-pretty p-4 md:p-6 ${
          size === "sm" ? "gap-1" : "gap-2 md:gap-3 items-center"
        }`}
      >
        <p
          className={`text-primaryT-darker truncate text-lg md:text-${fontSize} font-normal max-w-full`}
        >
          {item?.name}
        </p>

        {size === "sm" ? (
          <div className="flex flex-row w-full justify-between items-center ">
            <p
              className={`text-secondaryT-main text-lg md:text-${fontSize} font-semibold`}
            >
              ฿{item?.price?.toFixed(2) ?? 0}
            </p>
            <Button
              size={size}
              onClick={onClick}
              className={`bg-secondaryT-main items-center text-white text-${size} rounded-sm px-${padding}`}
            >
              เพิ่ม
            </Button>
          </div>
        ) : (
          <>
            <p
              className={`text-secondaryT-main text-lg md:text-${fontSize} font-semibold`}
            >
              ฿{item?.price?.toFixed(2) ?? 0}
            </p>
            <Button
              size={size}
              isLoading={isLoading}
              onClick={() => {
                handleAddToCart(item?.id);
              }}
              className={`bg-secondaryT-main items-center text-white text-${size} rounded-sm px-${padding}`}
            >
              ใส่ตะกร้า
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
