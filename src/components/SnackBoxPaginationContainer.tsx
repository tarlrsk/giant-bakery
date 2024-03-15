"use client";

import useSWR from "swr";
import Image from "next/image";
import toast from "react-hot-toast";
import React, { useState } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { SnackBox } from "@prisma/client";
import { useRouter } from "next/navigation";
import { addItemToCart } from "@/actions/cartActions";

import { Card, Button } from "@nextui-org/react";

// import { Pagination } from "@nextui-org/react";

// ----------------------------------------------------------------------

type SnackBoxItemsProps = {
  cols: number;
  onClick?: (selected: any) => void;
};

type SnackBoxCardProps = {
  item: SnackBox;
  size?: "sm" | "md";
  onClick?: () => void;
};

// ----------------------------------------------------------------------

export default function SnackBoxPaginationContainer() {
  return (
    <div className="relative">
      <div className="px-36 pb-8">
        <div className="pb-24 text-5xl font-normal">ชุดเบรกจัดให้</div>
        <div className="container pr-6">
          <SnackBoxItems cols={4} />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

function SnackBoxItems({ cols, onClick, ...other }: SnackBoxItemsProps) {
  const router = useRouter();

  const { getPresetSnackBox } = apiPaths();

  const { data } = useSWR(getPresetSnackBox(), fetcher);

  const items: SnackBox[] = data?.response?.data || [];

  const [currentPage, setCurrentPage] = useState(1);

  const snackBoxCount = items.length;

  const itemsPerPage = 4;
  const pageSize = Math.ceil(snackBoxCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayItems = items.slice(startIndex, endIndex);

  return (
    <>
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-10 justify-center items-center mx-auto"
        {...other}
      >
        {Object.values(displayItems)?.map((item: any) => (
          <SnackBoxCard
            key={item.id}
            item={item}
            onClick={
              onClick
                ? () => onClick(item)
                : () => router.push(`/snack-boxes/${item.name}?id=${item.id}`)
            }
          />
        ))}
      </div>
      {/* <Pagination
        showControls
        total={pageSize}
        initialPage={1}
        onChange={(page) => setCurrentPage(page)}
        variant="light"
        size="lg"
        className="flex items-center justify-center pt-24"
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function SnackBoxCard({ item, onClick, size = "md" }: SnackBoxCardProps) {
  const { addPresetSnackBoxToCart } = apiPaths();

  const [isLoading, setIsLoading] = useState(false);

  async function handleAddToCart(itemId: string) {
    setIsLoading(true);
    try {
      await addItemToCart(addPresetSnackBoxToCart(), itemId, 1);
      toast.success("ใส่ตะกร้าสำเร็จ");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setIsLoading(false);
  }

  return (
    <Card
      className="bg-white pb-1 md:pb-2 w-44 md:w-unit-80 rounded-md shadow-md hover:cursor-pointer h-full items-center"
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
          ฿{item?.price?.toFixed(0) ?? 0}
        </p>
        <Button
          size={size}
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
