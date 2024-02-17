"use client";

import useSWR from "swr";
import React from "react";
import { Cake } from "@prisma/client";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { useSearchParams } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";

type CakeDetailParams = {
  params: {
    slug: string;
  };
};

export default function CakeDetail({ params }: CakeDetailParams) {
  const searchParams = useSearchParams();

  const id = searchParams.get("id") as string;
  const { slug } = params;

  const decodedSlug = decodeURIComponent(slug) as string;

  const { getCakeBySlug } = apiPaths();

  const { data } = useSWR(`${getCakeBySlug(decodedSlug, id)}`, fetcher);

  const item: Cake = data?.response?.data || {};

  return (
    <div className="flex w-auto h-auto items-center justify-center p-[9.1rem]">
      <ProductDetail
        name={item.name}
        description={item.remark}
        image={item.image as string}
        weight={item.weight?.toFixed(2)}
        price={item.price?.toFixed(2)}
        currQty={item.quantity}
      />
    </div>
  );
}
