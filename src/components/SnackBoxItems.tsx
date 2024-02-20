"use client";

import useSWR from "swr";
import toast from "react-hot-toast";
import React, { useState } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { SnackBox } from "@prisma/client";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import getCurrentUser from "@/actions/userActions";

import { Pagination } from "@nextui-org/react";

import ProductCard from "./ProductCard";

// ----------------------------------------------------------------------

type Props = {
  size?: "sm" | "md";
  cols: number;
  onClick?: (selected: any) => void;
};

type IAddSnackBoxToCart = {
  userId: string;
  type: "MEMBER" | "GUEST";
  snackBoxId: string;
  quantity: number;
};

async function sendAddSnackBoxRequest(
  url: string,
  { arg }: { arg: IAddSnackBoxToCart },
) {
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export default function SnackBoxItems({
  size = "md",
  cols,
  onClick,
  ...other
}: Props) {
  const router = useRouter();

  const { getPresetSnackBox, addPresetSnackBoxToCart } = apiPaths();

  const { data } = useSWR(getPresetSnackBox(), fetcher);

  const items: SnackBox[] = data?.response?.data || [];

  const { trigger: triggerAddToCart, isMutating: isMutatingAddToCart } =
    useSWRMutation(addPresetSnackBoxToCart(), sendAddSnackBoxRequest);

  async function handleAddToCart(itemId: string) {
    const currentUser = await getCurrentUser();

    const body: IAddSnackBoxToCart = {
      userId: currentUser?.id || "",
      type: currentUser?.role === "CUSTOMER" ? "MEMBER" : "GUEST",
      snackBoxId: itemId,
      quantity: 1,
    };

    try {
      await triggerAddToCart(body);
      toast.success("ใส่ตระก้าสำเร็จ");
      router.push("/cart");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  }

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
        className={`grid grid-cols-${cols} gap-${
          size === "sm" ? 4 : 10
        } justify-center items-baseline hover:cursor-pointer`}
        {...other}
      >
        {Object.values(displayItems)?.map((item: any) => (
          <ProductCard
            key={item.id}
            name={item.name}
            size={size}
            price={item.price}
            img={item.image ? `${item.image as string}` : "/"}
            onClick={
              onClick
                ? () => onClick(item)
                : () => router.push(`/snack-boxes/${item.name}?id=${item.id}`)
            }
            isLoading={isMutatingAddToCart}
            addToCart={() => {
              handleAddToCart(item.id);
            }}
          />
        ))}
      </div>
      <Pagination
        showControls
        total={pageSize}
        initialPage={1}
        onChange={(page) => setCurrentPage(page)}
        variant="light"
        size="lg"
        className="flex items-center justify-center pt-24"
      />
    </>
  );
}
