"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Tab, Tabs } from "@nextui-org/react";

import BakeryItems, { IBakeryCategory } from "./BakeryItems";

const TAB_ITEMS = [
  { key: "", title: "ทั้งหมด" },
  { key: "BREAD", title: "ขนมปัง" },
  { key: "COOKIE", title: "คุ้กกี้" },
  { key: "PIE", title: "พาย" },
  { key: "SNACK", title: "ขนมทานเล่น" },
];

export default function BakeryTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bakeryCategory = searchParams.get("category") as IBakeryCategory;

  const handleTabSelectionChange = (selectedCategory: IBakeryCategory) => {
    router.push(`/bakeries?category=${selectedCategory}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-20">
      <Tabs
        variant={"underlined"}
        aria-label="Tabs"
        items={TAB_ITEMS}
        selectedKey={bakeryCategory}
        onSelectionChange={(e) =>
          handleTabSelectionChange(e as IBakeryCategory)
        }
      >
        {TAB_ITEMS.map((item) => (
          <Tab
            key={item.key}
            title={item.title}
            className="flex justify-center items-center text-center text-2xl text-primaryT-darker font-semibold w-28 mx-8"
          ></Tab>
        ))}
      </Tabs>
      <div className="container px-6 pb-40">
        <BakeryItems cols={4} category={bakeryCategory} />
      </div>
    </div>
  );
}
