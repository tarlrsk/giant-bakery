"use client";

import useSWR from "swr";
import { useState } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { useRouter } from "next/navigation";
import { Refreshment } from "@prisma/client";

import { Pagination } from "@nextui-org/react";

import RefreshmentCard from "./RefreshmentCard";

// ----------------------------------------------------------------------

type Props = {
  size?: "sm" | "md";
  amount?: string;
  cols: number;
  onClick?: (selected: any) => void;
};

export default function BakeryItems({
  size = "md",
  amount,
  cols,
  onClick,
  ...other
}: Props) {
  const router = useRouter();

  const { getBakeries } = apiPaths();

  const { data } = useSWR(`${getBakeries("CAKE", amount)}`, fetcher);

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
          size === "sm" ? 4 : 10
        } justify-center items-baseline hover:cursor-pointer`}
        {...other}
      >
        {Object.values(displayItems)?.map((item: any) => (
          <RefreshmentCard
            key={item.id}
            item={item}
            size={size}
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
