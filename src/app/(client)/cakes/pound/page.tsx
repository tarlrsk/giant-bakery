import React, { Suspense } from "react";
import TitleSection from "@/components/TitleSection";
import PoundCakeItems from "@/components/PoundCakeItemsContainer";

// ----------------------------------------------------------------------

export default function CakePoundPage() {
  return (
    <section>
      <TitleSection title="เค้กปอนด์" />
      <Suspense>
        <div className=" container relative mb-20 text-center md:text-left">
          <PoundCakeItems isPoundCakePage />
        </div>
      </Suspense>
    </section>
  );
}
