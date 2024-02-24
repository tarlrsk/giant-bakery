"use client";

import useSWR from "swr";
import { Cake } from "@prisma/client";
import React, { useState } from "react";
import { fetcher } from "@/utils/axios";
import apiPaths from "@/utils/api-path";
import { useRouter } from "next/navigation";

import { Pagination, useDisclosure } from "@nextui-org/react";

import CakeCard from "./CakeCard";
import PresetCakeModal from "./modal/PresetCakeModal";
import CustomCakeModal from "./modal/CustomCakeModal";

export type ICakeType = "PRESET" | "CUSTOM" | "CAKE";

type Props = {
  size?: "sm" | "md";
  cols: number;
  type?: ICakeType;
  onClick?: (selected: any) => void;
};

export default function CakeItems({
  size = "md",
  cols,
  type,
  onClick,
  ...other
}: Props) {
  const router = useRouter();

  const [selectedCakeName, setSelectedCakeName] = useState<string>("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { getCakes } = apiPaths();

  const fetchPath = getCakes(type as string);

  const { data } = useSWR(fetchPath, fetcher);

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
        className={`grid grid-cols-${cols} gap-${
          size === "sm" ? 4 : 14
        } justify-center items-baseline hover:cursor-pointer`}
        {...other}
      >
        {Object.values(displayItems)?.map((item: Cake) => (
          <CakeCard
            key={item.id}
            item={item}
            size={size}
            onClick={() => {
              handleCardClick(item.id, item.name, item.type);
            }}
          />
        ))}
      </div>
      <Pagination
        showControls
        total={pageSize}
        initialPage={1}
        onChange={(page) => setCurrentPage(page)}
        variant="light"
        size="lg"
        className="flex items-center justify-center pt-24"
      />
      {type === "PRESET" && (
        <PresetCakeModal
          slug={selectedCakeName}
          isOpen={isOpen}
          onOpenChange={() => {
            router.push(`/cakes`, { scroll: false });
            onOpenChange();
          }}
        />
      )}
      {type === "CUSTOM" && (
        <CustomCakeModal
          slug={selectedCakeName}
          isOpen={isOpen}
          onOpenChange={() => {
            router.push(`/cakes`, { scroll: false });
            onOpenChange();
          }}
        />
      )}
    </>
  );
}
