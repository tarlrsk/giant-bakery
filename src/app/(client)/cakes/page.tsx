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
        <div className=" container">
          <div className="mb-20 ">
            <SingleCakeItemsContainer />
          </div>
          <div className="mb-20 ">
            <PoundCakeItemsContainer />
          </div>
          <div className="mb-20 ">
            <CustomCakeContainer />
          </div>
        </div>
      </Suspense>
    </section>
  );
}
