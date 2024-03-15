import React, { Suspense } from "react";
import TitleSection from "@/components/TitleSection";
import SingleCakeItemsContainer from "@/components/SingleCakeItemsContainer";

// ----------------------------------------------------------------------

export default function CakeSinglePage() {
  return (
    <section>
      <TitleSection title="เค้กชิ้น" />
      <Suspense>
        <div className="pb-20 px-6 text-center md:text-left">
          <SingleCakeItemsContainer isSingleCakePage />
        </div>
      </Suspense>
    </section>
  );
}
