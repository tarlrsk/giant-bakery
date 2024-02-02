"use client";

import { Refreshment } from "@prisma/client";
import React, { useState, useEffect } from "react";
import { getBakeryByCategory } from "@/actions/bakeryActions";

import { Tab, Tabs } from "@nextui-org/react";

import ProductCard from "./ProductCard";

const TAB_ITEMS = [
  { key: "", title: "All" },
  { key: "BREAD", title: "Bread" },
  { key: "PIE", title: "Pie" },
  { key: "COOKIE", title: "Cookie" },
  { key: "SNACK", title: "Snack" },
];

export default function BakeryTab() {
  const [selectedCategory, setSelectedCategory] = useState<any>("");
  const [bakeryData, setBakeryData] = useState<Refreshment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBakeryByCategory(selectedCategory);
        setBakeryData(res?.response.data ?? []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedCategory]);

  return (
    <div className="flex flex-col justify-center items-center gap-20">
      <Tabs
        variant={"underlined"}
        aria-label="Tabs"
        items={TAB_ITEMS}
        selectedKey={selectedCategory}
        onSelectionChange={setSelectedCategory}
      >
        {TAB_ITEMS.map((item) => (
          <Tab
            key={item.key}
            title={item.title}
            className="flex justify-center items-center text-center text-2xl text-primaryT-darker font-semibold w-28 mx-8"
          ></Tab>
        ))}
      </Tabs>
      <div className="grid grid-cols-5 gap-24 pb-24">
        {Object.values(bakeryData)?.map((item: Refreshment) => (
          <ProductCard
            key={item.id}
            name={item.name}
            price={item.price}
            img={item.image ? `${item.image as string}` : "/"}
          />
        ))}
      </div>
    </div>
  );
}
