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
  type?: ICakeType;
  onClick: (selected: any) => void;
};

// ----------------------------------------------------------------------

export default function CustomCakeItems({ type, onClick, ...other }: Props) {
  const { getBakeries } = apiPaths();

  const { data } = useSWR(`${getBakeries("CAKE", "")}`, fetcher, {
    revalidateOnFocus: false,
  });

  const items: Cake[] = data?.response?.data || [];

  return (
    <div
      className={`mx-auto grid grid-cols-2 items-center justify-center gap-5 md:grid-cols-3 md:gap-10 2xl:grid-cols-4`}
      {...other}
    >
      {Object.values(items)?.map((item: Cake) => (
        <CustomItemCard
          key={item.id}
          item={item}
          onClick={() => onClick(item)}
        />
      ))}
    </div>
  );
}
