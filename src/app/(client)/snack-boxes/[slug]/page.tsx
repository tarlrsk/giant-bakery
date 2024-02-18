"use client";

import useSWR from "swr";
import React from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { SnackBox } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";

type Props = {
  params: {
    slug: string;
  };
};

export default function SnackBoxDetail({ params }: Props) {
  const searchParams = useSearchParams();

  const id = searchParams.get("id") as string;
  const { slug } = params;

  const decodedSlug = decodeURIComponent(slug) as string;

  const { getPresetSnackBoxBySlug } = apiPaths();

  const { data } = useSWR(getPresetSnackBoxBySlug(decodedSlug, id), fetcher);

  const item: SnackBox = data?.response?.data || {};

  return (
    <div className="flex w-auto h-auto items-center justify-center p-[9.1rem]">
      <ProductDetail
        name={item.name}
        description={item.description}
        weight={item.weight?.toFixed(2)}
        currQty={0}
        price={item.price?.toFixed(2)}
      />
    </div>
  );
}
