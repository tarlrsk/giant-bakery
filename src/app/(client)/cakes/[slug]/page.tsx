"use client";

import useSWR from "swr";
import toast from "react-hot-toast";
import React, { useState } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { Refreshment } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { addItemToCart } from "@/actions/cartActions";
import ProductDetail from "@/components/ProductDetail";

// ----------------------------------------------------------------------

type CakeDetailParams = {
  params: {
    slug: string;
  };
};

// ----------------------------------------------------------------------

export default function CakeDetail({ params }: CakeDetailParams) {
  const searchParams = useSearchParams();

  const id = searchParams.get("id") as string;
  const { slug } = params;

  const decodedSlug = decodeURIComponent(slug) as string;

  const { getBakeryBySlug, addRefreshmentToCart } = apiPaths();

  const { data } = useSWR(`${getBakeryBySlug(decodedSlug, id)}`, fetcher);

  const item: Refreshment = data?.response?.data || {};

  const [counter, setCounter] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: any) => {
    let inputValue = e.target.value;
    inputValue =
      isNaN(inputValue) || inputValue === "" ? 1 : parseInt(inputValue, 10);
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
      toast.success("ใส่ตระก้าสำเร็จ");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setIsLoading(false);
  }

  return (
    <div className="flex w-auto h-auto items-center justify-center p-[9.1rem]">
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
