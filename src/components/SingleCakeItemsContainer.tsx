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
    <div className="relative md:px-36 pb-8">
      <div className="pb-10 flex flex-row justify-between items-center">
        <div className="text-2xl md:text-4xl font-normal">
          เค้กสำเร็จรูป (ชิ้น)
        </div>
        {!isSingleCakePage && (
          <div
            className="text-lg md:text-xl text-secondaryT-main font-semibold cursor-pointer"
            onClick={() => router.push("/cakes/single")}
          >
            {`ดูทั้งหมด >`}
          </div>
        )}
      </div>
      <div className="container pr-6">
        <RefreshmentCakeItems limitItems={limitItems} cols={4} />
      </div>
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
        className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-10 justify-center items-center mx-auto"
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
