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

export type ICakeType = "PRESET" | "CUSTOM" | "CAKE";

type Props = {
  size?: "sm" | "md";
  cols: number;
  onClick?: (selected: any) => void;
};

// ----------------------------------------------------------------------

export default function CakeItems({
  size = "md",
  cols,
  onClick,
  ...other
}: Props) {
  const router = useRouter();

  const [selectedCakeName, setSelectedCakeName] = useState<string>("");

  const { getCakes } = apiPaths();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchPath = getCakes("PRESET");

  const { data } = useSWR(fetchPath, fetcher, { revalidateOnFocus: false });

  const items: Cake[] = data?.response?.data || [];

  const [currentPage, setCurrentPage] = useState(1);

  const cakeCount = items.length;

  const itemsPerPage = 4;
  const pageSize = Math.ceil(cakeCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayItems = items.slice(startIndex, endIndex);

  const handleCardClick = (id: string, itemName: string, type: string) => {
    if (type === "PRESET") {
      router.replace(`/cakes?id=${id}&slug=${itemName}&type=PRESET`, {
        scroll: false,
      });
    } else {
      router.replace(`/cakes?id=${id}&slug=${itemName}&type=CUSTOM`, {
        scroll: false,
      });
    }
    setSelectedCakeName(itemName);
    onOpen();
  };

  return (
    <>
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-10 justify-center items-center mx-auto"
        {...other}
      >
        {Object.values(displayItems)?.map((item: Cake) => (
          <CakeCard
            key={item.id}
            item={item}
            onClick={() => {
              handleCardClick(item.id, item.name, item.type);
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
          router.push(`/cakes`, { scroll: false });
          onOpenChange();
        }}
      />
    </>
  );
}
