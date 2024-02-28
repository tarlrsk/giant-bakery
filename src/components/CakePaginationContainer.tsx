"use client";

import React, { useState } from "react";

import CakeItems, { ICakeType } from "./CakeItems";
import CustomCakeContainer from "./CustomCakeContainer";

type Props = {
  type: ICakeType;
};

export default function CakePaginationContainer({ type }: Props) {
  const [selectedType, setSelectedType] = useState<ICakeType>();

  if (!selectedType && type) {
    setSelectedType(type);
  }

  return (
    <div className="relative">
      <div className="px-36 pb-8">
        <div className=" flex flex-row justify-between items-center pb-24 text-5xl font-normal">
          {type === "PRESET" && "เค้กสำเร็จรูป (ปอนด์)"}
          {type === "CAKE" && "เค้กสำเร็จรูป (ชิ้น)"}
          {type === "CUSTOM" && "เค้กแต่งเอง"}
          {type === "PRESET" && <CustomCakeContainer />}
        </div>
        <div className="container pr-6">
          <CakeItems cols={4} type={selectedType} />
        </div>
      </div>
    </div>
  );
}
