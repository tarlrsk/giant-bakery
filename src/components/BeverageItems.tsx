"use client";

import useSWR from "swr";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { useRouter } from "next/navigation";
import { Refreshment } from "@prisma/client";

import RefreshmentCard from "./RefreshmentCard";

type Props = {
  size?: "sm" | "md";
  cols: number;
  onClick?: (selected: any) => void;
};

type IAddRefreshmentToCart = {
  userId: string;
  type: "CUSTOMER" | "GUEST";
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

export default function BeverageItems({
  size = "md",
  cols,
  onClick,
  ...other
}: Props) {
  const router = useRouter();

  const { getBeverages } = apiPaths();

  const { data } = useSWR(getBeverages(), fetcher);

  const items: Refreshment[] = data?.response?.data || [];

  return (
    <div
      className={`grid grid-cols-${cols} gap-${
        size === "sm" ? "4 pb-2" : "14"
      } justify-center items-baseline hover:cursor-pointer`}
      {...other}
    >
      {Object.values(items)?.map((item: Refreshment) => (
        <RefreshmentCard
          key={item.id}
          item={item}
          size={size}
          onClick={
            onClick
              ? () => onClick(item)
              : () => router.push(`/beverages/${item.name}?id=${item.id}`)
          }
        />
      ))}
    </div>
  );
}
