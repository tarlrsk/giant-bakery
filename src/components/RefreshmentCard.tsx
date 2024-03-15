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
  onClick?: () => void;
};

// ----------------------------------------------------------------------

export default function RefreshmentCard({ item, onClick }: Props) {
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
      className=" bg-white pb-1 md:pb-2 w-44 md:w-unit-80 rounded-md shadow-md hover:cursor-pointer h-full items-center"
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
      <div className="flex flex-col flex-wrap text-pretty p-4 md:p-6 gap-2 md:gap-3 items-center">
        <p className="text-primaryT-darker truncate text-lg md:text-xl font-normal max-w-full">
          {item?.name}
        </p>

        <p className="text-secondaryT-main text-lg md:text-xl font-semibold">
          ฿{item?.price?.toFixed(2) ?? 0}
        </p>
        <Button
          size="md"
          isLoading={isLoading}
          onClick={() => {
            handleAddToCart(item?.id);
          }}
          className="bg-secondaryT-main items-center text-white text-md rounded-sm px-12"
        >
          ใส่ตะกร้า
        </Button>
      </div>
    </Card>
  );
}
