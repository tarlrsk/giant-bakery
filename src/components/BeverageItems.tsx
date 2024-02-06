"use client";

import { useRouter } from "next/navigation";
import { Refreshment } from "@prisma/client";
import React, { useState, useEffect } from "react";
import { getAllBeverages } from "@/actions/beverageActions";

import ProductCard from "./ProductCard";

export default function BeverageItems({
  size = "md",
  cols,
  onClick,
  ...other
}: {
  size?: "sm" | "md";
  cols: number;
  onClick?: (selected?: string) => void;
}) {
  const router = useRouter();

  const [items, setItems] = useState<Refreshment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllBeverages();
        setItems(res?.response.data ?? []);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className={`grid grid-cols-${cols} gap-${
        size === "sm" ? 7 : 14
      } justify-center items-center`}
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
              ? () => onClick(item.id)
              : () => router.push(`/bakery/${item.name}`)
          }
        />
      ))}
    </div>
  );
}
