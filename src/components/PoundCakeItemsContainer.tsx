"use client";

import useSWR from "swr";
import { Cake } from "@prisma/client";
import React, { useState } from "react";
import { fetcher } from "@/utils/axios";
import apiPaths from "@/utils/api-path";
import { useRouter } from "next/navigation";

import { useDisclosure } from "@nextui-org/react";

import CakeCard from "./CakeCard";
import PresetCakeModal from "./modal/PresetCakeModal";

// ----------------------------------------------------------------------

type PoundCakeItemsContainerProps = {
  isPoundCakePage?: boolean;
};

type PoundCakeItemsProps = {
  onClick?: (selected: any) => void;
  isPoundCakePage?: boolean;
};

// ----------------------------------------------------------------------

export default function PoundCakeItemsContainer({
  isPoundCakePage = false,
}: PoundCakeItemsContainerProps) {
  const router = useRouter();

  return (
    <div className="relative min-h-[300px] pb-8">
      <div className=" flex flex-row items-center justify-between pb-10 text-2xl font-normal  md:text-4xl">
        เค้กสำเร็จรูป (ปอนด์)
        {!isPoundCakePage && (
          <div
            className=" cursor-pointer text-lg font-semibold text-secondaryT-main md:text-xl"
            onClick={() => router.push("/cakes/pound")}
          >
            {`ดูทั้งหมด >`}
          </div>
        )}
      </div>
      <PoundCakeItems isPoundCakePage={isPoundCakePage} />
    </div>
  );
}

// ----------------------------------------------------------------------

function PoundCakeItems({
  onClick,
  isPoundCakePage = false,
  ...other
}: PoundCakeItemsProps) {
  const router = useRouter();

  const [selectedCakeName, setSelectedCakeName] = useState<string>("");

  const { getCakes } = apiPaths();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data, isLoading } = useSWR(getCakes("PRESET"), fetcher, {
    revalidateOnFocus: false,
  });

  const items: Cake[] = data?.response?.data || [];

  // const [currentPage, setCurrentPage] = useState(1);

  // const itemsPerPage = 4;
  // const cakeCount = items.length;
  // const pageSize = Math.ceil(cakeCount / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  const displayItems = isPoundCakePage ? items : items.slice(0, 4);

  const handleCardClick = (id: string, itemName: string) => {
    if (isPoundCakePage) {
      router.replace(`/cakes/pound?id=${id}&slug=${itemName}&type=PRESET`, {
        scroll: false,
      });
    } else {
      router.replace(`/cakes?id=${id}&slug=${itemName}&type=PRESET`, {
        scroll: false,
      });
    }

    setSelectedCakeName(itemName);
    onOpen();
  };

  if (items?.length === 0 && !isLoading) {
    return (
      <div className=" mx-auto my-16 w-fit rounded-sm bg-primaryT-lighter px-10 py-4 text-center text-xl">
        ยังไม่มีสินค้าขณะนี้
      </div>
    );
  }

  return (
    <>
      <div
        className={`mx-auto grid grid-cols-2 items-center justify-center gap-5 md:grid-cols-2 md:gap-10 lg:grid-cols-3 2xl:grid-cols-4`}
        {...other}
      >
        {displayItems?.map((item: Cake) => (
          <CakeCard
            key={item.id}
            item={item}
            onClick={() => {
              handleCardClick(item.id, item.name);
            }}
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
      <PresetCakeModal
        slug={selectedCakeName}
        isOpen={isOpen}
        onOpenChange={() => {
          if (isPoundCakePage) {
            router.push(`/cakes/pound`, { scroll: false });
          } else {
            router.push(`/cakes`, { scroll: false });
          }
          onOpenChange();
        }}
      />
    </>
  );
}
