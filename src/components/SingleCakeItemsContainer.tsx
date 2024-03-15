"use client";

import useSWR from "swr";
import React from "react";
import { useState } from "react";
import apiPaths from "@/utils/api-path";
import { fetcher } from "@/utils/axios";
import { useRouter } from "next/navigation";
import { Refreshment } from "@prisma/client";

// import { Pagination } from "@nextui-org/react";

import RefreshmentCard from "./RefreshmentCard";

// ----------------------------------------------------------------------

type SingleCakeItemsContainerProps = {
  limitItems?: number;
  isSingleCakePage?: boolean;
};

type RefreshmentCakeItemsProps = {
  cols: number;
  limitItems?: number;
};

// ----------------------------------------------------------------------

export default function SingleCakeItemsContainer({
  limitItems,
  isSingleCakePage = false,
}: SingleCakeItemsContainerProps) {
  const router = useRouter();
  return (
    <div className="relative pb-8 md:px-36">
      <div className="flex flex-row items-center justify-between pb-10">
        <div className="text-2xl font-normal md:text-4xl">
          เค้กสำเร็จรูป (ชิ้น)
        </div>
        {!isSingleCakePage && (
          <div
            className="cursor-pointer text-lg font-semibold text-secondaryT-main md:text-xl"
            onClick={() => router.push("/cakes/single")}
          >
            {`ดูทั้งหมด >`}
          </div>
        )}
      </div>
      <RefreshmentCakeItems limitItems={limitItems} cols={4} />
    </div>
  );
}

// ----------------------------------------------------------------------

function RefreshmentCakeItems({
  cols,
  limitItems,
  ...other
}: RefreshmentCakeItemsProps) {
  const router = useRouter();

  const { getBakeries } = apiPaths();

  const { data } = useSWR(
    `${getBakeries("CAKE", limitItems?.toString() || "")}`,
    fetcher,
  );

  const items: Refreshment[] = data?.response?.data || [];

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
        className="mx-auto grid grid-cols-2 items-center justify-center gap-5 md:grid-cols-4 md:gap-10"
        {...other}
      >
        {Object.values(displayItems)?.map((item: any) => (
          <RefreshmentCard
            key={item.id}
            item={item}
            onClick={() =>
              router.push(`/cakes/single/${item.name}?id=${item.id}`)
            }
          />
        ))}
      </div>
      {/* <Pagination
        showControls
        total={pageSize}
        initialPage={1}
        onChange={(page) => setCurrentPage(page)}
        variant="light"
        size="lg"
        className="flex items-center justify-center pt-24"
      /> */}
    </>
  );
}
