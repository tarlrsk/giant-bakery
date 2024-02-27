"use client";

import SnackBoxItems from "./SnackBoxItems";

export default function SnackBoxPaginationContainer() {
  return (
    <div className="relative">
      <div className="px-36 pb-8">
        <div className="pb-24 text-5xl font-normal">ชุดเบรกจัดให้</div>
        <div className="container pr-6">
          <SnackBoxItems cols={4} />
        </div>
      </div>
    </div>
  );
}
