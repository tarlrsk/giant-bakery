"use client";

import useSWR from "swr";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { Refreshment } from "@prisma/client";

import CustomItemCard from "./CustomItemCard";

// ----------------------------------------------------------------------

export type IBakeryCategory =
  | "BREAD"
  | "PIE"
  | "COOKIE"
  | "SNACK"
  | "CAKE"
  | "";

type Props = {
  amount?: string;
  cols: number;
  category?: IBakeryCategory;
  onClick: (selected: any) => void;
};

export default function CustomBakeryItems({
  amount,
  cols,
  category,
  onClick,
  ...other
}: Props) {
  const { getBakeries } = apiPaths();

  const { data } = useSWR(
    `${getBakeries(category as IBakeryCategory, amount)}`,
    fetcher,
    { revalidateOnFocus: false },
  );

  const items: Refreshment[] = data?.response?.data || [];

  return (
    <div
      className={`mx-auto grid grid-cols-2 items-center justify-center gap-5 md:grid-cols-3 md:gap-10 2xl:grid-cols-4`}
      {...other}
    >
      {Object.values(items)?.map((item: any) => (
        <CustomItemCard
          key={item.id}
          item={item}
          onClick={() => onClick(item)}
        />
      ))}
    </div>
  );
}
