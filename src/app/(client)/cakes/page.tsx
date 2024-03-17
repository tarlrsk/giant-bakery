import React, { Suspense } from "react";
import TitleSection from "@/components/TitleSection";
import CustomCakeContainer from "@/components/CustomCakeContainer";
import PoundCakeItemsContainer from "@/components/PoundCakeItemsContainer";
import SingleCakeItemsContainer from "@/components/SingleCakeItemsContainer";

// ----------------------------------------------------------------------

export default function CakePage() {
  return (
    <section>
      <TitleSection title="เค้ก" />
      <Suspense>
        <div className="px-6 pb-20 ">
          <SingleCakeItemsContainer limitItems={4} />
        </div>
        <div className="px-6 pb-20 ">
          <PoundCakeItemsContainer limitItems={4} />
        </div>
        <CustomCakeContainer />
      </Suspense>
    </section>
  );
}
