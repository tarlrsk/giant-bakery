"use client";

import useSWR from "swr";
import React from "react";
import { Cake } from "@prisma/client";
import { fetcher } from "@/utils/axios";
import apiPaths from "@/utils/api-path";

import CakeCard from "./CakeCard";

// ----------------------------------------------------------------------

export type ICakeType = "PRESET" | "CUSTOM" | "CAKE";

type Props = {
  size?: "sm" | "md";
  cols: number;
  type?: ICakeType;
  onClick: (selected: any) => void;
};

// ----------------------------------------------------------------------

export default function CakePieceItems({
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
        className={`grid grid-cols-${cols} gap-${
          size === "sm" ? "4 pb-2" : "10"
        } justify-center items-baseline`}
        {...other}
      >
        {Object.values(items)?.map((item: Cake) => (
          <CakeCard
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
