"use client";

import useSWR from "swr";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { fetcher } from "@/utils/axios";
import apiPaths from "@/utils/api-path";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { Cake, Refreshment } from "@prisma/client";
import getCurrentUser from "@/actions/userActions";

import { Pagination } from "@nextui-org/react";

import { IBakeryCategory } from "./BakeryItems";
import RefreshmentCard from "./RefreshmentCard";

export type ICakeType = "PRESET" | "CUSTOM" | "CAKE";

type Props = {
  size?: "sm" | "md";
  cols: number;
  type?: ICakeType;
  onClick?: (selected: any) => void;
};

type IAddRefreshmentToCart = {
  userId: string;
  type: "MEMBER" | "GUEST";
  refreshmentId: string;
  quantity: number;
};

async function sendAddSnackBoxRequest(
  url: string,
  { arg }: { arg: IAddRefreshmentToCart },
) {
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export default function CakeItems({
  size = "md",
  cols,
  type,
  onClick,
  ...other
}: Props) {
  const router = useRouter();

  const { getBakeries, getCakes, addRefreshmentToCart } = apiPaths();

  const fetchPath =
    type === "PRESET" || type === "CUSTOM"
      ? getCakes(type as string)
      : getBakeries(type as IBakeryCategory);

  const { data } = useSWR(fetchPath, fetcher);

  const items: Refreshment[] = data?.response?.data || [];

  const { trigger: triggerAddToCart, isMutating: isMutatingAddToCart } =
    useSWRMutation(addRefreshmentToCart(), sendAddSnackBoxRequest);

  async function handleAddToCart(itemId: string) {
    const currentUser = await getCurrentUser();

    const body: IAddRefreshmentToCart = {
      userId: currentUser?.id || "",
      type: currentUser?.role === "CUSTOMER" ? "MEMBER" : "GUEST",
      refreshmentId: itemId,
      quantity: 1,
    };

    try {
      await triggerAddToCart(body);
      toast.success("ใส่ตะกร้าาสำเร็จ");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  }

  const [currentPage, setCurrentPage] = useState(1);

  const cakeCount = items.length;

  const itemsPerPage = 4;
  const pageSize = Math.ceil(cakeCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayItems = items.slice(startIndex, endIndex);

  return (
    <>
      <div
        className={`grid grid-cols-${cols} gap-${
          size === "sm" ? 4 : 14
        } justify-center items-baseline hover:cursor-pointer`}
        {...other}
      >
        {Object.values(displayItems)?.map((item: Refreshment | Cake) => (
          <RefreshmentCard
            key={item.id}
            item={type === "CAKE" ? (item as Refreshment) : (item as Cake)}
            size={size}
            onClick={
              onClick
                ? () => onClick(item)
                : type === "PRESET"
                  ? () =>
                      router.push(`/cakes/preset/${item.name}?id=${item.id}`)
                  : type === "CAKE"
                    ? () => router.push(`/cakes/${item.name}?id=${item.id}`)
                    : () => {}
            }
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
