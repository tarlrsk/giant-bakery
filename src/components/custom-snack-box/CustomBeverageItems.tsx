"use client";

import useSWR from "swr";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { Refreshment } from "@prisma/client";

import CustomItemCard from "./CustomItemCard";

// ----------------------------------------------------------------------

type Props = {
  cols: number;
  onClick: (selected: any) => void;
};

// ----------------------------------------------------------------------

export default function CustomBeverageItems({
  cols,
  onClick,
  ...other
}: Props) {
  const { getBeverages } = apiPaths();

  const { data } = useSWR(getBeverages(), fetcher, {
    revalidateOnFocus: false,
  });

  const items: Refreshment[] = data?.response?.data || [];

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-10 justify-center items-center mx-auto"
      {...other}
    >
      {Object.values(items)?.map((item: Refreshment) => (
        <CustomItemCard
          key={item.id}
          item={item}
          onClick={() => onClick(item)}
        />
      ))}
    </div>
  );
}
