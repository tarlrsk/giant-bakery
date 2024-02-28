"use client";

import useSWR from "swr";
import React, { useState } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { SnackBox } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Pagination } from "@nextui-org/react";

import SnackBoxCard from "./SnackBoxCard";

// ----------------------------------------------------------------------

type Props = {
  size?: "sm" | "md";
  cols: number;
  onClick?: (selected: any) => void;
};

export default function SnackBoxItems({
  size = "md",
  cols,
  onClick,
  ...other
}: Props) {
  const router = useRouter();

  const { getPresetSnackBox } = apiPaths();

  const { data } = useSWR(getPresetSnackBox(), fetcher);

  const items: SnackBox[] = data?.response?.data || [];

  const [currentPage, setCurrentPage] = useState(1);

  const snackBoxCount = items.length;

  const itemsPerPage = 4;
  const pageSize = Math.ceil(snackBoxCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayItems = items.slice(startIndex, endIndex);

  return (
    <>
      <div
        className={`grid grid-cols-${cols} gap-${
          size === "sm" ? 4 : 10
        } justify-center items-baseline`}
        {...other}
      >
        {Object.values(displayItems)?.map((item: any) => (
          <SnackBoxCard
            key={item.id}
            item={item}
            size={size}
            onClick={
              onClick
                ? () => onClick(item)
                : () => router.push(`/snack-boxes/${item.name}?id=${item.id}`)
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
