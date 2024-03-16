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

  return (
    <Card
      className="w-15 h-full items-center rounded-md bg-white pb-1 shadow-md hover:cursor-pointer md:pb-2"
      isPressable
      onPress={onClick}
    >
      <div className=" relative h-36 w-full md:h-40">
        <Image
          src={(item?.image as string) ?? "/placeholder-image.jpeg"}
          alt={item?.name}
          fill
          className=" object-cover"
        />
      </div>
      <div className="text-pretty flex w-full flex-col flex-wrap gap-1 p-4 md:py-3">
        <p className="text-md max-w-full truncate text-left font-normal text-primaryT-darker ">
          {item?.name}
        </p>

        <div className="flex w-full flex-row items-center justify-between ">
          <p className=" text-lg font-semibold text-secondaryT-main">
            ฿{item?.price?.toFixed(0) ?? 0}
          </p>
          <Button
            size="sm"
            onClick={onClick}
            className="items-center rounded-sm bg-secondaryT-main px-2 text-sm text-white"
          >
            เพิ่ม
          </Button>
        </div>
      </div>
    </Card>
  );
}
