import React from "react";
import Image from "next/image";
import { Cake, Refreshment } from "@prisma/client";

import { Card, Button } from "@nextui-org/react";

// ----------------------------------------------------------------------
type Props = {
  item: Refreshment | Cake;
  onClick?: () => void;
};

// ----------------------------------------------------------------------

export default function CustomItemCard({ item, onClick }: Props) {
  return (
    <Card
      className="h-full w-full items-center rounded-md bg-white pb-1 shadow-md hover:cursor-pointer md:pb-2"
      isPressable
      onPress={onClick}
    >
      <div className=" relative h-36 w-full 2xl:h-44 2xl:w-44">
        <Image
          src={(item?.image as string) ?? "/placeholder.svg"}
          alt={item?.name}
          fill
          className=" object-cover"
        />
      </div>
      <div className="text-pretty flex w-full max-w-[176px] flex-col flex-wrap gap-1 truncate p-4 md:py-3">
        <div className="text-md w-full truncate text-left font-normal text-primaryT-darker ">
          {item?.name}
        </div>

        <div className="flex flex-row items-center justify-between ">
          <p className=" text-lg font-semibold text-secondaryT-main">
            ฿{item?.price?.toFixed(0) ?? 0}
          </p>
          <Button
            size="sm"
            onClick={onClick}
            className="items-center rounded-sm bg-secondaryT-main text-sm text-white"
          >
            เพิ่ม
          </Button>
        </div>
      </div>
    </Card>
  );
}
