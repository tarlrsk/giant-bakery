"use client";

import useSWR from "swr";
import React from "react";
import { Cake } from "@prisma/client";
import { fetcher } from "@/utils/axios";
import apiPaths from "@/utils/api-path";

import CustomItemCard from "./CustomItemCard";

// ----------------------------------------------------------------------

export type ICakeType = "PRESET" | "CUSTOM" | "CAKE";

type Props = {
  size?: "sm" | "md";
  cols: number;
  type?: ICakeType;
  onClick: (selected: any) => void;
};

// ----------------------------------------------------------------------

export default function CustomCakeItems({
  size = "md",
  cols,
  type,
  onClick,
  ...other
}: Props) {
  const { getBakeries } = apiPaths();

  const { data } = useSWR(`${getBakeries("CAKE", "")}`, fetcher, {
    revalidateOnFocus: false,
  });

  const items: Cake[] = data?.response?.data || [];

  return (
    <>
      <div
        className="mx-auto grid grid-cols-2 items-center justify-center gap-4 pb-2 md:grid-cols-4 md:gap-5"
        {...other}
      >
        {Object.values(items)?.map((item: Cake) => (
          <CustomItemCard
            key={item.id}
            item={item}
            size={size}
            onClick={() => onClick(item)}
          />
        ))}
      </div>
    </>
  );
}
