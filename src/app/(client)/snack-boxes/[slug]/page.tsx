"use client";

import useSWR from "swr";
import toast from "react-hot-toast";
import React, { useState } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { SnackBox } from "@prisma/client";
import { addItemToCart } from "@/actions/cartActions";
import SnackBoxDetail from "@/components/SnackBoxDetail";
import { useRouter, useSearchParams } from "next/navigation";

// ----------------------------------------------------------------------

type Props = {
  params: {
    slug: string;
  };
};

// ----------------------------------------------------------------------

export default function SnackBoxDetailPage({ params }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const id = searchParams.get("id") as string;
  const { slug } = params;

  const decodedSlug = decodeURIComponent(slug) as string;

  const { getPresetSnackBoxBySlug, addPresetSnackBoxToCart } = apiPaths();

  const { data } = useSWR(getPresetSnackBoxBySlug(decodedSlug, id), fetcher);

  const item: SnackBox = data?.response?.data || {};

  const [counter, setCounter] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: any) => {
    let inputValue = e.target.value;
    inputValue =
      isNaN(inputValue) || inputValue === "" ? 1 : parseInt(inputValue, 10);
    inputValue = Math.min(Math.max(inputValue, 1), 999);
    setCounter(inputValue);
  };

  const decrement = () => {
    if (counter > 1) setCounter(counter - 1);
  };

  const increment = () => {
    if (counter < 999) setCounter(counter + 1);
  };

  async function handleAddToCart() {
    setIsLoading(true);
    try {
      await addItemToCart(addPresetSnackBoxToCart(), item.id, counter);
      toast.success("ใส่ตะกร้าสำเร็จ");
      router.push("/cart");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setIsLoading(true);
  }

  return (
    <div className="flex h-auto w-auto items-center justify-center p-[9.1rem]">
      <SnackBoxDetail
        item={item}
        counter={counter}
        isLoading={isLoading}
        onClick={() => {
          handleAddToCart();
        }}
        onChange={handleInputChange}
        onIncrement={increment}
        onDecrement={decrement}
      />
    </div>
  );
}
