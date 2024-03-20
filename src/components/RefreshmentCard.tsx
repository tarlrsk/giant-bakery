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
      className=" h-full items-center rounded-md bg-white pb-1 shadow-md hover:cursor-pointer md:w-unit-80 md:pb-2"
      isPressable
      onPress={onClick}
    >
      <div className=" relative h-32 w-full md:h-64">
        <Image
          src={(item?.image as string) ?? "/placeholder.svg"}
          alt={item?.name}
          fill
          className=" object-cover"
        />
      </div>
      <div className="text-pretty flex flex-col flex-wrap items-center gap-2 p-4 md:gap-3 md:p-6">
        <p className="max-w-full truncate text-lg font-normal text-primaryT-darker md:text-xl">
          {item?.name}
        </p>

        <p className="text-lg font-semibold text-secondaryT-main md:text-xl">
          ฿{item?.price?.toFixed(2) ?? 0}
        </p>
        <Button
          size="md"
          isLoading={isLoading}
          onClick={() => {
            handleAddToCart(item?.id);
          }}
          className="text-md items-center rounded-sm bg-secondaryT-main text-white sm:px-12"
        >
          ใส่ตะกร้า
        </Button>
      </div>
    </Card>
  );
}
