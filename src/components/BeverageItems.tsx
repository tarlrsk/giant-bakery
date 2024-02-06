"use client";

import { useRouter } from "next/navigation";
import { Refreshment } from "@prisma/client";
import React, { useState, useEffect } from "react";
import { getAllBeverages } from "@/actions/beverageActions";

import ProductCard from "./ProductCard";

export default function BeverageItems() {
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
    <div className="relative flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-20">
        <div className="grid grid-cols-5 gap-24 pb-28">
          {Object.values(items)?.map((item: Refreshment) => (
            <ProductCard
              key={item.id}
              name={item.name}
              price={item.price}
              img={item.image ? `${item.image as string}` : "/"}
              onClick={() => router.push(`/bakery/${item.name}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
