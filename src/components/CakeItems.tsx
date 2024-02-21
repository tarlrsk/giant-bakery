"use client";

import useSWR from "swr";
import { Cake } from "@prisma/client";
import React, { useState } from "react";
import { fetcher } from "@/utils/axios";
import apiPaths from "@/utils/api-path";

import { Pagination } from "@nextui-org/react";

import CakeCard from "./CakeCard";

export type ICakeType = "PRESET" | "CUSTOM" | "CAKE";

type Props = {
  size?: "sm" | "md";
  cols: number;
  type?: ICakeType;
  onClick?: (selected: any) => void;
};

type IAddRefreshmentToCart = {
  userId: string;
  type: "MEMBER" | "GUEST";
  refreshmentId: string;
  quantity: number;
};

async function sendAddSnackBoxRequest(
  url: string,
  { arg }: { arg: IAddRefreshmentToCart },
) {
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export default function CakeItems({
  size = "md",
  cols,
  type,
  onClick,
  ...other
}: Props) {
  const { getCakes } = apiPaths();

  const fetchPath = getCakes(type as string);

  const { data } = useSWR(fetchPath, fetcher);

  const items: Cake[] = data?.response?.data || [];

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
        {Object.values(displayItems)?.map((item: Cake) => (
          <CakeCard key={item.id} item={item} size={size} onClick={() => {}} />
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
