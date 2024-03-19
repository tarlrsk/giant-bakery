"use client";

import useSWR from "swr";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { useRouter } from "next/navigation";
import { Refreshment } from "@prisma/client";

import RefreshmentCard from "./RefreshmentCard";

// ----------------------------------------------------------------------

type Props = {
  onClick?: (selected: any) => void;
};

export default function BestSellerItems({ onClick, ...other }: Props) {
  const router = useRouter();

  const { getBakeries } = apiPaths();

  const { data } = useSWR(`${getBakeries("", "4")}`, fetcher, {
    revalidateOnFocus: false,
  });

  const items: Refreshment[] = data?.response?.data || [];

  return (
    <div
      className={`mx-auto grid grid-cols-2 items-center justify-center gap-5 md:grid-cols-2 md:gap-10 lg:grid-cols-3 2xl:grid-cols-4`}
      {...other}
    >
      {Object.values(items)?.map((item: any) => (
        <RefreshmentCard
          key={item.id}
          item={item}
          onClick={() => {
            router.push(`/bakeries/${item.name}?id=${item.id}`);
          }}
        />
      ))}
    </div>
  );
}
