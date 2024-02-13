"use client";

import { Cake } from "@prisma/client";
import { useRouter } from "next/navigation";
import { getCakes } from "@/actions/cakeActions";
import React, { useState, useEffect } from "react";

import { Pagination } from "@nextui-org/react";

import ProductCard from "./ProductCard";

type Props = {
  cakeType: "PRESET" | "CUSTOM";
};

export default function CakePaginationContainer({ cakeType }: Props) {
  const router = useRouter();

  const [selectedType, setSelectedType] = useState<any>();
  const [cakeData, setCakeData] = useState<Cake[]>([]);
  const [cakeCount, setCakeCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSelectedType(cakeType);
        const res = await getCakes(selectedType);
        setCakeData(res?.response.data ?? []);
        setCakeCount(cakeData.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [cakeData.length, cakeType, selectedType]);

  const itemsPerPage = 5;
  const pageSize = Math.ceil(cakeCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const cakesToDisplay = cakeData.slice(startIndex, endIndex);

  return (
    <div className="relative">
      <div className="px-36 pb-20">
        <div className="pb-28 text-5xl font-normal">
          {cakeType === "PRESET" ? "เค้กสำเร็จรูป" : "เค้กแต่งเอง"}
        </div>
        <div className="grid grid-cols-5 gap-20">
          {cakesToDisplay.map((cake) => (
            <ProductCard
              key={cake.id}
              name={cake.name}
              price={cake.price}
              img={cake.image as string}
              onClick={() => router.push(`/cakes/${cake.name}?${cake.id}`)}
            />
          ))}
        </div>
      </div>
      <Pagination
        showControls
        total={pageSize}
        initialPage={1}
        onChange={(page) => setCurrentPage(page)}
        variant="light"
        size="lg"
        className="flex items-center justify-center"
      />
    </div>
  );
}
