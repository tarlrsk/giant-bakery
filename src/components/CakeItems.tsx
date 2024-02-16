"use client";

import useSWR from "swr";
import React, { useState } from "react";
import { fetcher } from "@/utils/axios";
import apiPaths from "@/utils/api-path";
import { useRouter } from "next/navigation";
import { Refreshment } from "@prisma/client";

import { Pagination } from "@nextui-org/react";

import ProductCard from "./ProductCard";

type Props = {
  size?: "sm" | "md";
  cols: number;
  type: "PRESET" | "CUSTOM";
  onClick?: (selected: any) => void;
};

export default function CakeItems({
  size = "md",
  cols,
  type,
  onClick,
  ...other
}: Props) {
  const router = useRouter();

  const { getCakes } = apiPaths();

  const { data } = useSWR(`${getCakes()}${type}`, fetcher);

  const items: Refreshment[] = data?.response?.data || [];

  const [currentPage, setCurrentPage] = useState(1);

  const cakeCount = items.length;

  const itemsPerPage = 5;
  const pageSize = Math.ceil(cakeCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayItems = items.slice(startIndex, endIndex);

  return (
    <>
      <div
        className={`grid grid-cols-${cols} gap-${
          size === "sm" ? 4 : 14
        } justify-center items-baseline`}
        {...other}
      >
        {Object.values(displayItems)?.map((item: Refreshment) => (
          <ProductCard
            key={item.id}
            name={item.name}
            size={size}
            price={item.price}
            img={item.image ? `${item.image as string}` : "/"}
            onClick={
              onClick
                ? () => onClick(item)
                : () => router.push(`/cakes/${item.name}?id=${item.id}`)
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
