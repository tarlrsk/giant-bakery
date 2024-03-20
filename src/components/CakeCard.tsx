import React from "react";
import Image from "next/image";
// import toast from "react-hot-toast";
import { Cake } from "@prisma/client";
// import apiPaths from "@/utils/api-path";
// import useSWRMutation from "swr/mutation";
// import getCurrentUser from "@/actions/userActions";

import { Card, Button } from "@nextui-org/react";

// ----------------------------------------------------------------------

type Props = {
  item: Cake;
  size?: "sm" | "md";
  onClick?: () => void;
};

// ----------------------------------------------------------------------

export default function CakeCard({ item, onClick, size = "md" }: Props) {
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

      <article
        className={`text-pretty flex flex-col flex-wrap p-6 gap-${
          size === "sm" ? "1" : "2 items-center"
        }`}
      >
        <p
          className={`max-w-full truncate text-lg font-normal text-primaryT-darker md:text-xl`}
        >
          {item?.name}
        </p>

        <p className={`text-lg font-semibold text-secondaryT-main md:text-xl`}>
          ฿{item?.price?.toFixed(0) ?? 0}
        </p>
        <Button
          size={size}
          onClick={onClick}
          className="text-md items-center rounded-sm bg-secondaryT-main text-white sm:px-12"
        >
          ใส่ตะกร้า
        </Button>
      </article>
    </Card>
  );
}
