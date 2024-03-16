"use client";

import useSWR from "swr";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { useRouter } from "next/navigation";
import { Refreshment } from "@prisma/client";

import RefreshmentCard from "./RefreshmentCard";

// ----------------------------------------------------------------------

type Props = {
  cols: number;
};

// ----------------------------------------------------------------------

export default function BeverageItems({ cols, ...other }: Props) {
  const router = useRouter();

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
        <RefreshmentCard
          key={item.id}
          item={item}
          onClick={() => router.push(`/beverages/${item.name}?id=${item.id}`)}
        />
      ))}
    </div>
  );
}
