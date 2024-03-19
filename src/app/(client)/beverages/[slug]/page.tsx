"use client";

import useSWR from "swr";
import toast from "react-hot-toast";
import React, { useState } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { Refreshment } from "@prisma/client";
import { addItemToCart } from "@/actions/cartActions";
import ProductDetail from "@/components/ProductDetail";
import { useRouter, useSearchParams } from "next/navigation";

type BeverageDetailParams = {
  params: {
    slug: string;
  };
};

type IAddRefreshmentToCart = {
  userId: string;
  type: "CUSTOMER" | "GUEST";
  refreshmentId: string;
  quantity: number;
};

async function sendAddRefreshmentRequest(
  url: string,
  { arg }: { arg: IAddRefreshmentToCart },
) {
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export default function BeverageDetail({ params }: BeverageDetailParams) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  const id = searchParams.get("id") as string;

  const { slug } = params;

  const decodedSlug = decodeURIComponent(slug) as string;

  const { getBeverageBySlug, addRefreshmentToCart } = apiPaths();

  const { data } = useSWR(`${getBeverageBySlug(decodedSlug, id)}`, fetcher);

  const item: Refreshment = data?.response?.data || {};

  const [counter, setCounter] = useState(1);

  const handleInputChange = (e: any) => {
    let inputValue = e.target.value;
    inputValue =
      isNaN(inputValue) || inputValue === "" ? 1 : parseInt(inputValue, 10);

    if (isNaN(inputValue) || inputValue < 1) {
      inputValue = 1;
    } else if (inputValue > item.currQty) {
      return;
    }

    inputValue = Math.min(Math.max(inputValue, 1), item.currQty);
    setCounter(inputValue);
  };

  const decrement = () => {
    if (counter > 1) setCounter(counter - 1);
  };

  const increment = () => {
    if (counter < item.currQty) setCounter(counter + 1);
  };

  async function handleAddToCart() {
    setIsLoading(true);
    try {
      await addItemToCart(addRefreshmentToCart(), item.id, counter);
      toast.success("ใส่ตะกร้าสำเร็จ");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setIsLoading(false);
  }

  return (
    <div className="flex h-auto w-auto items-center justify-center p-36">
      <ProductDetail
        item={item}
        counter={counter}
        isLoading={isLoading}
        onClick={handleAddToCart}
        onChange={handleInputChange}
        onIncrement={increment}
        onDecrement={decrement}
      />
    </div>
  );
}
