"use client";

import React from "react";
import TitleSection from "@/components/TitleSection";

import { Tab, Tabs } from "@nextui-org/react";

const TAB_ITEMS = [
  { key: "all", title: "All" },
  { key: "bread", title: "Bread" },
  { key: "pie", title: "Pie" },
  { key: "cookie", title: "Cookie" },
  { key: "snack", title: "Snack" },
];

export default function BakeryPage() {
  return (
    <section>
      <TitleSection title={"เบเกอรี่"} />
      <div className="relative flex flex-col justify-center items-center pt-5 pb-24">
        <div className="relative flex">
          <Tabs
            variant={"underlined"}
            aria-label="Tabs variants"
            items={TAB_ITEMS}
          >
            {(item) => (
              <Tab
                key={item.key}
                title={item.title}
                className="text-2xl font-semibold px-12"
              />
            )}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
