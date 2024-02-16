"use client";

import React, { useState } from "react";

import CakeItems from "./CakeItems";

type Props = {
  cakeType: "PRESET" | "CUSTOM";
};

export default function CakePaginationContainer({ cakeType }: Props) {
  const [selectedType, setSelectedType] = useState<any>();

  if (!selectedType && cakeType) {
    setSelectedType(cakeType);
  }

  return (
    <div className="relative">
      <div className="px-36 pb-8">
        <div className="pb-24 text-5xl font-normal">
          {cakeType === "PRESET" ? "เค้กสำเร็จรูป" : "เค้กแต่งเอง"}
        </div>
        <div className="container pr-6">
          <CakeItems cols={4} type={selectedType} />
        </div>
      </div>
    </div>
  );
}
