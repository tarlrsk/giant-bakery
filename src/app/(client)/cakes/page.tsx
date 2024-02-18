import React from "react";
import TitleSection from "@/components/TitleSection";
import CakePaginationContainer from "@/components/CakePaginationContainer";

export default function CakePage() {
  return (
    <section>
      <TitleSection title={"เค้ก"} />
      <div className="pb-20">
        <CakePaginationContainer type="CAKE" />
      </div>
      <div className="pb-20">
        <CakePaginationContainer type="PRESET" />
      </div>
      <div className="pb-20">
        <CakePaginationContainer type="CUSTOM" />
      </div>
    </section>
  );
}
