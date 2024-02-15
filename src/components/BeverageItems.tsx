"use client";

import useSWR from "swr";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { useRouter } from "next/navigation";
import { Refreshment } from "@prisma/client";

import ProductCard from "./ProductCard";

export default function BeverageItems({
  size = "md",
  cols,
  onClick,
  ...other
}: {
  size?: "sm" | "md";
  cols: number;
  onClick?: (selected: any) => void;
}) {
  const router = useRouter();

  const { getBeverages } = apiPaths();

  const { data } = useSWR(getBeverages(), fetcher);

  const items: Refreshment[] = data?.response?.data || [];

  return (
    <div
      className={`grid grid-cols-${cols} gap-${
        size === "sm" ? 4 : 14
      } justify-center items-baseline`}
      {...other}
    >
      {Object.values(items)?.map((item: Refreshment) => (
        <ProductCard
          key={item.id}
          name={item.name}
          size={size}
          price={item.price}
          img={item.image ? `${item.image as string}` : "/"}
          onClick={
            onClick
              ? () => onClick(item)
              : () => router.push(`/beverages/${item.name}?${item.id}`)
          }
        />
      ))}
    </div>
  );
}
