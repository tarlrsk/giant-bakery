"use client";

import useSWR from "swr";
import React, { useState } from "react";
import { fetcher } from "@/utils/axios";
import apiPaths from "@/utils/api-path";
import { useRouter } from "next/navigation";
import { Refreshment } from "@prisma/client";

import { Pagination } from "@nextui-org/react";

import ProductCard from "./ProductCard";
import { IBakeryCategory } from "./BakeryItems";

export type ICakeType = "PRESET" | "CUSTOM" | "CAKE";

type Props = {
  size?: "sm" | "md";
  cols: number;
  type?: ICakeType;
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

  const { getBakeries, getCakes } = apiPaths();

  const fetchPath =
    type === "PRESET" || type === "CUSTOM"
      ? getCakes(type as string)
      : getBakeries(type as IBakeryCategory);

  const { data } = useSWR(fetchPath, fetcher);

  const items: Refreshment[] = data?.response?.data || [];

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
                : type === "PRESET"
                  ? () =>
                      router.push(`/cakes/preset/${item.name}?id=${item.id}`)
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
