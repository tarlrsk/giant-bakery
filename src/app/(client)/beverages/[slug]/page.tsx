"use client";

import useSWR from "swr";
import React from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { Refreshment } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";

type BeverageDetailParams = {
  params: {
    slug: string;
  };
};

export default function BeverageDetail({ params }: BeverageDetailParams) {
  const searchParams = useSearchParams();

  const id = searchParams.get("id") as string;
  const { slug } = params;

  const decodedSlug = decodeURIComponent(slug) as string;

  const { getBeverageBySlug } = apiPaths();

  const { data } = useSWR(`${getBeverageBySlug(decodedSlug, id)}`, fetcher);

  const item: Refreshment = data?.response?.data || {};

  return (
    <div className="flex w-auto h-auto items-center justify-center p-[9.1rem]">
      <ProductDetail
        name={item.name}
        description={item.description ?? ""}
        image={item.image as string}
        weight={item.weight?.toFixed(2)}
        currQty={item.currQty}
        price={item.price?.toFixed(2)}
      />
    </div>
  );
}
