import React, { Suspense } from "react";
import TitleSection from "@/components/TitleSection";
import PoundCakeItemsContainer from "@/components/PoundCakeItemsContainer";
import SingleCakeItemsContainer from "@/components/SingleCakeItemsContainer";

// ----------------------------------------------------------------------

export default function CakePage() {
  return (
    <section>
      <TitleSection title="เค้ก" />
      <Suspense>
        <div className="pb-20 px-6 ">
          <SingleCakeItemsContainer limitItems={4} />
        </div>
        <div className="pb-20 px-6 ">
          <PoundCakeItemsContainer limitItems={4} />
        </div>
      </Suspense>
    </section>
  );
}
