"use client";

import React from "react";

import RefreshmentCakeItems from "./RefreshmentCakeItems";

export default function RefreshmentCakePaginationContainer() {
  return (
    <div className="relative">
      <div className="px-36 pb-8">
        <div className="pb-24 text-5xl font-normal">เค้กสำเร็จรูป (ชิ้น)</div>
        <div className="container pr-6">
          <RefreshmentCakeItems cols={4} />
        </div>
      </div>
    </div>
  );
}
