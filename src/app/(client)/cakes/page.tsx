import React, { Suspense } from "react";
import TitleSection from "@/components/TitleSection";
import CakePaginationContainer from "@/components/CakePaginationContainer";
import RefreshmentCakePaginationContainer from "@/components/RefreshmentCakePaginationContainer";

// ----------------------------------------------------------------------

export default function CakePage() {
  return (
    <section>
      <TitleSection title={"เค้ก"} />
      <Suspense>
        <div className="pb-20">
          <RefreshmentCakePaginationContainer />
        </div>
        <div className="pb-20">
          <CakePaginationContainer type="PRESET" />
        </div>
      </Suspense>
    </section>
  );
}
